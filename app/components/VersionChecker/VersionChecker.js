import React, { Component } from "react";
import { View, Modal, Image, TouchableOpacity, Linking } from "react-native";
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

class VersionChecker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      expandableView: false,
      version:this.props.version
      //   url: "",
      //   description: "",
    };
  }
  componentDidMount = () => {
    let url =
      globals.demo_instance+ "/index.php?entryPoint=getAppVersion";

    console.log("your token is: ", url);

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
        console.log("your token is: ", JSON.stringify(response));
        this.setState({
          url: response.Ios.result[1].url,
          description: response.Ios.result[1].description,
        });
        console.log(
          "your token is: ::::::::::::::::::",
          JSON.stringify(response.Ios.result.url)
        );
        console.log(
          "your token is: ::::::::::::::::::",
          this.props.version + " " + response.Ios.result[0].version
        );
         if (this.props.version < response.Ios.result[0].version) {
          this.setState({ modalVisible: true });
        }
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Error", "Login failed");
      });
  };
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  };
  render() {
    return (
      <Container style={styles.mainContainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this.setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Image
                  source={require("../../../images/ic_app_logo.png")}
                  style={styles.logoImage}
                />
              <Text style={styles.newVersionText}>New version available</Text>
              <Text style={styles.descriptionText}>
                Please, update app to new version continue using.
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(this.state.url)}
                style={styles.updateBtn}
              >
                <Text style={styles.updateText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.state.expandableView
                    ? this.setState({ expandableView: false })
                    : this.setState({ expandableView: true })
                }
                style={{ flexDirection: "row" }}
              >
                <Text style={styles.whatsnewText}>What's New ?</Text>
                <Image
                  source={
                    !this.state.expandableView
                      ? require("../../../images/downarrow.png")
                      : require("../../../images/uparrow.png")
                  }
                  style={styles.downarrowImg}
                />
              </TouchableOpacity>
              {this.state.expandableView ? (
                <Text style={styles.textstyle}>{this.state.description}</Text>
              ) : null}
            </View>
          </View>
        </Modal>
      </Container>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    username: state.auth.username,
    password: state.auth.password,
    token: state.auth.token,
    assigned_user_id: state.auth.assigned_user_id,
    url: state.auth.url,
    isProfileBase64: state.auth.isProfileBase64,
    profilePicData: state.auth.profilePicData,
    type: state.lastAction.type,
    rm_code: state.auth.rm_code,
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

export default Login = connect(mapStateToProps, mapDispatchToProps)(VersionChecker);
