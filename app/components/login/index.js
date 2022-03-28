import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  Image,
  YellowBox,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  Container,
  Header,
  Content,
  Form,
  Spinner,
  Item,
  Input,
  Label,
  Button,
  Icon,
} from "native-base";

import { login, updateProfilePic, notify,session_clear } from "../../actions/auth";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import PasswordInputText from "react-native-hide-show-password-input";
import styles from "./style";
import globals from "../../globals";
import { TextField } from "react-native-material-textfield";

const app_logo = require("../../../images/ic_app_logo.png");
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
YellowBox.ignoreWarnings(["Warning: ..."]);
import ModalDialog from "../custom/modalDialog";
import { Linking } from "react-native";

const USERNAME = "Username";
const PASSWORD = "Password";
//* this is the login file
let OTP_EXPIRY_SECS = 60; // 60 secs = 1 mins
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      password: "",
      token: "",
      rm_code: "",
      assigned_user_id: "",
      url: globals.demo_instance,
      currency_id: "",
      isLoggingIn: false,
      user_currency_name: "",
      full_name: "",

      showInvalidLicenseLayout: false,
      isDisplayForgotPassword: false,
      isVerifyNResetPassword: false,
      ReenteredPwd: "",
      otp: "",
      otpExp: OTP_EXPIRY_SECS, //Time in seconds, 1 mins = 60 secs

      forgotType: "",
      email: "",
      emailError: "",
    };
  }

  componentDidMount() {
    console.log("componentDidMount: ");
    console.log("deviceUniqueIdentifier: " + this.props.deviceUniqueIdentifier);
  }
  //Method with API
  getLogin() {
    //this.props.login(this.state.token);

    if (this.state.username === undefined || this.state.username == "") {
      Alert.alert("Error", "Please enter username!");
      return;
    }

    if (this.state.password === undefined || this.state.password == "") {
      Alert.alert("Error", "Please enter password!");
      return;
    }

    if (this.state.url.length <= 8 || this.state.url == "") {
      Alert.alert("Error", "Please enter the URL!");
      return;
    }

    this.setState({ isLoggingIn: true, message: "" });

    var params = {
      username: this.state.username,
      password: this.state.password,
    };

    var proceed = false;
    var login = false;

    //pass the username and password encoded

    let url =
      globals.home_url +
      "/login" +
      "?username=" +
      encodeURIComponent(this.state.username.trim()) +
      "&password=" +
      globals.convertToBase64(this.state.password.trim()) +
      "&osName=" +
      Platform.OS +
      "&deviceId=" +
      this.props.deviceUniqueIdentifier +
      "&url=" +
      encodeURIComponent(this.state.url);

    console.log("login url: ", url);

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
        console.log("login response", JSON.stringify(response));
        console.log(response);
        proceed = true;
        if (response.success === true) {
          if (response.data.android.valid_license === "yes") {
            this.setState({ showInvalidLicenseLayout: false });
            this.setState({
              token: response.data.result.token,
              rm_code: response.data.result.rm_code,
              username: response.data.result.user_name,
              password: this.state.password.trim(), //response.data.result.password,
              full_name: response.data.result.full_name,
              currency_id: response.data.result.currency_id,
              assigned_user_id:
                response.data.android.name_value_list.user_id.value,

              //Add more info
              user_currency_name:
                response.data.android.name_value_list.user_currency_name.value,
            });
            console.log("your token is: " + this.state.token);
            console.log("your username is: " + this.state.username);
            console.log("your user id is: " + this.state.assigned_user_id);
            console.log("your currency id is: " + this.state.currency_id);
            console.log("your user full name is: " + this.state.full_name);

            console.log("Entered instance url is: " + this.state.url);

            this.getProfilePicture(this.state.assigned_user_id, this.state.url);
          } else {
            //Invalid license key
            this.setState({ showInvalidLicenseLayout: true });
            this.setState({ isLoggingIn: false });
          }
        } else {
          this.setState({ isLoggingIn: false });
          Alert.alert("Error", response.data.description);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isLoggingIn: false });
        Alert.alert("Error", "Login failed");
      });
  }

  //!Not in use
  getProfilePicture(userId, instanceUrl) {
    // let url = globals.demo_instance+"?entryPoint=image&id="  +
    let url =
      instanceUrl +
      "index.php?entryPoint=image&id=" +
      userId +
      "_user_profile_c&type=Users" +
      "&url=" +
      instanceUrl;
    console.log("getProfilePicture: url = " + url);
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
        console.log("getProfilePicture: response: ", response);
        // this.setState({
        //     image_url: response.content
        // })
        this.setState({ isLoggingIn: false });

        const data = response.content;
        let isBase64 = true;

        if (data === undefined || data === "") {
          isBase64 = false;
        }

        const userProfile = { data, isBase64 };
        //save profile data in global states
        // this.props.updateProfilePic(userProfile)
        var dd = new Date().getDate();
        var mm = new Date().getMonth() + 1;
        var yy = new Date().getFullYear();
        var hh = new Date().getHours();
        var min = new Date().getMinutes();
        var sec = new Date().getSeconds();
        var lastTime =
          yy + "-" + mm + "-" + dd + " " + hh + ":" + min + ":" + sec;

        //save this login info in the props variable to use them throughout the app
        this.props.login(
          this.state.username,
          this.state.password,
          this.state.assigned_user_id,
          this.state.currency_id,
          this.state.token,
          this.state.user_currency_name,
          this.state.url,
          userProfile,
          this.state.rm_code,
          this.state.full_name,
          lastTime
        );
        // this.props.notify(lastTime);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoggingIn: false });

        //If got error while fetching profile pic, let the user login
        const userProfile = { data: "", isBase64: false };
        var dd = new Date().getDate();
        var mm = new Date().getMonth() + 1;
        var yy = new Date().getFullYear();
        var hh = new Date().getHours();
        var min = new Date().getMinutes();
        var sec = new Date().getSeconds();
        var lastTime =
          yy + "-" + mm + "-" + dd + " " + hh + ":" + min + ":" + sec;

        // this.props.notify(lastTime);

        this.props.login(
          this.state.username,
          this.state.password,
          this.state.assigned_user_id,
          this.state.currency_id,
          this.state.token,
          this.state.user_currency_name,
          this.state.url,
          userProfile,
          this.state.rm_code,
          this.state.full_name,
          lastTime
        );
      });
  }

  getOTP() {
    //API1 call to send OTP on registered Email or Phone Number of submitted username
    if (this.state.username === undefined || this.state.username == "") {
      Alert.alert("Error", "Please enter username!");
      return;
    }

    if (this.state.url.length <= 8 || this.state.url == "") {
      Alert.alert("Error", "Please enter the URL!");
      return;
    }

    this.setState({ isLoggingIn: true });

    //pass the username and password encoded
    let url =
      globals.home_url +
      "/generate_OTP" +
      "?username=" +
      encodeURIComponent(this.state.username) +
      "&url=" +
      encodeURIComponent(this.state.url);
    console.log("generate_OTP url: ", url);

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
        console.log("generate_OTP response");
        console.log(response);
        this.setState({ isLoggingIn: false });

        proceed = true;
        if (response.success === true) {
          this.resetPasswordScreen();
        } else {
          this.setState({
            isDisplayForgotPassword: true,
            isVerifyNResetPassword: false,
          });
          Alert.alert("Error", response.data.data.name);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isDisplayForgotPassword: true,
          isVerifyNResetPassword: false,
          isLoggingIn: false,
        });
        Alert.alert("Error", "Failed to verify user.");
      });
  }

  verifyOtpAndResetPassword() {
    //API2 call to verify the OTP and if verified, reset the password for the user
    if (this.state.otp == undefined || this.state.otp == "") {
      Alert.alert("Error", "Please enter valid OTP!");
      return;
    }

    if (this.state.password === undefined || this.state.password == "") {
      Alert.alert("Error", "Please enter Password!");
      return;
    }

    if (this.state.ReenteredPwd != this.state.password) {
      Alert.alert(
        "Error",
        "Passwords are not matching, Please check both passwords."
      );
      return;
    }
    this.setState({ isLoggingIn: true });

    //pass the username and password encoded
    let url =
      globals.home_url +
      "/verify_OTP?" +
      "username=" +
      encodeURIComponent(this.state.username) +
      "&otp=" +
      encodeURIComponent(this.state.otp) +
      "&newpassword=" +
      encodeURIComponent(this.state.password) +
      "&url=" +
      encodeURIComponent(this.state.url);

    console.log("verify_OTP url: ", url);

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
        this.setState({ isLoggingIn: false });

        console.log("verify_OTP response");
        console.log(response);
        proceed = true;
        if (response.success === true) {
          Alert.alert(
            "Message",
            response.message + " Please login with new password.",
            [
              {
                text: globals.ok,
                onPress: () =>
                  this.setState({
                    isDisplayForgotPassword: false,
                    isVerifyNResetPassword: false,
                    password: "",
                  }),
              },
            ],
            { cancelable: false }
          );
        } else {
          this.setState({ isVerifyNResetPassword: true });
          Alert.alert("Error", response.message);
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({ isVerifyNResetPassword: true, isLoggingIn: false });
        Alert.alert("Error", "Failed to verify user or to send OTP");
      });
  }

  resendOTP() {
    this.setState({
      //Change the offset here
      otpExp: OTP_EXPIRY_SECS, //3 mins
    });
    this.setTimer(); //Call this function once we received response for GetOtp API
    //Resend OTP
    this.getOTP();
  }

  setTimer() {
    this.timer = setTimeout(() => {
      if (this.state.otpExp == 0) {
        return;
      }
      //4 mins = 240 seconds
      this.setState({
        //Change the offset here
        otpExp: this.state.otpExp - 1,
      });
      this.setTimer();
    }, 1000); //milliseconds 1000 = 1 second
  }

  showExpiryTime() {
    let timeInSec = this.state.otpExp / 60;
    timeInSec = timeInSec.toFixed(2).replace(".", ":");
    return timeInSec;
  }

  openForgotPasswordPopup() {
    Linking.openURL(
      "https://wm.bajajcapitalinsurance.com/app-reset-password/w"
    );
  }
  sessionLogout() {
    this.setState({ username: "" });
    // this.props.username = ''
    this.props.session_clear();
  }
  resetPasswordScreen() {
    this.setState({
      isDisplayForgotPassword: false,
      isVerifyNResetPassword: true,
    });
  }

  backToLogin() {
    this.setState({
      isDisplayForgotPassword: false,
      isVerifyNResetPassword: false,
    });
  }

  sendEmailLink(type) {
    let proceed = true;
    if (this.state.email == "") {
      this.setState({ emailError: "Please enter registered email id." });
      proceed = false;
      return;
    } else if (this.state.email.length > 0) {
      if (!globals.validateEmail(this.state.email)) {
        proceed = false;
        // Alert.alert('Error', 'Invalid email id');
        this.setState({ emailError: "Invalid email id." });
      }
    }

    if (proceed) {
      this.backToLogin();
      this.setState({ isLoggingIn: true });

      //pass the username and password encoded
      let url =
        globals.demo_instance +
        "index.php?entryPoint=ForgotPasswordandUsernameLink" +
        "&email_id=" +
        this.state.email.trim() +
        "&forgotype=" +
        type.toLowerCase() +
        "&url=" +
        encodeURIComponent(this.state.url);

      console.log("sendEmailLink url: ", url);

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
          this.setState({ isLoggingIn: false });

          console.log("sendEmailLink response");
          console.log(response);
          proceed = true;
          if (response.success === true) {
            this.setState({ username: "", password: "" });

            Alert.alert(
              "Message",
              type +
                " reset details shared on registered email id. Please check and login with new " +
                type,
              [
                {
                  text: globals.ok,
                  onPress: () =>
                    this.setState({
                      isDisplayForgotPassword: false,
                      isVerifyNResetPassword: false,
                    }),
                },
              ],
              { cancelable: false }
            );
          } else {
            this.setState({ isVerifyNResetPassword: false });
            Alert.alert("Error", response.Android);
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({ isVerifyNResetPassword: false, isLoggingIn: false });
          Alert.alert("Error", "Something went wrong. Please try later.");
        });
    }
  }
  render() {
    return (
      <Container>
        <Content padder keyboardShouldPersistTaps="always">
          <View style={styles.imageView}>
            <Image source={app_logo} style={{ resizeMode: "center" }} />
          </View>
          {this.state.showInvalidLicenseLayout === false && (
            <View>
              {!this.state.isDisplayForgotPassword &&
                !this.state.isVerifyNResetPassword && (
                  <Form>
                    <View style={styles.passwordView}>
                      <TextField
                        label="Username"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={this.state.username}
                        style={{
                          color: "black",
                          fontSize: 17,
                          marginBottom: 0,
                          paddingBottom: 0,
                        }}
                        onChangeText={(text) =>
                          this.setState({ username: text })
                        }
                        textColor="#000"
                        tintColor="red"
                        placeholderTextColor="#000"
                      />
                    </View>

                    <View style={styles.passwordView}>
                      <PasswordInputText
                        ref={(component) => (this._password = component)}
                        autoCapitalize="none"
                        secureTextEntry={true}
                        value={this.state.password}
                        disabled={this.state.isLoggingIn}
                        style={{
                          color: "black",
                          fontSize: 17,
                          marginBottom: 0,
                          paddingBottom: 0,
                        }}
                        onChangeText={(text) =>
                          this.setState({ password: text })
                        }
                        textColor="#000"
                        tintColor="red"
                        placeholderTextColor="#000"
                      />
                    </View>

                    <View style={{ paddingTop: 10 }} />
                    <View
                      style={{ padding: 10, flex: 1, flexDirection: "row" }}
                    >
                      <View
                        style={{
                          flex: 0.7,
                          flexDirection: "row",
                          alignContent: "center",
                          marginTop: 10,
                          marginLeft: 5,
                        }}
                      >
                        <Text>Forgot Password? </Text>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              forgotType: PASSWORD,
                              emailError: "",
                              email: "",
                            });
                            this.openForgotPasswordPopup();
                          }}
                        >
                          <Text
                            style={{
                              color: globals.colors.blue_default,
                              fontWeight: "bold",
                            }}
                          >
                            Reset here
                          </Text>
                        </TouchableOpacity>
                      </View>

                      <Button
                        primary
                        style={{
                          flex: 0.3,
                          width: 100,
                          justifyContent: "center",
                          alignSelf: "flex-end",
                        }}
                        onPress={() => this.getLogin()}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: 16,
                          }}
                        >
                          Login
                        </Text>
                      </Button>
                    </View>
                    {this.props.username === "" ? null : (
                      <Button
                        // primary
                        style={{
                          marginTop: 200,
                          width: 150,
                          justifyContent: "center",
                          alignSelf: "center",
                        }}
                        onPress={() => this.sessionLogout()}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: "#fff",
                            fontSize: 16,
                          }}
                        >
                          Session Logout
                        </Text>
                      </Button>
                    )}
                  </Form>
                )}

              {this.state.isDisplayForgotPassword && (
                <ModalDialog
                  title={"Forgot " + this.state.forgotType}
                  titleColor={"black"}
                  colorAccent={globals.colors.blue_default}
                  visible={this.state.isDisplayForgotPassword}
                  okLabel={"Ok"}
                  scrolled={true}
                  onOk={() => {
                    console.log("OK clicked!!!!!!");
                    this.sendEmailLink(this.state.forgotType);
                  }}
                  cancelLabel={"Cancel"}
                  onCancel={() => {
                    console.log("CANCEL clicked!!!!!!");
                    this.backToLogin();
                  }}
                >
                  <Form>
                    <View style={styles.passwordView}>
                      <TextField
                        label="Enter Registered Email"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={this.state.email}
                        style={{
                          color: "black",
                          fontSize: 17,
                          marginBottom: 0,
                          paddingBottom: 0,
                        }}
                        onChangeText={(text) => this.setState({ email: text })}
                        textColor="#000"
                        tintColor="red"
                        error={this.state.emailError}
                        placeholderTextColor="#000"
                      />
                    </View>
                  </Form>
                </ModalDialog>
              )}
            </View>
          )}

          {this.state.showInvalidLicenseLayout && (
            <View
              style={{
                alignContent: "center",
                justifyContent: "center",
                alignSelf: "center",
                flex: 1,
                alignItems: "center",
                top: deviceHeight / 6,
              }}
            >
              <Text>
                Invalid license key, please contact your support representative.
              </Text>
              <View style={{ padding: 10, marginTop: 20 }}>
                <Button
                  primary
                  style={{
                    width: 100,
                    justifyContent: "center",
                    alignSelf: "center",
                  }}
                  onPress={() => this.getLogin()}
                >
                  <Text
                    style={{ fontWeight: "bold", color: "#fff", fontSize: 16 }}
                  >
                    Try Again
                  </Text>
                </Button>
              </View>
            </View>
          )}

          {this.state.isLoggingIn && (
            <View
              style={{
                position: "absolute",
                /*left: 0,*/
                // right: deviceWidth/4,
                alignSelf: "center",
                top: deviceHeight / 4,
                borderRadius: 10,
                bottom: 0,
                width: deviceWidth / 2,
                height: deviceHeight / 6,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 30,
              }}
            >
              <Spinner style={styles.loading} color="white" />
              <Text style={styles.loadingText}>Loading</Text>
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
    username: state.auth.username,
    password: state.auth.password,
    url: state.auth.url,
    loginTime: state.auth.loginTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ login, updateProfilePic, notify ,session_clear}, dispatch);
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Login);
