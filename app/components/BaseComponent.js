import React, { Component } from "react";
// import NotificationOpenedListener from "./NotificationOpenedListener.ts"
import NotificatioListener from "./../NotificationListener";
import { Navigation } from "react-native-navigation";

var token = "";
var user_id = "";
export default class BaseComponent {
  constructor(token, userId) {
    console.log("NotificatioListener: Constructor component =123 " + token);
    // super();
    // const user = this.props.user;
    // alert(token + " " + userId);
    new NotificatioListener(this, false,token,userId);

    Navigation.startSingleScreenApp({
      screen: {
        screen: "app.TileMenu", // unique ID registered with Navigation.registerScreen
        title: null, // title of the screen as appears in the nav bar (optional)
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
        type: "MMDrawer", // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
        animationType: "parallax", //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
        // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
        disableOpenGesture: false, // optional, can the drawer, both right and left, be opened with a swipe instead of button
      },
      passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
      animationType: "slide-down",
    });
  }
}
