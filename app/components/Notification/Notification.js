import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  AlertIOS,
} from "react-native";
import {
  Container,
  Header,
  // Text,
} from "native-base";
import globals from "../../globals";
import { connect } from "react-redux";
import { logout, updateToken } from "../../actions/auth";
import { bindActionCreators } from "redux";
import styles from "./style";
import apiCallForToken from "../../controller/ApiCallForToken";
import { Navigation } from "react-native-navigation";
import { notify } from "../../actions/auth";
const backButton = {
  id: "back",
  title: "Leads",
  testID: "back",
  icon: require("../../../images/icon_left30.png"), // for icon button, provide the local image asset name
  buttonFontSize: 16,
  buttonFontWeight: "600",
};

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      data: [],
      spinner: true,
      isShowLoadMore: false,
      fetching_from_server: false,
      isSearchedItemPresent: false,
      isEmpty: true,
      showSearch: false,
      noData: false,
      nextOffset: 0,
      totalRecords: 0,
    };
    this.timer = -1;

    this.page = 0;
    this.next_offset = 0;

    this.props.navigator.setButtons({
      leftButtons: [backButton],
      animated: true, // does the change have transition animation or does it happen immediately (optional)
    });
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses
      if (event.id == "back") {
        if (this.props.onBackPressed != undefined) {
          this.props.onBackPressed();
          this.props.navigator.pop(this.props.componentId);
        }
      }
    }
  }

  componentDidMount = async () => {
    var dd = new Date().getDate();
    var mm = new Date().getMonth() + 1;
    var yy = new Date().getFullYear();
    var hh = new Date().getHours();
    var min = new Date().getMinutes();
    var sec = new Date().getSeconds();
    var lastTime = yy + "-" + mm + "-" + dd + " " + hh + ":" + min + ":" + sec;
    this.props.notify(lastTime);

    this._handleResults();
  };

  _handleResults() {
    console.log("This is search data");
    console.log();
    this.setState({ spinner: true });
    let url =
      globals.home_url +
      "/notificationList?module_name=Leads" +
      "&token_id=" +
      this.props.token +
      "&fields=" +
      globals.NOTIFICATION_FIELDS +
      "&next_offset=0" +
      "&search_text=" +
      "" +
      "&search_fields=last_name" +
      "&url=" +
      globals.demo_instance +
      "&order_by=date_modified" +
      "&max_results=10" +
      "&userid=" +
      this.props.assigned_user_id +
      "&last_dateTime=''";
    // globals.reFormatDateToSendOnServer(this.props.last_check)

    console.log("This is search data" + url);

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
        console.log("This is search data", JSON.stringify(response));
        console.log(response);
        proceed = true;
        if (response.success === true) {
          response.data.info.result_count === 0
            ? this.setState({
                noData: true,
              })
            : this.setState({
                totalRecords: response.data.info.total_count,
                nextOffset: response.data.info.next_offset,
              });
          this.setLoadMoreFooterVisibility(response);
          this.setState({
            isEmpty: false,
            data: response.data.result,
            spinner: false,
            isShowLoadMore: response.data.info.result_count > 8 ? true : false,
          });
        } else if (
          response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED
        ) {
          apiCallForToken
            .getToken(this.props)
            .then((token) => {
              console.log("getToken: token = " + token);
              if (token == null) {
                this.setState({ spinner: false, fetching_from_server: false });
                return;
              }
              //Do get leads, after session generated
              this._handleResults();
            })
            .catch((error) => {
              console.log("getToken: error = " + error);
              this.setState({ spinner: false, fetching_from_server: false });
            });
        } else {
          this.setState({
            spinner: false,
            isShowLoadMore: false,
            fetching_from_server: false,
            noData: true,
          });
        }
      })
      .catch((err) => {
        this.setState({
          spinner: false,
          isShowLoadMore: false,
          fetching_from_server: false,
          noData: true,
        });
        console.log(err);
      });
  }

  loadMoreData = () => {
    this.page = this.page + 1;
    this.next_offset = this.state.nextOffset; //this.page * LIMIT;
    this.setState({ fetching_from_server: true }, () => {
      clearTimeout(this.timer);

      this.timer = -1;

      this.timer = setTimeout(() => {
        let url =
          globals.home_url +
          "/notificationList?module_name=Leads" +
          "&token_id=" +
          this.props.token +
          "&fields=" +
          globals.NOTIFICATION_FIELDS +
          "&next_offset=0" +
          "&search_text=" +
          "" +
          "&search_fields=last_name" +
          "&url=" +
          globals.demo_instance +
          "&order_by=date_modified" +
          "&max_results=" +
          this.state.nextOffset +
          "&userid=" +
          this.props.assigned_user_id +
          "&last_dateTime=''";
        // globals.reFormatDateToSendOnServer(this.props.last_check)

        console.log("loadMoreData: url = " + url);

        fetch(url)
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
                data: [...this.state.data, ...response.data.result],
                fetching_from_server: false,
              });
            } else if (
              response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED
            ) {
              apiCallForToken
                .getToken(this.props)
                .then((token) => {
                  console.log("getToken: token = " + token);
                  if (token == null) {
                    this.setState({
                      spinner: false,
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
                    spinner: false,
                    fetching_from_server: false,
                  });
                });
            } else {
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

  notificationCountAPI = (id) => {
    this.setState({ spinner: true });
    let url = globals.home_url + "/unotificationList?lead_id=" + id;
    console.log("LEAD>>>123> ", url);
    fetch(url, {
      method: "GET",
      dataType: "jsonp",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        console.log("login response");
        if (response.success === true) {
          // alert("sucess::  " + JSON.stringify(response));
          this.setState({ spinner: false });
          // console.log("Success");
          // this._handleResults()
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
      })
      .catch((error) => {
        // alert("Failes");
        this.setState({ spinner: false });
        console.log("LEAD>>>123> ", error);
      });
  };

  printRemainingTime(t2) {
    var t2 = new Date(t2);
    const t1 = new Date().getTime();
    let ts = (t1 - t2.getTime()) / 1000;

    var d = Math.floor(ts / (3600 * 24));
    var h = Math.floor((ts % (3600 * 24)) / 3600);
    var m = Math.floor((ts % 3600) / 60);
    var s = Math.floor(ts % 60);
    if (h > 24) {
      return d + "d Ago ";
    } else {
      return h + "h " + m + "m " + "Ago ";
    }
  }

  renderFooter() {
    if (this.state.isShowLoadMore) {
      return (
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={this.loadMoreData}
            activeOpacity={0.9}
            style={styles.loadMoreBtn}
          >
            <Text style={styles.btnText}>Load More</Text>
            {this.state.fetching_from_server ? (
              <ActivityIndicator color="red" style={{ marginLeft: 8 }} />
            ) : null}
          </TouchableOpacity>
        </View>
      );
    } else return null;
  }
  render() {
    return (
      <Container style={{ paddingTop: 0, justifyContent: "center" }}>
        {this.state.spinner ? (
          <ActivityIndicator
            size="large"
            color="red"
            animating={this.state.spinner}
            style={{ alignSelf: "center" }}
          />
        ) : (
          <View style={{ height: "100%", justifyContent: "center" }}>
            {this.state.noData ? (
              <View style={{ height: "100%", justifyContent: "center" }}>
                <Text style={[styles.leadStyle, { alignSelf: "center" }]}>
                  No Data Found
                </Text>
              </View>
            ) : (
              <FlatList
                data={this.state.data}
                ListFooterComponent={this.renderFooter.bind(this)}
                style={{ width: "100%", paddingLeft: 5, paddingRight: 3 }}
                keyExtractor={(item, index) => index}
                pagingEnabled={true}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.notificationCountAPI(item.id);
                    }}
                    style={[
                      styles.renderView,
                      {
                        backgroundColor:
                          item.mobile_notification_status_c == "1"
                            ? "white"
                            : "#DCDCDC",
                      },
                    ]}
                  >
                    <View style={{ width: "70%" }}>
                      <Text style={styles.descStyles}>
                        {item.assigned_user_name === this.props.username
                          ?"Lead " +item.name + " assigned to you."
                          : "Lead " + item.name +
                            " assigned to " +
                            item.assigned_user_name}
                      </Text>
                    </View>
                    <View style={{ width: "30%" }}>
                      <Text style={styles.dateStyles}>
                        {globals.dateFromNow(item.date_entered)}
                      </Text>
                      <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <Text style={styles.leadStyle}>{"LEAD"}</Text>
                        <Image
                          source={require("../../../images/leads.png")}
                          style={styles.renderImage}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    username: state.auth.username,
    assigned_user_id: state.auth.assigned_user_id,
    last_check: state.auth.last_check,
    password: state.auth.password,
    token: state.auth.token,
    url: state.auth.url,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ notify, logout, updateToken }, dispatch);
};

export default Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(Notification); // import { Alert} from 'react-native';
