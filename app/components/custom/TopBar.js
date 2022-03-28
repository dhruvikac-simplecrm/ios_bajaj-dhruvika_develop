import { Button } from "native-base";
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
import { bindActionCreators } from "redux";
import { login } from "../../actions/auth";
import {
  logout,
  updateToken,
  updateProfilePic,
  updateAction,
  updateDynamicDropdowns,
} from "../../actions/auth";
import globals from "../../globals";
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notificationCount: 0,
    };
    console.log("App2: constructor: props = " + props);
  }

  componentDidMount() {
    this.getNotificationCount();
    console.log("app.index: componentDidMount");
  }

  componentWillUnmount() {
    console.log("app.index: componentWillUnmount");
  }

  getNotificationCount = () => {
    var url =
      this.props.last_check == ""
        ? globals.home_url +
          "/notificationcount?user_id=" +
          this.props.assigned_user_id +
          "&last_dateTime="
        : globals.home_url +
          "/notificationcount?user_id=" +
          this.props.assigned_user_id +
          "&last_dateTime=" +
          globals.reFormatDateToSendOnServer(this.props.last_check);

    console.log("This is search data: " + url);

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
        // alert(JSON.stringify(response.data.info));
        if (response.success === true) {
          console.log("here in search");
          this.setState({
            notificationCount: response.data.info.unread_notification_count,
          });
          //alert(response.data.info.unread_notification_count)
          // this.headerView()
        } else {
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <View
        style={{
          height: StatusBar.currentHeight,
          flexDirection: "row",
          width: Dimensions.get("window").width - 10,
          justifyContent: "center",
          paddingTop: 5,
          paddingBottom: 5,
          marginStart: -3,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          onPress={() =>
            this.props.navigator.toggleDrawer({
              side: "left", // the side of the drawer since you can have two, 'left' / 'right'
              animated: true, // does the toggle have transition animation or does it happen immediately (optional)
              to: "missing", // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
            })
          }
          style={{ width: "20%", paddingStart: 15 }}
        >
          <Image source={require("../../../images/hamburger_small.png")} />
        </TouchableOpacity>
        <View style={{ width: "50%", alignItems: "center" }}>
          <Text
            style={{
              fontWeight: "bold",
              color: "black",
              fontSize: 16,
              marginStart: 30,
            }}
          >
            Home
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigator.push({
              screen: "app.Notification",
              title: "Notification",
              subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
              passProps: {
                onBackPressed: () => {
                  console.log("TopBar: Backed from notification screen");
                  this.getNotificationCount();
                },
              }, // Object that will be passed as props to the pushed screen (optional)
              animated: true, // does the push have transition animation or does it happen immediately (optional)
              animationType: "slide-horizontal", // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
              backButtonTitle: "Back", // override the back button title (optional)
              backButtonHidden: true, // hide the back button altogether (optional)
            });
          }}
          style={{ width: "20%", paddingStart: 20 }}
        >
          <Image
            style={{ height: 30, width: 30 }}
            source={require("../../../images/notification.png")}
          />
          {this.state.notificationCount === 0 ? null : (
            <View
              style={{
                marginStart: 15,
                marginTop: -35,
                backgroundColor: "red",
                height: 24,
                width: 24,
                borderRadius: 24 / 2,
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "white", alignSelf: "center", fontSize: 12 }}
              >
                {this.state.notificationCount > 99
                  ? "99+"
                  : this.state.notificationCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
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
          }}
          style={{ width: "10%"}}
        >
          <Image style={{tintColor:"#004175", height:20,width:20,marginStart:5,marginTop:4}} source={require("../../../images/dashboardnotes.png")} />
        </TouchableOpacity> */}
      </View>
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

export default Login = connect(mapStateToProps, mapDispatchToProps)(TopBar);
