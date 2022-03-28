import React, { Component } from "react";
import { View, Alert, TextInput } from "react-native";
import { connect } from "react-redux";
import {
  Container,
  Header,
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
import { bindActionCreators } from "redux";
import { Menu } from "./menu";
import styles from "./style";
import { Calendar } from "../calendar/index";
import { Recent } from "../recent/index";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    };

    this.state = {
      username: "",
      password: "",
    };

    this.props.navigator.setDrawerEnabled({
      side: "left", // the side of the drawer since you can have two, 'left' / 'right'
      enabled: true, // should the drawer be enabled or disabled (locked closed)
    });
  }

  switchScreen(index) {
    this.setState({ index: index });
    let AppComponent = null;

    if (this.state.index == 0) {
      AppComponent = Calendar;
    } else {
      AppComponent = Recent;
    }
  }
  //design
  render() {
    return (
      <Container style={styles.mainContainer}>
        <Content>
          <View style={styles.buttonView}>
            <Button
              light
              onPress={() => {
                Alert.alert("You tapped the button!");
              }}
            >
              <Text>Light</Text>
            </Button>
          </View>
        </Content>

        <Footer>
          <FooterTab>
            <Button vertical onPress={() => this.switchScreen(0)}>
              <Icon name="ios-calendar" />
              <Text>Calendar</Text>
            </Button>

            <Button vertical onPress={() => this.switchScreen(1)}>
              <Icon name="ios-book" />
              <Text>Recent</Text>
            </Button>

            <Button vertical active>
              <Icon active name="ios-pie" />
              <Text>Dashboard</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    loginTime: state.auth.loginTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ login }, dispatch);
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Home);
