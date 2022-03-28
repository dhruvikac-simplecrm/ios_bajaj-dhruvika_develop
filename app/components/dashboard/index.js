import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    AlertIOS
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import MTD from './mtd';
import Qtd from './qtd';
import YTD from './ytd';
import Tabs from 'react-native-tabs';
import { Navigation } from 'react-native-navigation';

class Dashboard extends Component {


    constructor(props) {
       
        super(props);

        this.state = {
            username: '',
            password: '',
            test: 'first',
            page: 'first',
            data:''
        }

        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'home', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    icon: require('../../../images/icon_home24.png'), // for icon button, provide the local image asset name
                },
            ], // see "Adding buttons to the navigator" below for format (optional)
            leftButtons: [
                {
                    icon: require('../../../images/hamburger_small.png'), // for icon button, provide the local image asset name
                    id: 'menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                },
            ],
            animated: true // does the change have transition animation or does it happen immediately (optional)
        });





        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.props.navigator.setDrawerEnabled({
            side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
            enabled: true // should the drawer be enabled or disabled (locked closed)
        });


    }

    changeTab = (tab) => {
        console.log('tab');
        this.setState({ page: tab });

        if (tab == 'first') {
            this.setState({ test: 'show first one' });
        } else if (tab == 'second') {
            this.setState({ test: 'show second one' });
        }
        console.log(tab);
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses

            if (event.id == 'save') {
                //AlertIOS.alert('SalesMobi', 'Add button pressed');


                if (this.state.page === 'first') {
                    this.changeTab('second');
                } else if (this.state.page === 'second') {
                    this.changeTab('third');
                } else if (this.state.page === 'third') {
                    AlertIOS.alert('SalesMobi', 'Now you can proceed');
                }

            }

            if (event.id == 'home') {
                Navigation.startSingleScreenApp({

                    screen: {
                        screen: 'app.TileMenu', // unique ID registered with Navigation.registerScreen
                        title: 'Home', // title of the screen as appears in the nav bar (optional)
                        navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                    },
                    drawer: {
                        // optional, add this if you want a side menu drawer in your app
                        left: {
                            // optional, define if you want a drawer from the left
                            screen: 'app.Menu', // unique ID registered with Navigation.registerScreen
                            passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
                            disableOpenGesture: false, // can the drawer be opened with a swipe instead of button (optional, Android only)
                            fixedWidth: 500 // a fixed width you want your left drawer to have (optional)
                        },
                        style: {
                            // ( iOS only )
                            drawerShadow: false, // optional, add this if you want a side menu drawer shadow
                            contentOverlayColor: 'rgba(0,0,0,0.25)', // optional, add this if you want a overlay color when drawer is open
                            leftDrawerWidth: 70, // optional, add this if you want a define left drawer width (50=percent)
                            rightDrawerWidth: 50 // optional, add this if you want a define right drawer width (50=percent)
                        },
                        type: 'TheSideBar', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
                        animationType: 'slide-and-scale', //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
                        // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
                        disableOpenGesture: false // optional, can the drawer, both right and left, be opened with a swipe instead of button
                    },
                    passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
                    animationType: 'slide-left'
                });
            }
        }
    }
    goBack() {
        this.props.navigator.pop({
            animated: true, // does the pop have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }
    render() {
        return (
            <Container style={{ paddingTop: 0 }} >
                <View style={styles.container}>
                    <View style={styles.tabContainer}>
                        {this.state.page == 'first' &&
                            <MTD />
                        }
                        {this.state.page == 'second' &&
                            <Qtd />
                        }
                        {this.state.page == 'third' &&
                            <YTD />
                        }
                    </View>
                    <Tabs selected={this.state.page} style={{ backgroundColor: 'white' }}
                        selectedStyle={{ color: 'red' }} onSelect={el => this.changeTab(el.props.name)}>
                        <Text name="first" selectedIconStyle={{ borderTopWidth: 2, borderTopColor: 'red' }}>MTD</Text>
                        <Text name="second" selectedIconStyle={{ borderTopWidth: 2, borderTopColor: 'red' }}>QTD</Text>
                        <Text name="third" selectedIconStyle={{ borderTopWidth: 2, borderTopColor: 'red' }}>YTD</Text>
                    </Tabs>
                </View>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
         isLoggedIn: state.auth.isLoggedIn,
         token: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
        loginTime: state.auth.loginTime,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Dashboard);