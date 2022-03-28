import React, { Component } from "react";
import {
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import globals from "../../globals";
import { connect } from "react-redux";
import { logout, updateToken } from "../../actions/auth";
import { bindActionCreators } from "redux";
import {
  Card,
  ListItem,
  Header,
  Item,
  Input,
  Icon,
  Button,
  Spinner,
  Body,
  Content,
  Container,
} from "native-base";
import styles from "./style";
const deviceHeight = Dimensions.get("window").height;

class FilterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchtext: "Please select data",
      searchtype: "",
      modalvisible: false,
      buttonenable: false,
      dataArray: [
        {
          id: 0,
          type: "TodayAppointment",
          text: "Today's Appointment",
        },
        {
          id: 1,
          type: "Todayfollowup",
          text: "Today's Followup",
        },
        {
          id: 2,
          type: "AppointmentLapsed",
          text: "Appointment Lapsed",
        },
        {
          id: 3,
          type: "OpenLeads",
          text: "Pending Direct Leads",
        },
      ],
    };
    this.props.navigator.setButtons({
      leftButtons: [
        {
          icon: require("../../../images/hamburger_small.png"), // for icon button, provide the local image asset name
          id: "menu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        },
      ],
      animated: true, // does the change have transition animation or does it happen immediately (optional)
    });

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.props.navigator.setDrawerEnabled({
      side: "left", // the side of the drawer since you can have two, 'left' / 'right'
      enabled: true, // should the drawer be enabled or disabled (locked closed)
    });
  }
  onNavigatorEvent(event) {
    // this is the onPress handler for the two buttons together
    if (event.type == "NavBarButtonPress") {
      if (event.id == "menu") {
        this.props.navigator.toggleDrawer({
          side: "left", // the side of the drawer since you can have two, 'left' / 'right'
          animated: true, // does the toggle have transition animation or does it happen immediately (optional)
          to: "missing", // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
        });
      }
    }
  }
  componentDidMount() {}

  modalrender = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({
            searchtext: item.text,
            searchtype: item.type,
            modalvisible: false,
            buttonenable: true,
          });
        }}
        style={{
          borderBottomColor: "gray",
          borderBottomWidth: 2,
          padding: 20,
        }}
      >
        <Text style={{ color: "black", fontFamily: "Roboto", fontSize: 14 }}>
          {item.text}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <Container>
        <Content>
          <View style={styles.filterheadView}>
            <Text
              style={{
                color: "white",
                padding: 10,
                fontFamily: "Roboto",
                fontSize: 14,
              }}
            >
              Filter by condition
            </Text>
          </View>
          <View style={{ height: deviceHeight - 200 }}>
            <View style={styles.dropdownview}>
              <View style={{ width: "95%" }}>
                <Text
                  style={{ fontFamily: "Roboto", fontSize: 14, color: "black" }}
                >
                  {this.state.searchtext}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.setState({ modalvisible: true })}
                style={{ width: "5%", marginTop: 5 }}
              >
                <Image
                  source={
                    this.state.modalvisible
                      ? require("../../../images/uparrow.png")
                      : require("../../../images/downarrow.png")
                  }
                  style={{ height: 15, width: 15 }}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  searchtext: "Please select data",
                  searchtype: "",
                  buttonenable: false,
                });
              }}
              style={{
                backgroundColor: "gray",
                width: "48%",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  padding: 20,
                  alignSelf: "center",
                  fontFamily: "Roboto",
                  fontSize: 14,
                }}
              >
                CLEAR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.state.buttonenable
                  ? this.props.navigator.push({
                      screen: "app.Leads",
                      title: "Leads",
                      subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                      passProps: { filterData: this.state.searchtype }, // Object that will be passed as props to the pushed screen (optional)
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
                    })
                  : null
              }
              style={{
                backgroundColor: !this.state.buttonenable ? "gray" : "blue",
                width: "48%",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  padding: 20,
                  alignSelf: "center",
                  fontFamily: "Roboto",
                  fontSize: 14,
                }}
              >
                APPLY
              </Text>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalvisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              this.setState({ modalvisible: false });
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.setState({ modalvisible: false });
              }}
              style={{
                flex: 1,
                backgroundColor: 'rgba("0,0,0,0.2")',
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                  alignSelf: "center",
                  width: "80%",
                }}
              >
                <View>
                  <FlatList
                    data={this.state.dataArray}
                    renderItem={this.modalrender}
                    keyExtractor={(item) => item.id}
                  />
                  {/* {this.modalrender("Todays Appointments")}
                  {this.modalrender("Todays follow ups")}
                  {this.modalrender("Lasped Appointments")}
                  {this.modalrender("Pending Direct List")} */}
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
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
    url: state.auth.url,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ logout, updateToken }, dispatch);
};

export default Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterScreen);
