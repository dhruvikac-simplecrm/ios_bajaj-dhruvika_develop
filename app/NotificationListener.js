import firebase, { messaging } from "react-native-firebase";
import { PushNotificationIOS, AppState } from "react-native";
import tilemenu from "./components/tilemenu";
import { Navigation } from "react-native-navigation";
import ScreenTiming from "../app/components/custom/ScreenTiming";
import globals from "../app/globals";
import React, { Component } from "react";
import {
  AppRegistry,
  AsyncStorage,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  StatusBar,
} from "react-native";
import { connect } from "react-redux";
let globalVar, gettoken, getuserId;
export default class NotificatioListener {
  constructor(component, initialNotification, token, userId) {
    // firebase.notifications().getInitialNotification()
    // console.log("NotificatioListener: Constructor component = " + component);
    // console.log("addEventListener: change: = " + token);
    // console.log("addEventListener: change: = " + userId);
    gettoken = token;
    getuserId = userId;
    // console.log("addEventListener: change:t = " + gettoken);
    // console.log("addEventListener: change:u = " + getuserId);
    // firebase.messaging().hasPermission()
    //     .then(enabled => {
    //         if (enabled) {
    //             firebase.messaging().getToken().then(token => {
    //                 console.log("NotificatioListener: FCM TOKEN: ", token);
    //                 // alert(token)
    //             })
    //             // user has permissions
    //         } else {
    //             firebase.messaging().requestPermission()
    //                 .then(() => {
    //                    alert("User Now Has Permission")
    //                 })
    //                 .catch(error => {
    //                     // alert("Error", "Notification Permission is denied!")
    //                     // User has rejected permissions
    //                 });
    //         }
    //     });

    // this.createNotificationListeners(component); //add this line
    console.log("isInstanceOf TileMenu: " + initialNotification);
    console.log("addEventListener: change: gloabl var " + globalVar);

    if (initialNotification) {
      this.createInitialNotificationListener(component);
    } 
    // else {
    //   firebase
    //     .messaging()
    //     .hasPermission()
    //     .then((enabled) => {
    //       if (enabled) {
    //         firebase
    //           .messaging()
    //           .getToken()
    //           .then((token) => {
    //             console.log("NotificatioListener: FCM TOKEN: ", token);
    //           });
    //         this.createForegroundNotificationListener(component);

    //         // user has permissions
    //       } else {
    //         firebase
    //           .messaging()
    //           .requestPermission()
    //           .then(() => {
    //             //    alert("Great! Now you can recieve notifications from SalesMobi.")
    //             firebase
    //               .messaging()
    //               .getToken()
    //               .then((token) => {
    //                 console.log("NotificatioListener: FCM TOKEN: ", token);
    //               });
    //             this.createForegroundNotificationListener(component);
    //           })
    //           .catch((error) => {
    //             console.log("Notification Permission Error = " + error);
    //             alert(
    //               "Please allow notification permission from settings in order to receive notifications from BajajCapital SuperRM."
    //             );
    //             // User has rejected permissions
    //           });
    //       }
    //     });
    // }
    // this.askPermission();
    // firebase.messaging().onMessage((response) => {
    //   alert(JSON.stringify(response));
    // });
  }

  async askPermission() {
    firebase
      .messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          // alert('Yes')
          firebase
            .messaging()
            .getToken()
            .then((fcmToken) => {
              if (fcmToken) {
                // alert(fcmToken);
                console.log(fcmToken);
                // user has a device token
              } else {
                alert("Not");
                // user doesn't have a device token yet
              }
            });
        } else {
          messaging()
            .requestPermission()
            .then((data) => {
              alert(data);
              firebase
                .messaging()
                .getToken()
                .then((fcmToken) => {
                  if (fcmToken) {
                    alert(fcmToken);
                    console.log(fcmToken);
                    // user has a device token
                  } else {
                    alert("Not");
                    // user doesn't have a device token yet
                  }
                });
            });
        }
      });
  }

  clearNotification(userInfo) {
    console.log("clearNotification : userInfo = " + userInfo);
    PushNotificationIOS.cancelAllLocalNotifications(userInfo);
  }

  //    async createLocalNotificationListener(){
  //       PushNotificationIOS.getScheduledLocalNotifications((array)=>{
  //             console.log("createLocalNotificationListener: array = "+array)
  //       });
  //     }

  async createInitialNotificationListener(component) {
    function appOpenedByNotificationTap(notification) {
      // This is your handler. The tapped notification gets passed in here.
      // Do whatever you like with it.
      console.log("appOpenedByNotificationTap: " + notification);

      /**
       *
       * notification= {"_data":
       * {"id":"userInfoId123","module":"userInfoModule_Calls","type":"userInfoType_Calendar"},
       * "_remoteNotificationCompleteCallbackCalled":false,"_isRemote":false,"_badgeCount":0,
       * "_sound":"default","_alert":"Some message for dummy notification","_category":null}
       */
      console.log(
        "appOpenedByNotificationTap: string = " + JSON.stringify(notification)
      );

      console.log("appOpenedByNotificationTap: title = " + notification._alert);
      console.log("appOpenedByNotificationTap: data = " + notification._data);

      doAction(component, notification._data, notification._alert);
    }

    PushNotificationIOS.getInitialNotification().then(function (notification) {
      console.log("getInitialNotification: " + notification);

      if (notification != null) {
        appOpenedByNotificationTap(notification);
      }
    });

    let backgroundNotification;

    PushNotificationIOS.addEventListener(
      "notification",
      function (notification) {
        console.log("addEventListener: notification: " + notification);

        if (AppState.currentState === "background") {
          backgroundNotification = notification;
        }
      }
    );

    AppState.addEventListener("change", function (new_state) {
      console.log("addEventListener: change:0 " + new_state);
      this.getScreenTimingApi(new_state);
      if (new_state === "active" && backgroundNotification != null) {
        appOpenedByNotificationTap(backgroundNotification);
        backgroundNotification = null;
        console.log("addEventListener: change:1 " + new_state);
      }
    });
    getScreenTimingApi = (data) => {
      console.log(
        "addEventListener: change:4 " +
          data +
          ": " +
          (component instanceof ScreenTiming)
      );
      globalVar =
        data === "active" ? Math.random().toString(36).slice(2) : globalVar;
      data = data === "active" ? "open" : "close";
      var url =
        globals.home_url +
        "/logout?token_id=" +
        gettoken +
        "&url=" +
        globals.demo_instance +
        "&user_id=" +
        getuserId +
        "&unique_id=" +
        globalVar +
        "&action=" +
        data;
      console.log("addEventListener: change: 5 " + url);

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
          if (response.success === true) {
            alert("res " + JSON.stringify(response.data));
          }
        })
        .catch((err) => {
          alert("err " + JSON.stringify(err));
          console.log(err);
        });
    };
    function doAction(component, data, body) {
      // const { title, body, data } = notification;
      // this.clearNotification(data)

      console.log(
        "NotificatioListener: On Notification Openend: " +
          "body= " +
          body +
          " data = " +
          data
      );
      console.log(
        "NotificatioListener: notificationOpen: type = " +
          data.type +
          " module: " +
          data.module +
          " id: " +
          data.id
      );

      let screenName = "";
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
          //screenName = 'app.CallDetailsCalendar'
          break;
      }

      if (screenName != "") {
        console.log(
          "component = " +
            component +
            " isInstanceof = " +
            (component instanceof tilemenu)
        );
        Navigation.startSingleScreenApp({
          screen: {
            screen: screenName,
            title: "",
            navigatorStyle: {},
            navigatorButtons: {},
          },
          animated: true, // does the push have transition animation or does it happen immediately (optional)
          // drawer: {},
          passProps: {
            id: data.id,
            module: data.module,
            isBackgroundNotification: true,
          }, // simple serializable object that will pass as props to all top screens (optional)
          animationType: "slide-horizontal",
          backButtonTitle: "Back", // override the back button title (optional)
          backButtonHidden: false,
        });
      }
    }
  }

  async createForegroundNotificationListener(component) {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body } = notification;
        console.log("NotificatioListener: On Notification: ", title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body, data } = notificationOpen.notification;
        console.log(
          "notificationOpenedListener: On Notification Openend: ",
          title,
          body
        );
        doAction(component, data, body);
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
      console.log("NotificatioListener: Message listener");
      console.log(JSON.stringify(message));
    });

    function doAction(component, data, body) {
      // const { title, body, data } = notification;
      // this.clearNotification(data)

      console.log(
        "NotificatioListener: On Notification Openend: " +
          "body= " +
          body +
          " data = " +
          data
      );
      console.log(
        "NotificatioListener: notificationOpen: type = " +
          data.type +
          " module: " +
          data.module +
          " id: " +
          data.id
      );

      let screenName = "";
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
          break;
      }
      if (screenName != "") {
        console.log(
          "component = " +
            component +
            " isInstanceof = " +
            (component instanceof tilemenu)
        );

        component.props.navigator.push({
          screen: screenName,
          title: "",
          subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
          passProps: {
            id: data.id,
            module: data.module,
            isForegroundNotification: true,
          }, // Object that will be passed as props to the pushed screen (optional)
          animated: true, // does the push have transition animation or does it happen immediately (optional)
          animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
          backButtonTitle: "Back", // override the back button title (optional)
          backButtonHidden: false, // hide the back button altogether (optional)
        });
      }
    }
  }

  async createNotificationListeners(component) {
    function appOpenedByNotificationTap(notification) {
      // This is your handler. The tapped notification gets passed in here.
      // Do whatever you like with it.
      console.log("appOpenedByNotificationTap: " + notification);

      /**
       *
       * notification= {"_data":
       * {"id":"userInfoId123","module":"userInfoModule_Calls","type":"userInfoType_Calendar"},
       * "_remoteNotificationCompleteCallbackCalled":false,"_isRemote":false,"_badgeCount":0,
       * "_sound":"default","_alert":"Some message for dummy notification","_category":null}
       */
      console.log(
        "appOpenedByNotificationTap: string = " + JSON.stringify(notification)
      );

      console.log("appOpenedByNotificationTap: title = " + notification._alert);
      console.log("appOpenedByNotificationTap: data = " + notification._data);

      doAction(component, notification._data, notification._alert);

      // alert("Test")
    }

    PushNotificationIOS.getInitialNotification().then(function (notification) {
      console.log("getInitialNotification: " + notification);

      if (notification != null) {
        appOpenedByNotificationTap(notification);
      }
    });

    let backgroundNotification;

    PushNotificationIOS.addEventListener(
      "notification",
      function (notification) {
        console.log("addEventListener: notification: " + notification);

        if (AppState.currentState === "background") {
          backgroundNotification = notification;
        }
      }
    );

    AppState.addEventListener("change", function (new_state) {
      console.log("addEventListener: change: " + new_state);

      if (new_state === "active" && backgroundNotification != null) {
        appOpenedByNotificationTap(backgroundNotification);
        backgroundNotification = null;
      }
    });

    /*
     * Triggered when a particular notification has been received in foreground
     * */
    notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body } = notification;
        console.log("NotificatioListener: On Notification: ", title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body, data } = notificationOpen.notification;
        console.log(
          "notificationOpenedListener: On Notification Openend: ",
          title,
          body
        );
        doAction(component, data, body);
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
      console.log("NotificatioListener: Message listener");
      console.log(JSON.stringify(message));
    });

    function doAction(component, data, body) {
      // const { title, body, data } = notification;
      // this.clearNotification(data)

      console.log(
        "NotificatioListener: On Notification Openend: " +
          "body= " +
          body +
          " data = " +
          data
      );
      console.log(
        "NotificatioListener: notificationOpen: type = " +
          data.type +
          " module: " +
          data.module +
          " id: " +
          data.id
      );

      let screenName = "";
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
          break;
      }
      if (screenName != "") {
        console.log(
          "component = " +
            component +
            " isInstanceof = " +
            (component instanceof tilemenu)
        );

        // component.props.navigator.push({
        //     screen: screenName,
        //     title: '',
        //     subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
        //     passProps: { id: data.id, module: data.module }, // Object that will be passed as props to the pushed screen (optional)
        //     animated: true, // does the push have transition animation or does it happen immediately (optional)
        //     animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        //     backButtonTitle: 'Back', // override the back button title (optional)
        //     backButtonHidden: false, // hide the back button altogether (optional)
        // })

        if (component instanceof tilemenu) {
          component.props.navigator.push({
            screen: screenName,
            title: "",
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: {
              id: data.id,
              module: data.module,
              isForegroundNotification: true,
            }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
            backButtonTitle: "Back", // override the back button title (optional)
            backButtonHidden: false, // hide the back button altogether (optional)
          });
        } else {
          Navigation.startSingleScreenApp({
            screen: {
              screen: screenName,
              title: "",
              navigatorStyle: {
                navBarTransparent: true,
              },
              navigatorButtons: {},
            },
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            // drawer: {},
            passProps: {
              id: data.id,
              module: data.module,
              isNotification: true,
            }, // simple serializable object that will pass as props to all top screens (optional)
            animationType: "slide-horizontal",
            backButtonTitle: "Back", // override the back button title (optional)
            backButtonHidden: false,
          });
        }
      }
      // alert("Notification Opened: "+data.module)
    }
  }
}
