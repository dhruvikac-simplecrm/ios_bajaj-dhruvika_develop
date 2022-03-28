import React, { Component } from "react";

import { connect } from "react-redux";
import { updateToken, login, logout } from "../actions/auth";
import { bindActionCreators } from "redux";
import globals from "../globals";
import { Platform } from "react-native";
/**
 * createdBy @SonalWararkar
 */
class ApiCallForToken {
  async getToken(props) {
    let url =
      globals.home_url +
      "/login" +
      "?username=" +
      encodeURIComponent(props.username.trim()) +
      "&password=" +
      globals.convertToBase64(props.password.trim()) +
      "&osName=" +
      Platform.OS +
      "&url=" +
      encodeURIComponent(globals.demo_instance);
    console.log("getToken: login url: ", url);

    let apiResponse = await fetch(url, {
      method: "GET",
      dataType: "jsonp",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });

    let response = await apiResponse.json();
    try {
      console.log("getToken: login response = " + JSON.stringify(response));
      proceed = true;
      if (response.success === true) {
        if (response.data.android.valid_license === "yes") {
          if (props.updateToken != undefined) {
            props.updateToken(response.data.result.token);
          }

          return response.data.result.token;
        } else {
          //Invalid license key
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

const apiCallForToken = new ApiCallForToken();
export default apiCallForToken;
