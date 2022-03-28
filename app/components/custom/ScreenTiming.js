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
import { login } from "../../actions/auth";
import {
  logout,
  updateToken,
  updateProfilePic,
  updateAction,
  updateDynamicDropdowns,
} from "../../actions/auth";
import { bindActionCreators } from "redux";
import globals from "../../globals";
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);

class ScreenTiming extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    alert(globals.demo_instance)
    // var random = Math.random().toString(36).slice(2);
    // this.props.valuefrom === "active" ? this.props.screentime(random) : null;
    this.getScreenTimingApi();
  }
  getScreenTimingApi = () => {
   var url =
        globals.home_url +
        "/logout?token_id=" +
        "f2n4aharbgtd1t3l7pm0bccb04" +
        "&url=" +
        globals.demo_instance +
        "&user_id=" +
        "a1aacb15-64b3-9086-2bde-6131aa99c393" +
        "&unique_id=" +
        'hfjkhjkdghjdg' +
        "&action=" +
        'active';
    // alert(url);
    console.log("addEventListener: change:56 " + url);

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
          this.props.valuefrom === "active" ? null : this.props.screentime("");
          console.log("here in search");
          alert(JSON.stringify(response));
        } else {
        }
      })
      .catch((err) => {
        alert(JSON.stringify(err));
        console.log(err);
      });
  };

  render() {
    return <View></View>;
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

export default Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenTiming);
