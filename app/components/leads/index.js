import React, { Component } from "react";
import {
  View,
  ActionSheetIOS,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  NetInfo,
  Alert,
  StyleSheet,
  FlatList,
  Platform,
  ActivityIndicator,
  AlertIOS,
} from "react-native";
import globals from "../../globals";
import { connect } from "react-redux";
import { logout, updateToken } from "../../actions/auth";
import { bindActionCreators } from "redux";

import {
  Card,
  ListItem,
  Header,
  Item,
  Input,
  Icon,
  Button,
  Spinner,
  Body,
  Content,
  Container,
} from "native-base";

import styles from "./style";
import { SearchBar } from "react-native-elements";
import OfflineNotice from "../../offlineNotice";
const deviceHeight = Dimensions.get("window").height;
import { Navigation } from "react-native-navigation";
const LIMIT = 20;
import Swipeout from "react-native-swipeout";
import apiCallForToken from "../../controller/ApiCallForToken";

// Buttons
var swipeoutBtns = [
  {
    text: "Button",
  },
];

class Leads extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      serverData: [],
      fetching_from_server: false,
      id: "",
      name: "",
      url: "",
      query: "",
      isSearchedItemPresent: false,
      isEmpty: true,
      showSearch: false,
      check: false,
      isShowLoadMore: false,

      nextOffset: 0,
      totalRecords: 0,
    };

    this._handleResults = this._handleResults.bind(this);
    //this.getLeads = this.getLeads.bind(this);

    this.timer = -1;

    this.page = 0;
    this.next_offset = 0;

    this.props.navigator.setButtons({
      rightButtons: [
        {
          id: "add", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          testID: "e2e_rules", // optional, used to locate this view in end-to-end tests
          disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
          disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
          buttonColor: "blue", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontWeight: "600", // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
          systemItem: "add",
        },
        {
          id: "filter", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
          disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
          buttonColor: "#1870ff", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontWeight: "600", // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
          icon: require("../../../images/filter.png"), // for icon button, provide the local image asset name
        },
        {
          id: "search", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          testID: "e2e_search", // optional, used to locate this view in end-to-end tests
          disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
          disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
          buttonColor: "blue", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontWeight: "600", // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
          systemItem: "search",
        },
      ], // see "Adding buttons to the navigator" below for format (optional)

      leftButtons: [
        {
          icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
          id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        },
      ],
      animated: true, // does the change have transition animation or does it happen immediately (optional)
    });

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.props.navigator.setDrawerEnabled({
      side: "left", // the side of the drawer since you can have two, 'left' / 'right'
      enabled: true, // should the drawer be enabled or disabled (locked closed)
    });
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "add") {
        this.props.navigator.push({
          screen: "app.Create",
          title: "Create Lead",
          subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
          passProps: {}, // Object that will be passed as props to the pushed screen (optional)
          animated: true, // does the push have transition animation or does it happen immediately (optional)
          animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
          backButtonTitle: "Back", // override the back button title (optional)
          backButtonHidden: false, // hide the back button altogether (optional)
          navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
          navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
          // enable peek and pop - commited screen will have `isPreview` prop set as true.
          previewView: undefined, // react ref or node id (optional)
          previewHeight: undefined, // set preview height, defaults to full height (optional)
          previewCommit: true, // commit to push preview controller to the navigation stack (optional)
          previewActions: [
            {
              // action presses can be detected with the `PreviewActionPress` event on the commited screen.
              id: "", // action id (required)
              title: "", // action title (required)
              style: undefined, // 'selected' or 'destructive' (optional)
              actions: [], // list of sub-actions
            },
          ],
        });
      }

      if (event.id == "menu") {
        this.props.navigator.toggleDrawer({
          side: "left", // the side of the drawer since you can have two, 'left' / 'right'
          animated: true, // does the toggle have transition animation or does it happen immediately (optional)
          to: "missing", // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
        });
      }

      if (event.id == "search") {
        this.showHideSearch();
      }

      if (event.id == "filter") {
        Navigation.startSingleScreenApp({
          screen: {
            screen: "app.FilterScreen", // unique ID registered with Navigation.registerScreen
            title: "Leads Filter", // title of the screen as appears in the nav bar (optional)
            navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
          },

          drawer: {
            // optional, add this if you want a side menu drawer in your app
            left: {
              // optional, define if you want a drawer from the left
              screen: "app.Menu", // unique ID registered with Navigation.registerScreen
              passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
              disableOpenGesture: false, // can the drawer be opened with a swipe instead of button (optional, Android only)
              fixedWidth: 500, // a fixed width you want your left drawer to have (optional)
            },
            style: {
              // ( iOS only )
              drawerShadow: false, // optional, add this if you want a side menu drawer shadow
              contentOverlayColor: "rgba(0,0,0,0.25)", // optional, add this if you want a overlay color when drawer is open
              leftDrawerWidth: 70, // optional, add this if you want a define left drawer width (50=percent)
              rightDrawerWidth: 50, // optional, add this if you want a define right drawer width (50=percent)
            },
            type: "TheSideBar", // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
            animationType: "slide-and-scale", //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
            // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
            disableOpenGesture: false, // optional, can the drawer, both right and left, be opened with a swipe instead of button
          },
          passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
          animationType: "slide-left",
          backButtonTitle: "Back", // override the back button title (optional)
          backButtonHidden: false,
        });
      }
    }
  }

  goBack() {
    this.props.navigator.push({
      screen: "app.Home",
      title: "Home",
      subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
      passProps: {}, // Object that will be passed as props to the pushed screen (optional)
      animated: true, // does the push have transition animation or does it happen immediately (optional)
      animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
      backButtonTitle: "Back", // override the back button title (optional)
      backButtonHidden: false, // hide the back button altogether (optional)
      navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
      navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
      // enable peek and pop - commited screen will have `isPreview` prop set as true.
      previewView: undefined, // react ref or node id (optional)
      previewHeight: undefined, // set preview height, defaults to full height (optional)
      previewCommit: true, // commit to push preview controller to the navigation stack (optional)
      previewActions: [
        {
          // action presses can be detected with the `PreviewActionPress` event on the commited screen.
          id: "", // action id (required)
          title: "", // action title (required)
          style: undefined, // 'selected' or 'destructive' (optional)
          actions: [], // list of sub-actions
        },
      ],
    });
  }

  //!this code is not in use
  // delete = (id, index) => {

  //     this.setState({ loading: true });
  //     this.setState({ dataHasValue: false });
  //     var proceed = false;
  //     var data = [];

  //     fetch(globals.portal_url + "/leads/delete/" + id + "?token=" + this.state.token, {
  //         method: "POST",
  //         dataType: 'jsonp',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Accept': 'application/json'
  //         }
  //     })
  //         .then((response) => {
  //             return response.json() // << This is the problem
  //         })
  //         .then((response) => {

  //         })
  //         .then(() => {
  //             // this._fetchTickets(this.state.token);
  //             console.log('index ' + index);
  //             data = this.state.datas;
  //             delete data[index];
  //             this.setState({ datas: data });
  //             console.log(data);
  //             this.setState({ dataHasValue: true });
  //             this.setState({ loading: false });
  //         })
  //         .catch(err => {
  //             console.log(err);
  //         });
  // }

  //style the status element on the list view. Add colors according to the lead status

  _getRowStyle(status) {
    switch (status) {
      /**
 * Open: #F68F66
Duplicate Lead: #4ED0E0
Existing Client: #A3897C
CSO Allocated: #7687CD
RM Allocated: #9DA7D8
Converted: #40956A
Lost: #BF5151
Appointment: #69CA84
Follow Up: #F8CC4F
Cross Sell: #C89DCF
 */

      case "Open":
        return {
          backgroundColor: globals.lead_status_color.new,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;
      case "Duplicate Lead":
        return {
          backgroundColor: globals.lead_status_color.assigned,
          color: "grey",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;
      case "Existing Client":
        return {
          backgroundColor: globals.lead_status_color.inprocess,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;
      case "CSO Allocated":
        return {
          backgroundColor: globals.lead_status_color.recycled,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;
      case "RM Allocated":
        return {
          backgroundColor: globals.lead_status_color.rm_allocated,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;
      case "Converted":
        return {
          backgroundColor: globals.lead_status_color.converted,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;
      case "Lost":
        return {
          backgroundColor: globals.lead_status_color.dead,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;
      case "Appointment":
        return {
          backgroundColor: globals.lead_status_color.appointed,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;
      case "Follow Up":
        return {
          backgroundColor: globals.lead_status_color.follow_up,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;
      case "Cross Sell":
        return {
          backgroundColor: globals.lead_status_color.cross_sell,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;

      default:
        return {
          backgroundColor: globals.lead_status_color.new,
          color: "white",
          textAlign: "center",
          borderRadius: 5,
          width: 85,
        };
        break;

      // case 'New': return ({ backgroundColor: globals.lead_status_color.new, color: 'white', textAlign: 'center', borderRadius: 5, width: 45 }); break;
      // case 'Assigned': return ({ backgroundColor: globals.lead_status_color.assigned, color: 'grey', textAlign: 'center', borderRadius: 5, width: 65 }); break;
      // case 'In Process': return ({ backgroundColor: globals.lead_status_color.inprocess, color: 'white', textAlign: 'center', borderRadius: 5, width: 75 }); break;
      // case 'Recycled': return ({ backgroundColor: globals.lead_status_color.recycled, color: 'white', textAlign: 'center', borderRadius: 5, width: 85 }); break;
      // case 'Converted': return ({ backgroundColor: globals.lead_status_color.converted, color: 'white', textAlign: 'center', borderRadius: 5, width: 85 }); break;
      // case 'Dead': return ({ backgroundColor: globals.lead_status_color.dead, color: 'white', textAlign: 'center', borderRadius: 5, width: 85 }); break;
      // default: return ({ backgroundColor: globals.lead_status_color.new, color: 'white', textAlign: 'center', borderRadius: 5, width: 85 }); break;
    }
  }

  //go to the detail view from the list view by clicking on the list item, click event is
  //given in the UI
  goDetail(id) {
    this.props.navigator.push({
      screen: "app.Details",
      title: "Lead",
      subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
      passProps: { lead_id: id, from_list: false }, // Object that will be passed as props to the pushed screen (optional)
      animated: true, // does the push have transition animation or does it happen immediately (optional)
      animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
      backButtonTitle: "Back", // override the back button title (optional)
      backButtonHidden: false, // hide the back button altogether (optional)
      navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
      navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
      // enable peek and pop - commited screen will have `isPreview` prop set as true.
      previewView: undefined, // react ref or node id (optional)
      previewHeight: undefined, // set preview height, defaults to full height (optional)
      previewCommit: true, // commit to push preview controller to the navigation stack (optional)
      previewActions: [
        {
          // action presses can be detected with the `PreviewActionPress` event on the commited screen.
          id: "", // action id (required)
          title: "", // action title (required)
          style: undefined, // 'selected' or 'destructive' (optional)
          actions: [], // list of sub-actions
        },
      ],
    });
  }

  //once the screen loads component is mounted and the methods inside this block will be called
  componentDidMount() {
    this.getLeads();
  }

  getLeads() {
    this.setState({ loading: true });
    console.log("inside leads api");
    console.log("inside leads api getLeads token = " + this.props.token);

    this.next_offset = this.state.nextOffset; //this.page * LIMIT;
    let url =
      globals.home_url +
      "/uindex" +
      "?token_id=" +
      this.props.token +
      "&module_name=" +
      globals.leads +
      "&fields=" +
      globals.LEADS_FIELDS +
      "&next_offset=" +
      this.next_offset +
      "&search_text=" +
      "&search_fields=" +
      globals.LEADS_SEARCH_FIELDS +
      "&order_by=date_entered" +
      "&max_results=20" +
      "&url=" +
      this.props.url +
      "&type=" +
      this.props.filterData;

    console.log("GetLeads url = " + url);

    fetch(url, {
      method: "GET",
      dataType: "jsonp",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json(); // << This is the problem
      })
      .then((response) => {
        console.log(response);
        if (response.success === true) {
          this.setState({
            isEmpty: false,
            totalRecords: response.data.info.total_count,
            nextOffset: response.data.info.next_offset,
          });

          this.setLoadMoreFooterVisibility(response);

          this.setState({
            serverData: [...this.state.serverData, ...response.data.result],
            loading: false,
          });
        } else if (
          response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED
        ) {
          // this.setState({ loading: false });
          // Alert.alert(
          //     globals.app_messages.error_string,
          //     globals.app_messages.token_expired,
          //     [
          //     { text: globals.login, onPress: () => this.props.logout() }
          //                ],
          //     { cancelable: false }
          // )

          apiCallForToken
            .getToken(this.props)
            .then((token) => {
              console.log("getToken: token = " + token);
              if (token == null) {
                this.setState({ loading: false, fetching_from_server: false });
                return;
              }
              //Do get leads, after session generated
              this.getLeads();
            })
            .catch((error) => {
              console.log("getToken: error = " + error);
              this.setState({ loading: false, fetching_from_server: false });
              this.setState({ isEmpty: true });
            });
        } else {
          this.setState({ loading: false, isShowLoadMore: false });
          this.setState({
            isEmpty: true,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false, isShowLoadMore: false });
        this.setState({
          isEmpty: true,
        });
        console.error(error);
      });
  }

  loadMoreData = () => {
    this.page = this.page + 1;
    this.next_offset = this.state.nextOffset; //this.page * LIMIT;
    this.setState({ fetching_from_server: true }, () => {
      clearTimeout(this.timer);

      this.timer = -1;

      this.timer = setTimeout(() => {
        fetch(
          globals.home_url +
            "/uindex" +
            "?token_id=" +
            this.props.token +
            "&module_name=" +
            globals.leads +
            "&next_offset=" +
            this.next_offset +
            "&fields=" +
            globals.LEADS_FIELDS +
            "&search_text=" +
            this.state.query +
            "&search_fields=" +
            globals.LEADS_SEARCH_FIELDS +
            "&order_by=date_entered" +
            "&url=" +
            this.props.url +
            "&type=" +
            this.props.filterData
        )
          .then((response) => {
            return response.json(); // << This is the problem
          })
          .then((response) => {
            if (response.success === true) {
              this.setState({
                totalRecords: response.data.info.total_count,
                nextOffset: response.data.info.next_offset,
              });

              this.setLoadMoreFooterVisibility(response);

              this.setState({
                serverData: [...this.state.serverData, ...response.data.result],
                fetching_from_server: false,
              });
            } else if (
              response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED
            ) {
              // Alert.alert(
              //     globals.app_messages.error_string,
              //     globals.app_messages.token_expired,
              //     [
              //     { text: globals.login, onPress: () => this.props.logout() }
              //                ],
              //     { cancelable: false }
              // )

              apiCallForToken
                .getToken(this.props)
                .then((token) => {
                  console.log("getToken: token = " + token);
                  if (token == null) {
                    this.setState({
                      loading: false,
                      fetching_from_server: false,
                    });
                    return;
                  }
                  //Do get leads, after session generated
                  this.loadMoreData();
                })
                .catch((error) => {
                  console.log("getToken: error = " + error);
                  this.setState({
                    loading: false,
                    fetching_from_server: false,
                  });
                });
            } else {
              //Alert.alert('Error', 'No more data');
              this.setState({
                fetching_from_server: false,
                isShowLoadMore: false,
              });
              this.page = 0;
              this.next_offset = 0;
            }
          })
          .catch((error) => {
            this.setState({
              fetching_from_server: false,
              isShowLoadMore: false,
            });
            console.error(error);
          });
      }, 1500);
    });
  };

  /**
   *
   * @param {*} response this contains the result of list
   */
  setLoadMoreFooterVisibility(response) {
    console.log("loadMoreData: length = " + response.data.result.length);
    let intValueTotalRec = this.state.totalRecords;

    try {
      intValueTotalRec = parseInt(this.state.totalRecords);
    } catch (err) {
      console.log("error while parsing: err = " + err);
    }
    // const isMoreAvailable = response.data.result.length === LIMIT;
    const isMoreAvailable = response.data.result.length < intValueTotalRec; //this.state.totalRecords;//LIMIT;
    this.setState({ isShowLoadMore: isMoreAvailable });
  }

  renderFooter() {
    if (this.state.isShowLoadMore) {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={this.loadMoreData}
            style={styles.loadMoreBtn}
          >
            <Text style={styles.btnText}>{globals.load_more}</Text>
            {this.state.fetching_from_server ? (
              <ActivityIndicator color="red" style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        </View>
      );
    } else return null;
  }

  _handleResults(input) {
    console.log("This is search data");
    console.log(input);
    this.setState({ loading: true });
    //console.log('query: ', this.state.query);

    let url =
      globals.home_url +
      "/uindex" +
      "?token_id=" +
      this.props.token +
      "&module_name=" +
      globals.leads +
      "&fields=" +
      globals.LEADS_FIELDS +
      "&next_offset=0" +
      "&search_text=" +
      input +
      "&search_fields=" +
      globals.LEADS_SEARCH_FIELDS +
      "&order_by=date_entered" +
      "&url=" +
      this.props.url +
      "&type=" +
      this.props.filterData;

    fetch(url, {
      method: "GET",
      dataType: "jsonp",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json(); // << This is the problem
      })
      .then((response) => {
        console.log("lead api response");
        console.log(response);
        proceed = true;
        if (response.success === true) {
          console.log("here in search");

          this.setLoadMoreFooterVisibility(response);

          // this.setState({ datas: [...this.state.datas, ...response.data.result], loading: false });
          this.setState({
            isEmpty: false,
            serverData: response.data.result,
            loading: false,
          });
        } else if (
          response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED
        ) {
          // this.setState({ isShowLoadMore: false, })
          // Alert.alert(
          //     globals.app_messages.error_string,
          //     globals.app_messages.token_expired,
          //     [
          //     { text: globals.login, onPress: () => this.props.logout() }
          //                ],
          //     { cancelable: false }
          // )

          apiCallForToken
            .getToken(this.props)
            .then((token) => {
              console.log("getToken: token = " + token);
              if (token == null) {
                this.setState({ loading: false, fetching_from_server: false });
                return;
              }
              //Do get leads, after session generated
              this._handleResults(input);
            })
            .catch((error) => {
              console.log("getToken: error = " + error);
              this.setState({ loading: false, fetching_from_server: false });
            });
        } else {
          this.setState({
            loading: false,
            isShowLoadMore: false,
            fetching_from_server: false,
          });
          AlertIOS.alert(
            "Error",
            response.data.description === undefined
              ? response.message
              : response.data.description
          );
        }
      })
      .catch((err) => {
        this.setState({
          loading: false,
          isShowLoadMore: false,
          fetching_from_server: false,
        });
        console.log(err);
      });
  }

  clearSearchBox() {
    this.setState({ query: "", nextOffset: 0, serverData: [] }, () => {
      this.page = 0;
      this.next_offset = 0;
      this.getLeads();
    });
  }

  showHideSearch() {
    this.setState((prevState) => ({
      check: !prevState.check,
    }));
  }

  delete(id) {
    //this.props.lead_id
    this.setState({ loading: true });
    let url =
      globals.home_url +
      "/udestroy" +
      "?token_id=" +
      this.props.token +
      "&id=" +
      id +
      "&module_name=" +
      globals.leads +
      "&url=" +
      this.props.url;
    console.log(url);

    fetch(url, {
      method: "GET",
      dataType: "jsonp",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json(); // << This is the problem
      })
      .then((response) => {
        console.log(response);
        proceed = true;
        if (response.success === true) {
          if (response.data.result) {
            this.setState({
              serverData: [],
            });
            if (this.state.query != "") {
              this.clearSearchBox();
              this.showHideSearch();
            } else {
              this.getLeads();
            }
          }
        } else if (
          response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED
        ) {
          // this.setState({ loading: false });

          // Alert.alert(
          //     globals.app_messages.error_string,
          //     globals.app_messages.token_expired,
          //     [
          //     { text: globals.login, onPress: () => this.props.logout() }
          //                ],
          //     { cancelable: false }
          // )

          apiCallForToken
            .getToken(this.props)
            .then((token) => {
              console.log("getToken: token = " + token);
              if (token == null) {
                this.setState({ loading: false, fetching_from_server: false });
                return;
              }
              //Delete the lead, after session generated
              this.delete(id);
            })
            .catch((error) => {
              console.log("getToken: error = " + error);
              this.setState({ loading: false, fetching_from_server: false });
            });
        } else {
          this.setState({ loading: false });

          Alert.alert("Error", response.data.description);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  }

  showAlert(id, item) {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        // options: ['Cancel', 'Delete', 'Edit'],
        options: ["Cancel", "Edit"],
        // destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        // if (buttonIndex === 1) {
        //     Alert.alert(
        //         'Alert',
        //         'Are you sure you want to delete this Lead?',
        //         [
        //             {
        //                 text: 'OK',
        //                 onPress: () => this.delete(id)
        //             },
        //             { text: 'Cancel', style: 'cancel' },
        //         ],
        //         { cancelable: false }
        //     )
        // }

        // if (buttonIndex === 2) {
        if (buttonIndex === 1) {
          //if you want to go to the edit record screen from the list view, you would have to
          //go to the details screen first, cause only the id field we take it to the detail screen
          //and from there we send a complete object to edit screen
          //so following the same pattern
          //go to detail view and check if the value is coming from the list view and then navigate to the edti screen
          this.props.navigator.push({
            screen: "app.Details",
            title: "Lead",
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: { lead_id: id, from_list: true }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
            backButtonTitle: "Back", // override the back button title (optional)
          });
        }
      }
    );
  }

  formatPhoneNumber = (phoneS) =>
    "X".repeat(Math.min(phoneS.length / 2, phoneS.length)) +
    phoneS.slice(phoneS.length / 2);

  render() {
    return (
      <Container>
        <Content>
          <OfflineNotice />

          {this.state.loading && (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                flex: 1,
                height: deviceHeight,
              }}
            >
              <Spinner color="red" />
            </View>
          )}

          {this.state.loading == false && (
            <View style={styles.container}>
              {this.state.isEmpty ? (
                <View
                  style={{
                    backgroundColor: "#f2f2f2",
                    alignItems: "center",
                    height: deviceHeight,
                    flexDirection: "column",
                    justifyContent: "center",
                    flex: 1,
                  }}
                >
                  <Text style={{ color: "grey" }}>No Leads</Text>
                </View>
              ) : (
                <View>
                  {/* <SearchBar
                                            ref={search => this.search = search}
                                            lightTheme
                                            showLoading
                                            platform="ios"
                                            cancelButtonTitle="Cancel"
                                            placeholder='Search'
                                            round
                                            icon={{ type: 'font-awesome', name: 'search' }}
                                            onChangeText={this._handleResults}
                                            data={this.state.datas}
                                        /> */}

                  {this.state.check && (
                    <View style={{ backgroundColor: "#fff" }}>
                      <Header
                        searchBar
                        rounded
                        transparent
                        style={{ paddingTop: 5 }}
                      >
                        <Item>
                          <Icon name="ios-search" />
                          <Input
                            placeholder="Search"
                            value={this.state.query}
                            onChangeText={(text) =>
                              this.setState({ query: text })
                            }
                            returnKeyLabel={"Search"}
                            onSubmitEditing={()=>{
                              this._handleResults(this.state.query)
                            }}
                          />
                          {this.state.query.length > 0 && (
                            <Icon
                              name="ios-close"
                              onPress={() => this.clearSearchBox()}
                            />
                          )}
                        </Item>
                        <Button
                          transparent
                          onPress={() => this._handleResults(this.state.query)}
                        >
                          <Text style={{ color: globals.colors.blue_default }}>
                            Search
                          </Text>
                        </Button>
                      </Header>
                    </View>
                  )}

                  <FlatList
                    style={{ width: "100%", paddingLeft: 5, paddingRight: 3 }}
                    keyExtractor={(item, index) => index}
                    data={this.state.serverData}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => (
                      <Card>
                        <ListItem
                          style={styles.listItem}
                          onPress={() => this.goDetail(item.id)}
                          onLongPress={() => this.showAlert(item.id, item)}
                        >
                          <Body
                            style={{
                              paddingTop: 0,
                              marginTop: 0,
                              marginLeft: 3,
                            }}
                          >
                            <View style={{ flex: 1 }}>
                              {/* <View style={{ flex: 0.05 }}>
                                                                    </View> */}
                              <View style={{ flex: 0.95 }}>
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                  <View>
                                    <View>
                                      <View>
                                        <Text
                                          style={{
                                            fontSize: 16,
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {item.name}
                                        </Text>
                                      </View>
                                    </View>
                                    {item.interested_product_c != "" ? (
                                      <View>
                                        <View>
                                          <Text
                                            style={{
                                              fontSize: 14,
                                              marginTop: 1,
                                              color: globals.colors.grey,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {item.interested_product_c}
                                          </Text>
                                        </View>
                                      </View>
                                    ) : (
                                      <View>
                                        <View>
                                          <Text
                                            style={{
                                              fontSize: 14,
                                              marginTop: 1,
                                              color: globals.colors.grey,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {
                                              globals.missing_texts
                                                .product_interested_missing
                                            }
                                          </Text>
                                        </View>
                                      </View>
                                    )}

                                    {item.email1 != "" ? (
                                      <View>
                                        <View>
                                          <Text
                                            style={{
                                              fontSize: 14,
                                              marginTop: 1,
                                              color: globals.colors.grey,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {this.formatPhoneNumber(
                                              item.email1
                                            )}
                                          </Text>{" "}
                                        </View>
                                      </View>
                                    ) : (
                                      <View>
                                        <View>
                                          <Text
                                            style={{
                                              fontSize: 14,
                                              marginTop: 1,
                                              color: globals.colors.grey,
                                              fontStyle: "italic",
                                            }}
                                          >
                                            {
                                              globals.missing_texts
                                                .email_missing
                                            }
                                          </Text>{" "}
                                        </View>
                                      </View>
                                    )}
                                  </View>
                                  {/* this is to show a lead category on the list item */}
                                  {/* <View style={{ flex: 1, alignItems: 'flex-end', paddingTop: 5,}} > */}

                                  {/* {item.category_c === 'Cold' &&
                                                                                    <Image source={require('../../../images/cold.png')}
                                                                                        style={{ width: 40, height: 40 }} />
                                                                                } */}
                                  {/* 
                                                                                {item.category_c === 'Hot' &&
                                                                                    <Image source={require('../../../images/hot.png')}
                                                                                        style={{ width: 20, height: 20 }} />
                                                                                } */}

                                  {/* {item.category_c === 'Warm' &&
                                                                                    <Image source={require('../../../images/warm.png')}
                                                                                        style={{ width: 40, height: 40 }} />
                                                                                } */}
                                  {/* </View> */}
                                </View>
                                {item.phone_mobile != "" ? (
                                  <View
                                    style={{ flex: 1, flexDirection: "row" }}
                                  >
                                    <View>
                                      <Text
                                        style={{
                                          fontSize: 14,
                                          marginTop: 3,
                                          color: globals.colors.grey,
                                          fontStyle: "italic",
                                        }}
                                      >
                                        {this.formatPhoneNumber(
                                          item.phone_mobile
                                        )}
                                      </Text>{" "}
                                    </View>
                                    <View
                                      style={{
                                        flex: 1,
                                        alignItems: "flex-end",
                                      }}
                                    >
                                      <Card>
                                        {" "}
                                        <Text
                                          style={this._getRowStyle(item.status)}
                                        >
                                          {item.status}
                                        </Text>
                                      </Card>
                                    </View>
                                  </View>
                                ) : (
                                  <View
                                    style={{ flex: 1, flexDirection: "row" }}
                                  >
                                    <View>
                                      <Text
                                        style={{
                                          fontSize: 14,
                                          marginTop: 3,
                                          color: globals.colors.grey,
                                          fontStyle: "italic",
                                        }}
                                      >
                                        {globals.missing_texts.phone_missing}
                                      </Text>{" "}
                                    </View>
                                    <View
                                      style={{
                                        flex: 1,
                                        alignItems: "flex-end",
                                      }}
                                    >
                                      <Card>
                                        {" "}
                                        <Text
                                          style={this._getRowStyle(item.status)}
                                        >
                                          {item.status}
                                        </Text>
                                      </Card>
                                    </View>
                                  </View>
                                )}
                              </View>
                            </View>
                          </Body>
                        </ListItem>
                      </Card>
                    )}
                    ItemSeparatorComponent={() => (
                      <View style={styles.separator} />
                    )}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    // ListHeaderComponent = { this.renderHeader.bind( this ) }
                  />
                </View>
              )}
            </View>
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    loginTime: state.auth.loginTime,
    username: state.auth.username,
    password: state.auth.password,
    token: state.auth.token,
    url: state.auth.url,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ logout, updateToken }, dispatch);
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Leads);
