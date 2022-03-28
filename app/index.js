import React, { Component } from "react";
import {
  AppRegistry,
  AsyncStorage,
  View,
  StyleSheet,
  AppState,
  TouchableOpacity,
  Text,
} from "react-native";
import { Provider } from "react-redux";
import configureStore from "./store";
import Login from "./components/login";
import { persistStore } from "redux-persist";
import { Spinner } from "native-base";
import { PersistGate } from "redux-persist/lib/integration/react";
import { registerScreens } from "./screens";
import { Navigation } from "react-native-navigation";
// import { pushNotifications } from './components/services';
import PushNotification from "react-native-push-notification";
import firebase from "react-native-firebase";
import { logout } from "../app/actions/auth";
import NotificatioListener from "./NotificationListener";
import BaseComponent from "./components/BaseComponent";
import {
  ACTION_PERSIST_REHYDRATE,
  ACTION_LOGIN,
  ACTION_LOGOUT,
  ACTION_UPDATE_CURRENCY,
  ACTION_UPDATE_PROFILE_PIC,
} from "./store";

const store = configureStore();
registerScreens(store, Provider);
console.disableYellowBox = true;
// PushNotification.configure(

//   {
//   // (optional) Called when Token is generated (iOS and Android)
//   onRegister: function(token) {
//     console.log( 'TOKEN:', token );
// },

// // (required) Called when a remote or local notification is opened or received
// onNotification: function(notification) {
//     console.log( 'NOTIFICATION:', notification );

//     // process the notification
//     notification.finish(PushNotificationIOS.FetchResult.NoData);

// }
//   }

// );

export default class App extends Component {
  constructor(props) {
    super(props);
    console.log("App2: constructor: props = " + props);
    // new NotificatioListener(this);

    store.subscribe(this.onStoreUpdate.bind(this));

    const styles = StyleSheet.create({
      button: {
        overflow: "hidden",
        width: 34,
        height: 34,
        borderRadius: 34 / 2,
        justifyContent: "center",
        alignItems: "center",
      },
    });
  }

  componentDidMount() {
    AppState.addEventListener("change", this._handleAppStateChange);
    console.log("app.index: componentDidMount");
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground!");
      var diff = this.getDifferenceInHours(this.props.loginTime, new Date());
      diff > 12 ? this.props.logout() : null;
    }
    this.setState({ appState: nextAppState });
    // alert(nextAppState + "  >>>>>>>>");
  };
  getDifferenceInHours(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60);
  }
  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification) => {
        const { title, body } = notification;
        console.log("main screen");
        console.log("On Notification: ", title, body);
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        console.log("main screen");
        console.log("On Notification Openend: " + title + "body= " + body);
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
    // this.notificationListener();
    // this.notificationOpenedListener();
  }

  /**
   * onStoreUpdate() method will get called whenever the redux state changes,
   * it can be any type of action.
   * So here we can listen to the action done in redux state and based on the action
   * decide whether to redirect to the particular screen or not.
   */
  onStoreUpdate() {
    // new NotificatioListener(this);

    console.log("app.index: onStoreUpdate");
    console.log(
      "app.index: onStoreUpdate lastAction = " +
        JSON.stringify(store.getState().lastAction)
    );

    if (store.getState().auth.isLoggedIn) {
      // try{
      // // alert("Action IS : "+store.getState().auth.type)
      // }catch(error){

      console.log(
        "app.index: onStoreUpdate: type = " + store.getState().auth.type
      );

      console.log(
        "app.index: onStoreUpdate: type =1 " + store.getState().auth.token
      );
      console.log(
        "app.index: onStoreUpdate: type =1 " +
          store.getState().auth.assigned_user_id
      );
      if (
        store.getState().lastAction.type === ACTION_PERSIST_REHYDRATE ||
        store.getState().lastAction.type === ACTION_LOGIN
      ) {
        console.log(
          "app.index: onStoreUpdate: action is LOGIN or persist/REHYDRATE: RELOAD APP"
        );

        new BaseComponent(
          store.getState().auth.token,
          store.getState().auth.assigned_user_id
        );
      } else {
        console.log(
          "app.index: onStoreUpdate: Stay on the screen: NO Reloading."
        );
      }

      // new BaseComponent()

      //Redirect to the home screen if and only if the last action was for login, else need not any redirection.
      //   if(store.getState().auth.type != ACTION_UPDATE_CURRENCY
      //   && store.getState().auth.type != ACTION_UPLOAD_PROFILE_PIC //!This can cause to fail after app update, find other solution
      // //  && store.getState().auth.type != 'NO_ACTION'
      //  && store.getState().auth.type != ACTION_UPDATE_PROFILE_PIC){
      //     console.log("app.index: onStoreUpdate: action is LOGIN")
      //     new BaseComponent()
      //   }else{
      //     console.log("app.index: onStoreUpdate: action is NOT LOGIN")
      //   }

      // Navigation.startSingleScreenApp({

      //   screen: {
      //     screen: 'app.TileMenu', // unique ID registered with Navigation.registerScreen
      //     title: 'Home', // title of the screen as appears in the nav bar (optional)
      //     navigatorStyle: {

      //     }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      //   },

      //   drawer: {
      //     // optional, add this if you want a side menu drawer in your app
      //     left: {
      //       // optional, define if you want a drawer from the left
      //       screen: 'app.Menu', // unique ID registered with Navigation.registerScreen
      //       passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
      //       disableOpenGesture: false, // can the drawer be opened with a swipe instead of button (optional, Android only)
      //       fixedWidth: 500 // a fixed width you want your left drawer to have (optional)
      //     },
      //     style: {
      //       // ( iOS only )
      //       drawerShadow: false, // optional, add this if you want a side menu drawer shadow
      //       contentOverlayColor: 'rgba(0,0,0,0.25)', // optional, add this if you want a overlay color when drawer is open
      //       leftDrawerWidth: 70, // optional, add this if you want a define left drawer width (50=percent)
      //       rightDrawerWidth: 50 // optional, add this if you want a define right drawer width (50=percent)
      //     },
      //     type: 'MMDrawer', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
      //     animationType: 'parallax', //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
      //     // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
      //     disableOpenGesture: false // optional, can the drawer, both right and left, be opened with a swipe instead of button
      //   },
      //   passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
      //   animationType: 'slide-down'
      // });
    } else {
      Navigation.startSingleScreenApp({
        screen: {
          screen: "app.Login",
          path: "login",
          uriPrefix: "https://openleadsfilter.com/",
          title: null,
          navigatorStyle: {
            navBarBackgroundColor: "white",
            navBarTextColor: "#0067ff",
            navBarButtonColor: "#0067ff",
          },
          navigatorButtons: {},
        },
        drawer: {},
        passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
        animationType: "slide-down",
      });
    }

    // new NotificatioListener(this);
  }
}
