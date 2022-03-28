import React, { Component } from "react";
import {
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  AlertIOS,
  Dimensions,
  StatusBar,
  TouchableHighlight,
  YellowBox,
  Image,
  NativeModules,
} from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Header,
  Spinner,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
} from "native-base";
import { login } from "../../actions/auth";
import {
  logout,
  updateToken,
  updateProfilePic,
  updateAction,
  updateDynamicDropdowns,
} from "../../actions/auth";
import { bindActionCreators } from "redux";
import styles from "./style";
import FontAwesome, { Icons } from "react-native-fontawesome";
import Hamburger from "react-native-hamburger";
import { Navigation } from "react-native-navigation";
import globals from "../../globals";
import firebase from "react-native-firebase";

const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const d = new Date();

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let date = d.getDate() + " " + monthNames[d.getMonth()];
let currentDay = days[d.getDay()];

// YellowBox.ignoreWarnings(['Warning: ...']);
import NotificatioListener from "./../../NotificationListener";
import CheckIfNewVersionAvailable from "../../controller/appversioning/CheckIfNewVersionAvailable";
import { ACTION_PERSIST_REHYDRATE, ACTION_LOGIN } from "../../store";
import { Linking } from "react-native";
import apiCallForToken from "../../controller/ApiCallForToken";

class TileMenu extends Component {
  // static navigatorButtons = {
  //   rightButtons: [
  //     {
  //       id: "note", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
  //       testID: "e2e_rules", // optional, used to locate this view in end-to-end tests
  //       disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
  //       disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
  //       buttonColor: "blue", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
  //       buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
  //       buttonFontWeight: "600", // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
  //       systemItem: "compose",
  //     },
  //     {
  //       id: "notification", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
  //       testID: "e2e_rules", // optional, used to locate this view in end-to-end tests
  //       disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
  //       disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
  //       buttonColor: "blue", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
  //       buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
  //       buttonFontWeight: "600", // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
  //       // systemItem: 'compose'
  //       icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
  //     },
  //   ],

  //   leftButtons: [
  //     {
  //       icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
  //       id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
  //     },
  //   ],
  // };
  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      username: "",
      password: "",
      loading: true,
      image_url: "",
      notificationCount: "",
    };

    this.props.navigator.setDrawerEnabled({
      side: "left", // the side of the drawer since you can have two, 'left' / 'right'
      enabled: true, // should the drawer be enabled or disabled (locked closed)
    });
    this.props.navigator.setStyle({
      navBarCustomView: "TopBar",
      navBarCustomViewInitialProps: { navigator: this.props.navigator },
      // drawUnderNavBar: true,
      // navBarTransparent: true,
      // navBarBackgroundColor: "transparent",
      navBarBackgroundColor: 'white',
      navBarTextColor: '#0067ff',
      navBarButtonColor: '#0067ff'
    });
  }

  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      // this is the event type for button presses

      if (event.id == "menu") {
        this.props.navigator.toggleDrawer({
          side: "left", // the side of the drawer since you can have two, 'left' / 'right'
          animated: true, // does the toggle have transition animation or does it happen immediately (optional)
          to: "missing", // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
        });
      }
      if (event.id === "note") {
        // open new screen with list of all notes
        this.props.navigator.push({
          screen: "app.Notes",
          title: "Notes",
          subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
          passProps: {}, // Object that will be passed as props to the pushed screen (optional)
          animated: true, // does the push have transition animation or does it happen immediately (optional)
          animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
          backButtonTitle: "Back", // override the back button title (optional)
          backButtonHidden: false, // hide the back button altogether (optional)
        });
      }
      if (event.id === "notification") {
        // open new screen with list of all notes
        this.props.navigator.push({
          screen: "app.Notification",
          title: "Notification",
          subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
          passProps: {}, // Object that will be passed as props to the pushed screen (optional)
          animated: true, // does the push have transition animation or does it happen immediately (optional)
          animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
          backButtonTitle: "Back", // override the back button title (optional)
          backButtonHidden: false, // hide the back button altogether (optional)
        });
      }
    }
  }

  checkLogin() {
    console.log(this.props.isLoggedIn);
    let url =
      globals.home_url +
      "/checkAuth" +
      "?token_id=" +
      this.props.systemItemsystemItem +
      "&url=" +
      this.props.url;
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
          if (response.data.result === 0) {
            apiCallForToken
              .getToken(this.props)
              .then((token) => {
                console.log("getToken: token = " + token);
                if (token == null) {
                  this.setState({ loading: false });
                  return;
                }

                this.setState({ loading: false });
              })
              .catch((error) => {
                console.log("getToken: error = " + error);
                this.setState({ loading: false });
              });
          } else {
            this.setState({ loading: false });
          }
        } else {
          this.setState({ loading: false });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loading: false });
        if (err.message === "Network request failed") {
          console.log("Instance of Network request failed");
          //onclick of alert's ok button, exit the app
          alert("Something went wrong. Please check later.");
        } else {
          console.log("NOT INSTANCE OF");
        }
      });
  }

  componentWillMount() {
    console.log("tilemenu.index: componentWillMount: notification");
    // new NotificatioListener(this);
  }

  componentDidMount() {
    console.log("tilemenu.index: componentDidMount: notification");
    console.log("SalesMobi: App this.props.Version: " + this.props.version);

    console.log("appVersion: " + this.props.version);
    console.log("buildVersion: " + this.props.buildVersion);
    console.log("bundleIdentifier: " + this.props.bundleIdentifier);

    this.profilePhoto();

    // new NotificatioListener(this, false);

    this.checkLogin();
    //check
    new CheckIfNewVersionAvailable(this.props.version);

    console.log("INSTANCE URL Is = " + this.props.url);
    this.getLeadsDropdown();
    
    var t2 = new Date(this.props.loginTime)
    const t1 = new Date().getTime();
    let ts = (t1 - t2.getTime()) / 1000;
    var h = Math.floor((ts % (3600 * 24)) / 3600);
    if (h > 24) {
      this.props.logout()
    } 
  }

  getLeadsDropdown() {
    fetch(globals.demo_instance + "index.php?entryPoint=getleadsdropdownlist", {
      method: "GET",
      dataType: "jsonp",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          //Save in one variable
          let salutation = [];
          let lead_source = [];
          let status = [];
          let interested_product_c = [];
          let disposition_category_c = [];
          let occupation_type_c = [];
          let process_type_c = [];

          response.dropdowns.forEach((element) => {
            if (element.label == "salutation") {
              salutation = element.dropdown_values;
            } else if (element.label == "lead_source") {
              lead_source = element.dropdown_values;
            } else if (element.label == "status") {
              status = element.dropdown_values;
            } else if (element.label == "interested_product_c") {
              interested_product_c = element.dropdown_values;
            } else if (element.label == "disposition_category_c") {
              disposition_category_c = element.dropdown_values;
            } else if (element.label == "occupation_type_c") {
              occupation_type_c = element.dropdown_values;
            } else if (element.label == "process_type_c") {
              process_type_c = element.dropdown_values;
            }
          });

          this.props.updateDynamicDropdowns(
            salutation,
            lead_source,
            status,
            interested_product_c,
            disposition_category_c,
            occupation_type_c,
            process_type_c
          );
        }
      })
      .then(() => {})
      .catch((error) => {
        console.log("upload error", error);
      });
  }
  // getNotificationCount = () => {
  //   let url =
  //     "https://uatcrm.bajajcapital.com/genericAPI/public/api/notificationcount?user_id=" +
  //     this.props.assigned_user_id +
  //     "&last_dateTime=2021-04-08 06:32:31";

  //   console.log("This is search data" + url);

  //   fetch(url, {
  //     method: "GET",
  //     dataType: "jsonp",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //       Accept: "application/json",
  //     },
  //   })
  //     .then((response) => {
  //       return response.json(); // << This is the problem
  //     })
  //     .then((response) => {
  //       console.log("This is search data", JSON.stringify(response));
  //       // alert(response.data.info.unread_notification_count);
  //       if (response.success === true) {
  //         console.log("here in search");
  //         this.setState({
  //           spinner: false,
  //           notificationCount: response.data.info.unread_notification_count,
  //         });
  //         // this.headerView()
  //       } else {
  //         this.setState({
  //           spinner: false,
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       alert("erR " + err);
  //       this.setState({
  //         spinner: false,
  //       });
  //       console.log(err);
  //     });
  // };
  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body } = notification;
        console.log("On Notification: ", title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body, data } = notificationOpen.notification;
        // console.log("On Notification Openend: ", title, body);
        console.log(
          "On Notification Openend: " +
            title +
            "body= " +
            body +
            " data = " +
            data
        );
        console.log(
          "notificationOpen: type = " +
            data.type +
            " module: " +
            data.module +
            " id: " +
            data.id
        );

        let screenName;
        switch (data.module) {
          case "Calls":
            screenName = "app.CallDetailsCalendar";
            break;

          case "Meetings":
            screenName = "app.MeetingDetailsCalendar";
            break;

          case "Tasks":
            screenName = "app.TaskDetailsCalendar";
            break;

          default:
            screenName = "app.CallDetailsCalendar";
        }

        this.props.navigator.push({
          screen: screenName,
          title: "",
          subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
          passProps: { id: data.id, module: data.module }, // Object that will be passed as props to the pushed screen (optional)
          animated: true, // does the push have transition animation or does it happen immediately (optional)
          animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
          backButtonTitle: "Back", // override the back button title (optional)
          backButtonHidden: false, // hide the back button altogether (optional)
        });
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    // const notificationOpen = await firebase.notifications().getInitialNotification();
    // if (notificationOpen) {
    //     const { title, body } = notificationOpen.notification;
    //     this.showAlert(title, body);
    // }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log("Message listener");
      console.log(JSON.stringify(message));
    });
  }

  componentWillUnmount() {
    console.log("Tilemenu: componentWillUnmount");
    // this.notificationListener();
    // this.notificationOpenedListener();
    // this.props.updateAction('NO_ACTION')
  }

  handlePress(i) {
    //my dashboard
    if (i == 1) {
      this.props.navigator.push({
        screen: "app.Dashboard",
        title: "Dashboard",
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
        options: {
          topTabs: [
            {
              screenId: "app.MTD",
              title: "Tab1",
              passProps: {
                str: "This is a prop passed to Tab1",
                fn: () => "Hello from a function passed as passProps!",
              },
            },
            {
              screenId: "app.MTD",
              title: "Tab2",
              passProps: {
                str: "This is a prop passed to Tab2",
              },
            },
          ],
        },
      });
    }
    //recent
    else if (i == 2) {
      this.props.navigator.push({
        screen: "app.Recent",
        title: "Recent",
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
    //my leads
    else if (i == 3) {
      this.props.navigator.push({
        screen: "app.Leads",
        title: "Leads",
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
    //calendar
    else if (i == 4) {
      this.props.navigator.push({
        screen: "app.Daily",
        title: "Calendar",
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
    //accounts
    else if (i == 5) {
      this.props.navigator.push({
        screen: "app.Accounts",
        title: "Clients",
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

    //location
    else if (i == 7) {
      this.props.navigator.push({
        screen: "app.Location",
        title: "Location",
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
    //settings
    else if (i == 8) {
      this.props.navigator.push({
        screen: "app.Settings",
        title: "Settings",
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
    //SuperRM
    else if (i == 9) {
      this.showSuperRM();
    } else if (i == 10) {
      Linking.openURL(
        "https://uatcrm.bajajcapital.com/listMetabase.html"
      );

    }
  }

  showSuperRM() {
    console.log("showSuperRM: this.props.rm_code = " + this.props.rm_code);
    if (this.props.url.startsWith("https://crm.bajajcapital.com/")) {
      //Production instance, dynamic rm code etc
      this.generateValuefyToken(this.props.rm_code);
    } else {
      //UAT instance, hardcode the rm code values
      this.generateValuefyToken("102785");
    }
  }

  generateValuefyToken(rm_code) {
    console.log("rm_code = " + rm_code);
    if (rm_code != undefined && rm_code != "") {
      let url =
        "https://wealth.bajajcapital.com/api/ExternalSystemIntegration/generateToken";

      const data = new FormData();
      let jsonBody = {
        RMCode: rm_code,
      };
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": "Gdvb2QgZXhhbXBsZSBmbyBob",
          source: "external-system",
          version: "1.0",
        },
        body: JSON.stringify(jsonBody),
      })
        .then((response) => response.json())
        .then((response) => {
          console.log(
            "generateValuefyToken: response = " + JSON.stringify(response)
          );
          if (response.authentication != undefined) {
            Linking.openURL(
              "https://wealth.bajajcapital.com/rm/login?authentication=" +
                response.authentication
            );
          } else {
            if (
              response.error != undefined &&
              response.error.message != undefined
            ) {
              alert(response.error.message);
            }
          }
        })
        .catch((error) => {
          this.setState({ loading: false });
          console.log("generateValuefyToken:  error", error);
        });
    } else {
      alert("RM code is empty.");
    }
  }

  profilePhoto() {
    console.log(
      "profilePhoto: isProfileBase64 = " +
        this.props.isProfileBase64 +
        " this.props.type = " +
        this.props.type
    );
    let url =
      this.props.url +
      "index.php?entryPoint=image&id=" +
      this.props.assigned_user_id +
      "_user_profile_c&type=Users" +
      "&url=" +
      this.props.url;
    fetch(url, {
      method: "GET",
      dataType: "jsonp",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        console.log("image string: ", response);
        this.setState({
          image_url: response.content,
        });

        //save profile data in global states
        const data = response.content;
        const isBase64 = true;
        const userProfile = { data, isBase64 };
        this.props.updateProfilePic(userProfile);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    let uri = "";
    console.log(
      "TILES:RENDER: this.props.isProfileBase64 = " + this.props.isProfileBase64
    );
    if (this.props.isProfileBase64) {
      if (
        this.props.profilePicData === undefined ||
        this.props.profilePicData === ""
      ) {
        uri = "";
      } else {
        uri = `data:${"image/jpeg"};base64,${this.props.profilePicData}`;
      }
    } else {
      uri = this.props.profilePicData;
    }

    return (
      <Container style={styles.mainContainer}>
        <Content>
          {this.state.loading && (
            <View style={[styles.content, { marginTop: containerHeight / 3 }]}>
              <Spinner color="red" />
            </View>
          )}

          {this.state.loading === false && (
            <View>
              <View style={styles.tileContainer1}>
                <TouchableHighlight
                  style={styles.tile1}
                  onPress={() => this.handlePress(1)}
                  underlayColor="white"
                >
                  <View style={styles.subContainer}>
                    <FontAwesome style={styles.icon}>
                      {Icons.pieChart}
                    </FontAwesome>
                    <Text style={styles.text}>
                      {" "}
                      {globals.tile_menu.dashboard}{" "}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.tile2}
                  onPress={() => this.handlePress(2)}
                  underlayColor="white"
                >
                  <View style={styles.subContainer}>
                    <FontAwesome style={styles.icon}>
                      {Icons.clockO}
                    </FontAwesome>
                    <Text style={styles.text}>
                      {" "}
                      {globals.tile_menu.recent}{" "}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.tile3}
                  onPress={() => this.handlePress(3)}
                  underlayColor="white"
                >
                  <View style={styles.subContainer}>
                    <FontAwesome style={styles.icon}>
                      {Icons.bullseye}
                    </FontAwesome>
                    <Text style={styles.text}> {globals.tile_menu.leads} </Text>
                  </View>
                </TouchableHighlight>
              </View>

              <View style={styles.tileContainer2}>
                <View style={styles.tile6}>
                  <View
                    style={{
                      flex: 0.5,
                      flexDirection: "row",
                      alignContent: "center",
                    }}
                  >
                    {uri === undefined || uri === "" ? (
                      <Image
                        source={require("../../../images/placeholder.png")}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 80 / 2,
                          marginTop: 15,
                          marginLeft: 15,
                          marginRight: 5,
                          marginBottom: 5,
                        }}
                      />
                    ) : (
                      <Image
                        source={{ uri: uri }}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 80 / 2,
                          marginTop: 15,
                          marginLeft: 15,
                          marginRight: 5,
                          marginBottom: 5,
                        }}
                      />
                    )}

                    <TouchableHighlight
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        paddingTop: 20,
                        paddingLeft: 20,
                      }}
                      onPress={() => this.handlePress(4)}
                      underlayColor="white"
                    >
                      <View>
                        <FontAwesome
                          style={{
                            fontSize: 50,
                            color: "red",
                            textAlign: "center",
                          }}
                        >
                          {Icons.calendar}
                        </FontAwesome>
                        <Text
                          style={{
                            fontSize: 15,
                            marginTop: 5,
                            fontStyle: "normal",
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          {globals.tile_menu.calendar}{" "}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                  <View style={{ flex: 0.5, flexDirection: "row" }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        paddingTop: 20,
                        paddingLeft: 20,
                        marginRight: 15,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          marginTop: 5,
                          fontStyle: "normal",
                          color: "grey",
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        {date}{" "}
                      </Text>
                      <View
                        style={{
                          borderBottomColor: "grey",
                          borderBottomWidth: 0.5,
                          marginRight: 5,
                          marginTop: 10,
                        }}
                      ></View>
                      <Text
                        style={{
                          fontSize: 15,
                          marginTop: 5,
                          fontStyle: "normal",
                          color: "grey",
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        {currentDay}{" "}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ flex: 0.333, flexDirection: "column" }}>
                  <TouchableHighlight
                    style={styles.tile4}
                    onPress={() => this.handlePress(5)}
                    underlayColor="white"
                  >
                    <View style={styles.subContainer}>
                      <FontAwesome style={styles.icon}>
                        {Icons.briefcase}
                      </FontAwesome>
                      <Text style={styles.text}>
                        {" "}
                        {globals.tile_menu.accounts}{" "}
                      </Text>
                    </View>
                  </TouchableHighlight>

                  <TouchableHighlight
                    style={styles.tile5}
                    onPress={() => this.handlePress(9)}
                    underlayColor="white"
                  >
                    <View style={styles.subContainer}>
                      <FontAwesome style={styles.icon}>
                        {Icons.user}
                      </FontAwesome>
                      <Text style={styles.text}> {"Super RM"} </Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>

              <View style={styles.tileContainer1}>
                <TouchableHighlight
                  style={styles.tile7}
                  onPress={() => this.handlePress(7)}
                  underlayColor="white"
                >
                  <View style={styles.subContainer}>
                    <FontAwesome style={styles.icon}>
                      {Icons.mapMarker}
                    </FontAwesome>
                    <Text style={styles.text}>
                      {" "}
                      {globals.tile_menu.location}{" "}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.tile8}
                  onPress={() => this.handlePress(8)}
                  underlayColor="white"
                >
                  <View style={styles.subContainer}>
                    <FontAwesome style={styles.icon}>{Icons.cog}</FontAwesome>
                    <Text style={styles.text}>
                      {" "}
                      {globals.tile_menu.settings}{" "}
                    </Text>
                  </View>
                </TouchableHighlight>

                <TouchableHighlight
                  style={styles.tile9}
                  onPress={() => this.handlePress(10)}
                  underlayColor="white"
                >
                  <View style={styles.subContainer}>
                    <FontAwesome style={styles.icon}>
                      {Icons.calendarO}
                    </FontAwesome>
                    <Text style={styles.text}> {"Reports"} </Text>
                  </View>
                </TouchableHighlight>
              </View>
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
    assigned_user_id: state.auth.assigned_user_id,
    url: state.auth.url,
    isProfileBase64: state.auth.isProfileBase64,
    profilePicData: state.auth.profilePicData,
    type: state.lastAction.type,
    rm_code: state.auth.rm_code,
    last_check: state.auth.last_check,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      updateToken,
      updateProfilePic,
      logout,
      updateAction,
      updateDynamicDropdowns,
    },
    dispatch
  );
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(TileMenu);
