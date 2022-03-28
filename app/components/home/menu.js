import React, { Component } from "react";
import {
  View,
  Text,
  Platform,
  Image,
  Alert,
  TouchableHighlight,
  ActionSheetIOS,
  PixelRatio,
  TextInput,
  ImageBackground,
} from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Header,
  Content,
  Form,
  Card,
  Icon,
  CardItem,
  Body,
  Input,
  Label,
  Button,
} from "native-base";
import { login } from "../../actions/auth";
import { logout, updateProfilePic } from "../../actions/auth";
import { bindActionCreators } from "redux";
import styles from "./style";
import FontAwesome, { Icons } from "react-native-fontawesome";
import { Navigation } from "react-native-navigation";
import globals from "../../globals";
import VersionChecker from "../VersionChecker/VersionChecker";
import ImagePicker from "react-native-image-crop-picker";
const react = require("react-native");

const { StyleSheet, Dimensions } = react;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const IMAGE_REQ_SIZE = 300;
import ImageResizer from "react-native-image-resizer";

const createFormData = (photo, type) => {
  const data = new FormData();
  if (photo.path) {
    var path = "file://" + photo.path;
  }

  const mimeType = "image/jpeg";
  if (type === "Gallery") {
    data.append("contents", {
      name: photo.name,
      type: mimeType,
      uri: photo.uri,
      // Platform.OS === "android" ? url : url.replace("file://", "")
    });
  } else if (type === "Camera") {
    data.append("contents", {
      name: "profile_pic.jpg",
      type: mimeType,
      uri: path,
      // Platform.OS === "android" ? url : url.replace("file://", "")
    });
  }

  console.log("createFormData Body Data json = " + JSON.stringify(data));

  return data;
};

class Menu extends Component {
  constructor(props) {
    super(props);

    console.log(this.props);

    this.state = {
      token: "",
      image_url: "",
      imageURI: "",
      from_camera: false,
      versionchecker:false
    };
  }

  toggleDrawer() {
    this.props.navigator.toggleDrawer({
      side: "left", // the side of the drawer since you can have two, 'left' / 'right'
      animated: true, // does the toggle have transition animation or does it happen immediately (optional)
      to: "missing", // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
    });
  }

  handlePress = (i) => {
    //Home
    if (i == 1) {
      //this.toggleDrawer();

      Navigation.startSingleScreenApp({
        screen: {
          screen: "app.TileMenu", // unique ID registered with Navigation.registerScreen
          title: "Home", // title of the screen as appears in the nav bar (optional)
          // passProps: {image_url:this.state.image_url, imageURI:this.state.imageURI},
          navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
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
          type: "TheSideBar", // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
          animationType: "slide-and-scale", //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
          // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
          disableOpenGesture: false, // optional, can the drawer, both right and left, be opened with a swipe instead of button
        },
        passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
        animationType: "slide-left",
      });
    }
    //leads
    else if (i == 2) {
      Navigation.startSingleScreenApp({
        screen: {
          screen: "app.Leads",
          title: "Leads",
          animationType: "slide-down",
          navigatorButtons: {
            leftButtons: [
              {
                icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
                id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
              },
            ],
          }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        },
        drawer: {
          left: {
            screen: "app.Menu",
          },
        },
      });
    }
    //accounts
    else if (i == 3) {
      Navigation.startSingleScreenApp({
        screen: {
          screen: "app.Accounts",
          title: "Clients",
          animationType: "slide-down",
          navigatorButtons: {
            leftButtons: [
              {
                icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
                id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
              },
            ],
          }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        },
        drawer: {
          left: {
            screen: "app.Menu",
          },
        },
      });
    }
    //contacts
    else if (i == 4) {
      Navigation.startSingleScreenApp({
        screen: {
          screen: "app.Contacts",
          title: "Contacts",
          animationType: "slide-down",
          navigatorButtons: {
            leftButtons: [
              {
                icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
                id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
              },
            ],
          }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        },
        drawer: {
          left: {
            screen: "app.Menu",
          },
        },
      });
    }
    //opportunities
    else if (i == 5) {
      Navigation.startSingleScreenApp({
        screen: {
          screen: "app.Opportunities",
          title: "Opportunities",
          animationType: "slide-down",
          navigatorButtons: {
            leftButtons: [
              {
                icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
                id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
              },
            ],
          }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        },
        drawer: {
          left: {
            screen: "app.Menu",
          },
        },
      });
    }
    //Location
    else if (i == 6) {
      Navigation.startSingleScreenApp({
        screen: {
          screen: "app.Location",
          title: "Location",
          animationType: "slide-down",
          navigatorButtons: {
            leftButtons: [
              {
                icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
                id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
              },
            ],
          }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        },
        drawer: {
          left: {
            screen: "app.Menu",
          },
        },
      });
    }
    //settings
    else if (i == 7) {
      Navigation.startSingleScreenApp({
        screen: {
          screen: "app.Settings",
          title: "Settings",
          animationType: "slide-down",
          navigatorButtons: {
            leftButtons: [
              {
                icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
                id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
              },
            ],
          }, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
        },
        drawer: {
          left: {
            screen: "app.Menu",
          },
        },
      });
    }
    //Sign out
    else if (i == 8) {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          {
            text: "Yes",
            onPress: () => {
              this.props.logout();
            },
          },
          {
            text: "No",
            onPress: () => {
              cancelable: true;
            },
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };
  componentDidMount() {
    this.profilePhoto();
    // alert(this.props.version)
  }

  showImageOption() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Open Camera", "Select from Gallery"],

        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          this.openCamera();
        }

        if (buttonIndex === 2) {
          this.fromGallery();
        }
      }
    );
  }

  openCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      writeTempFile: true,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
    }).then((image) => {
      console.log("openCamera: image = " + JSON.stringify(image));
      ImageResizer.createResizedImage(
        image.path,
        IMAGE_REQ_SIZE,
        IMAGE_REQ_SIZE,
        "JPEG",
        100,
        0
      )
        .then((uri) => {
          //this will upload the image to CRM in the users module

          console.log("openCamera: uri = " + JSON.stringify(uri));
          console.log("openCamera: uri.path = " + uri.path);

          this.uploadProfilePhotoFromCamera(
            uri,
            this.props.assigned_user_id,
            "Camera"
          );

          this.setState({
            from_camera: true,
          });
          this.setState({
            // image_url: uri.path,
            imageURI: uri.uri,
          });
        })
        .catch((error) => {
          console.log("OpenCamera: error = " + error);
        });
    });
  }

  fromGallery() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: true,
    }).then((image) => {
      console.log("selected image:");
      console.log(image);
      ImageResizer.createResizedImage(
        image.path,
        IMAGE_REQ_SIZE,
        IMAGE_REQ_SIZE,
        "JPEG",
        100,
        0
      )
        .then((uri) => {
          console.log("fromGallery: uri = " + JSON.stringify(uri));
          this.uploadProfilePhotoFromGallery(
            uri,
            this.props.assigned_user_id,
            "Gallery"
          );
          this.setState({
            from_camera: false,
          });
          this.setState({
            // image_url: image.data
            imageURI: uri.uri,
          });

          //alert(i + " Images uploaded");
        })
        .catch((error) => {
          console.log("OpenCamera: error = " + error);
        });
    });
  }

  encodeImageFileAsURL(element) {
    var file = element;
    var reader = new FileReader();
    reader.onloadend = function () {
      console.log("RESULT", reader.result);
    };
    reader.readAsDataURL(file);
  }

  uploadProfilePhotoFromGallery(photo, id, type) {
    //save in global states
    this.updateProfileInGlobalStates(photo);

    let image_url =
      globals.home_url +
      "/setImage" +
      "?token_id=" +
      this.props.token +
      "&module_name=" +
      globals.users +
      "&id=" +
      id +
      "&filename=" +
      id +
      "_image.jpg" +
      "&field=user_profile_c" +
      "&url=" +
      this.props.url;

    console.log("uploadProfilePhotoFromGallery: url = " + image_url);

    fetch(image_url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      body: createFormData(photo, type),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(
          "uploadProfilePhotoFromGallery: response = " +
            JSON.stringify(response)
        );

        if (response.success) {
          // alert("Profile pic uploaded");
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("upload error", error);

        this.failedToUploadProfile();
      });
  }

  uploadProfilePhotoFromCamera(photo, id, type) {
    //save in global states
    this.updateProfileInGlobalStates(photo);

    let image_url =
      globals.home_url +
      "/setImage" +
      "?token_id=" +
      this.props.token +
      "&module_name=" +
      globals.users +
      "&id=" +
      id +
      "&filename=" +
      id +
      "_image.jpg" +
      "&field=user_profile_c" +
      "&url=" +
      this.props.url;

    console.log(image_url);

    fetch(image_url, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
      },
      body: createFormData(photo, type),
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(
          "uploadProfilePhotoFromCamera: response = " + JSON.stringify(response)
        );
        if (response.success) {
          // alert("Profile pic uploaded");
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("upload error", error);

        this.failedToUploadProfile();
      });
  }

  failedToUploadProfile() {
    alert("Upload failed!");
    //save profile data in global states
    const data = "";
    const isBase64 = false;
    const userProfile = { data, isBase64 };
    this.props.updateProfilePic(userProfile);
  }

  updateProfileInGlobalStates(photo) {
    //save profile data in global states
    const data = photo.uri;
    const isBase64 = false;
    const userProfile = { data, isBase64 };
    this.props.updateProfilePic(userProfile);
  }

  profilePhoto() {
    console.log("MENU: profilePhoto: " + this.props.isProfileBase64);
    // if(!this.props.isProfileBase64){
    // let url = globals.demo_instance + "?entryPoint=image&id=" +
    let url =
      this.props.url +
      "index.php?entryPoint=image&id=" +
      this.props.assigned_user_id +
      "_user_profile_c&type=Users" +
      "&url=" +
      this.props.url;
    console.log("MENU: profilePhoto: url = " + url);
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
      });
    // }
  }

  render() {
    let uri = "";

    console.log(
      "MENU:RENDER: this.props.isProfileBase64 = " + this.props.isProfileBase64
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
      <Container style={{flex:1}}>
        <Content>
          <View style={styles.mainContainer}>
            {uri === undefined || uri === "" ? (
              <TouchableHighlight
                onPress={() => this.showImageOption()}
                underlayColor="transparent"
              >
                <View>
                  <Image
                    source={require("../../../images/placeholder.png")}
                    style={{ width: 140, height: 140, borderRadius: 140 / 2 }}
                  />

                  <View style={styles.stylecamera}>
                    <Icon
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 20,
                        marginTop: 10,
                      }}
                      active
                      name="md-camera"
                      md="md-camera"
                    />
                  </View>
                </View>
              </TouchableHighlight>
            ) : (
              <TouchableHighlight
                onPress={() => this.showImageOption()}
                underlayColor="transparent"
              >
                <View>
                  <Image
                    source={{ uri: uri }}
                    style={{ width: 140, height: 140, borderRadius: 140 / 2 }}
                  />
                  <View style={styles.stylecamera}>
                    <Icon
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 20,
                        marginTop: 10,
                      }}
                      active
                      name="md-camera"
                      md="md-camera"
                    />
                  </View>
                </View>
              </TouchableHighlight>
            )}

            <Text style={styles.text}>{this.props.full_name}</Text>
          </View>
          //Home
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              width: deviceWidth,
              height: 30,
            }}
          >
            <View style={styles.homeBox}>
              <FontAwesome
                style={{
                  textAlign: "center",
                  marginTop: 1,
                  fontSize: 24,
                  color: "white",
                }}
              >
                {Icons.home}
              </FontAwesome>
            </View>

            <TouchableHighlight
              onPress={() => this.handlePress(1)}
              underlayColor="white"
            >
              <Text style={styles.menuTextItem}>{globals.home}</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.divider} />
          //Leads
          <View
            style={{
              flexDirection: "row",
              marginTop: 20,
              width: deviceWidth,
              height: 30,
            }}
          >
            <View style={styles.leadBox}>
              <FontAwesome
                style={{
                  textAlign: "center",
                  marginTop: 1,
                  fontSize: 24,
                  color: "white",
                }}
              >
                {Icons.bullseye}
              </FontAwesome>
            </View>

            <TouchableHighlight
              onPress={() => this.handlePress(2)}
              underlayColor="white"
            >
              <Text style={styles.menuTextItem}>{globals.leads}</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.divider} />
          //accounts
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: deviceWidth,
              height: 30,
            }}
          >
            <View style={styles.accountBox}>
              <FontAwesome
                style={{
                  textAlign: "center",
                  marginTop: 1,
                  fontSize: 24,
                  color: "white",
                }}
              >
                {Icons.briefcase}
              </FontAwesome>
            </View>

            <Text
              style={styles.menuTextItem}
              onPress={() => this.handlePress(3)}
            >
              {"Clients"}
            </Text>
          </View>
          <View style={styles.divider} />
          //Location
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: deviceWidth,
              height: 30,
            }}
          >
            <View style={styles.locationBox}>
              <FontAwesome
                style={{
                  textAlign: "center",
                  marginTop: 1,
                  fontSize: 24,
                  color: "white",
                }}
              >
                {Icons.mapMarker}
              </FontAwesome>
            </View>

            <Text
              style={styles.menuTextItem}
              onPress={() => this.handlePress(6)}
            >
              {globals.location}
            </Text>
          </View>
          <View style={styles.divider} />
          //Settings
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: deviceWidth,
              height: 30,
            }}
          >
            <View style={styles.settingsBox}>
              <FontAwesome
                style={{
                  textAlign: "center",
                  marginTop: 1,
                  fontSize: 24,
                  color: "white",
                }}
              >
                {Icons.cog}
              </FontAwesome>
            </View>

            <Text
              style={styles.menuTextItem}
              onPress={() => this.handlePress(7)}
            >
              {"Settings"}
            </Text>
          </View>
          <View style={styles.divider} />
          //Log Out
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              width: deviceWidth,
              height: 30,
            }}
          >
            <View style={styles.signOutBox}>
              <FontAwesome
                style={{
                  textAlign: "center",
                  marginTop: 1,
                  fontSize: 24,
                  color: "white",
                }}
              >
                {Icons.signOut}
              </FontAwesome>
            </View>

            <Text
              style={styles.menuTextItem}
              onPress={() => this.handlePress(8)}
            >
              {globals.log_out}
            </Text>
          </View>
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
    full_name: state.auth.full_name,
    token: state.auth.token,
    assigned_user_id: state.auth.assigned_user_id,
    url: state.auth.url,
    isProfileBase64: state.auth.isProfileBase64,
    profilePicData: state.auth.profilePicData,
    loginTime: state.auth.loginTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ updateProfilePic, logout }, dispatch);
};
export default Login = connect(mapStateToProps, mapDispatchToProps)(Menu);
