import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Image,
    AlertIOS
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Content, Separator, Label, Item, List, Tab, Tabs, ScrollableTab, ListItem, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login , logout, updateToken} from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';

import globals from '../../globals';
import { Navigation } from 'react-native-navigation';
import apiCallForToken from '../../controller/ApiCallForToken';

//* this file shows the calls details related to a specific account

class CallDetailsAccounts extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            cdata: '',
            loading: true,
            call_data: '',
            reminder_time: '',
            appointment_data: '',
            parent_data: [],
            parent_name: '',
            parent_id: '',
            date_formatted: ''
        }

        // this.setState({parent_name: this.props.parent_data[0].name});
        // this.setState({parent_id: this.props.parent_data[0].id});

        //if the user is coming from the activity detail view then store props array values 
        //and if the user is coming from the create activity then store different values

        if (this.props.type === 'detail') {
            parent_name = this.props.parent_data[0].name;
            parent_id = this.props.parent_data[0].id;
        } else if (this.props.type === 'create') {
            parent_name = this.props.parent_name;
            parent_id = '';
        }


        console.log('type: ' + this.props.type);
        console.log('appointment id: ' + this.props.id);
        console.log('module name: ' + this.props.module);
        console.log('Account ID: ' + this.props.account_id);
        console.log('token: ' + this.props.token);
        console.log('parent name: ' + parent_name);
        console.log('parent id: ' + parent_id);


        //here we set buttons on the action bar
        this.props.navigator.setButtons({
            rightButtons: [
                {

                    id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                    disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    systemItem: 'edit'
                },

            //     {

            //         id: 'delete', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            //         testID: 'e2e_delete', // optional, used to locate this view in end-to-end tests
            //         disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
            //         disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
            //         buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
            //         buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
            //         systemItem: 'trash'
            //     }
            ], // see "Adding buttons to the navigator" below for format (optional)

            leftButtons: [

                {
                    id: 'back',
                    title: 'Back',
                    testID: 'back',
                    icon: require('../../../images/icon_left30.png'), // for icon button, provide the local image asset name
                    buttonFontSize: 16,
                    buttonFontWeight: '600',
                }

            ],

            animated: true // does the change have transition animation or does it happen immediately (optional)
        });


        //applied a style to the action bar
        this.props.navigator.setStyle({
            navBarBackgroundColor: 'white',
            navBarTextColor: '#0067ff',
            navBarButtonColor: '#0067ff'
        });

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

        this.props.navigator.setDrawerEnabled({
            side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
            enabled: true // should the drawer be enabled or disabled (locked closed)
        });
    }

    //this function is used to allow user to click on the action bar buttons
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.type == 'NavBarButtonPress') {
            // this is the event type for button presses
            if (event.id == 'edit') { // this is the same id field from the static navigatorButtons definition
                //AlertIOS.alert('SalesMobi', 'You pressed search button');

                /*this.props.navigator.pop({
                    animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
                    animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
                  });*/


                this.props.navigator.push({
                    screen: 'app.UpdateCallAccount',
                    title: 'Edit Call',
                    subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                    passProps: { data: this.state.call_data, account_id: this.props.account_id, account_name: parent_name }, // Object that will be passed as props to the pushed screen (optional)
                    animated: true, // does the push have transition animation or does it happen immediately (optional)
                    animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                    backButtonTitle: 'Back', // override the back button title (optional)
                    backButtonHidden: false, // hide the back button altogether (optional)
                    navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
                    navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
                    // enable peek and pop - commited screen will have `isPreview` prop set as true.
                    previewView: undefined, // react ref or node id (optional)
                    previewHeight: undefined, // set preview height, defaults to full height (optional)
                    previewCommit: true, // commit to push preview controller to the navigation stack (optional)
                    previewActions: [{ // action presses can be detected with the `PreviewActionPress` event on the commited screen.
                        id: '', // action id (required)
                        title: '', // action title (required)
                        style: undefined, // 'selected' or 'destructive' (optional)
                        actions: [], // list of sub-actions
                    }],
                });
            }

            if(event.id == 'delete'){
                Alert.alert(
                    'Delete Call',
                    'Are you sure you want to delete this Call?',
                    [
                        {
                            text: 'OK',
                            onPress: () => this.delete(this.props.id)
                        },
                        { text: 'Cancel', style: 'cancel' },
                    ],
                    { cancelable: false }
                )
            }

            //this is the left icon click event to go back to the list view
            if (event.id == 'back') {
                //AlertIOS.alert('SalesMobi', 'Back button pressed');
                if(this.props.isBackgroundNotification){
                    //If the user clicks on notification when app is closed, then goto homescreen when pressed back
                    this.goHome()
                }else if(this.props.isForegroundNotification){               
                     //otherwise, goto from where user come to this screen
                    //   this.props.navigator.pop(this.props.screen);
                    this.goHome()
                } else{
                    this.goBack();
                }
                // this.props.navigator.pop({
                //     screen: 'app.ContactDetails',
                //     animated: true, // does the popToRoot have transition animation or does it happen immediately (optional)
                //     animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the popToRoot have different transition animation (optional)
                //   });

                this.props.navigator.pop(this.props.componentId);
            }
        }
    }

    componentDidMount = () => {
        this.getDetails();
    };


    goHome(){
        Navigation.startSingleScreenApp({
            screen: {
              screen: 'app.TileMenu', // unique ID registered with Navigation.registerScreen
              title: 'Home', // title of the screen as appears in the nav bar (optional)
              navigatorStyle: {
    
              }, // override the navigator style for the screen, see "Styling the navigator" below (optional)
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
              type: 'MMDrawer', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
              animationType: 'parallax', //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
              // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
              disableOpenGesture: false // optional, can the drawer, both right and left, be opened with a swipe instead of button
            },
            passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
            animationType: 'slide-horizontal'
          });
    }

    goBack(){
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'app.AccountDetails',
                title: 'Client',
                animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                backButtonTitle: 'Back', // override the back button title (optional)
                backButtonHidden: false, // hide the back button altogether (optional)

                navigatorButtons: {
                    leftButtons: [

                        {
                            id: 'back',
                            text: 'Back',
                            testID: 'back',
                            icon: require('../../../images/icon_left30.png'), // for icon button, provide the local image asset name
                            buttonFontSize: 12,
                            buttonFontWeight: '200',

                        }

                    ],
                }, // override the nav buttons for the pushed screen (optional)

            },
            passProps: { account_id: this.props.account_id }, // Object that will be passed as props to the pushed screen (optional)
        });
    }


    //get the details from this API function
    getDetails() {
        this.next_offset = this.page * 10;
        var data = [];
        var proceed = false;
        var total_count = 0;

        let url = globals.home_url + "/ushow" + "?token_id=" + this.props.token +
            "&module_name=" + this.props.module + "&fields=" + globals.CALLS_FIELDS +
            "&id=" + this.props.id
            + "&url="+this.props.url;


        console.log('detail url: ' + url);

        fetch(url, {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        })
            .then((response) => {
                return response.json() // << This is the problem
            })
            .then((response) => {

                console.log('detail response: ' + response);
                proceed = true;
                if (response.success === true) {
                    // your code here
                    this.setState({ call_data: response.data.result });
                    this.setReminderValue(this.state.call_data.reminder_time);
                    this.setState({
                        date_formatted: globals.formatUtcDateAndTimeToLocal(this.state.call_data.date_start)
                    })

                    if(this.props.from_list){
                        this.props.navigator.push({
                            screen: 'app.UpdateCallAccount',
                            title: 'Edit Call',
                            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                            passProps: { data: this.state.call_data, account_id: this.props.account_id, account_name: parent_name }, // Object that will be passed as props to the pushed screen (optional)
                            animated: true, // does the push have transition animation or does it happen immediately (optional)
                            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                            backButtonTitle: 'Back', // override the back button title (optional)
                            backButtonHidden: false, // hide the back button altogether (optional)
                        });
                    }
                } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    // this.setState({ loading: false });

                    // Alert.alert(
                    //     globals.app_messages.error_string,
                    //     globals.app_messages.token_expired,
                    //     [
                    //     { text: globals.login, onPress: () => this.props.logout() }
                    //                ],
                    //     { cancelable: false }
                    // )

                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.setState({ loading: false, disable: false });
                            return;
                        }
                        //get client details, after session generated
                        this.getDetails()
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ loading: false, disable: false });
                    })

                } else {
                    this.setState({ loading: false });
                    Alert.alert('Error', response.data.description)
                }
            })
            // .then(() => {

            //     this.setState({ dataHasValue: true });
            //     this.setState({ loading: false });
            // })
            .catch(err => {
                console.log(err);
            });

    }

    //set the reminder value  in a format user can understand. This function takes a value coming from the API

    setReminderValue(reminder_time) {

        if (reminder_time === '0') {
            this.setState({
                reminder_time: 'No Reminder'
            });

        } else if (reminder_time === '60') {
            this.setState({
                reminder_time: '1 Minute Prior'
            });
        } else if (reminder_time === '300') {
            this.setState({
                reminder_time: '5 Minute Prior'
            });
        } else if (reminder_time === '600') {
            this.setState({
                reminder_time: '10 Minute Prior'
            });
        } else if (reminder_time === '900') {
            this.setState({
                reminder_time: '15 Minute Prior'
            });
        } else if (reminder_time === '1800') {
            this.setState({
                reminder_time: '30 Minute Prior'
            });
        } else if (reminder_time === '3600') {
            this.setState({
                reminder_time: '1 Hour Prior'
            });
        } else if (reminder_time === '7200') {
            this.setState({
                reminder_time: '2 Hour Prior'
            });
        }

    }

    // go to the related account from this screen using this function
    accountDetails(id) {
        this.props.navigator.push({
            screen: 'app.AccountDetails',
            title: 'Client',
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: { account_id: id }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
            backButtonTitle: 'Back', // override the back button title (optional)
            backButtonHidden: false, // hide the back button altogether (optional)
            navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
            navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
            // enable peek and pop - commited screen will have `isPreview` prop set as true.
            previewView: undefined, // react ref or node id (optional)
            previewHeight: undefined, // set preview height, defaults to full height (optional)
            previewCommit: true, // commit to push preview controller to the navigation stack (optional)
            previewActions: [{ // action presses can be detected with the `PreviewActionPress` event on the commited screen.
                id: '', // action id (required)
                title: '', // action title (required)
                style: undefined, // 'selected' or 'destructive' (optional)
                actions: [], // list of sub-actions
            }],
        });

    }

    delete(id){

        this.setState({ loading: true });
        this.setState({ disable: true });
        let url = globals.home_url + "/udestroy" + "?token_id=" + this.props.token
         + "&id=" + id + "&module_name=" + globals.calls
         + "&url="+this.props.url;
        console.log(url);

        fetch(url, {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        })

            .then((response) => {
                return response.json() // << This is the problem
            })
            .then((response) => {

                console.log(response);
                proceed = true;
                if (response.success === true) {
                    if (response.data.result) {
                        this.goBack();
                    }
                }else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    // Alert.alert(
                    //     globals.app_messages.error_string,
                    //     globals.app_messages.token_expired,
                    //     [
                    //     { text: globals.login, onPress: () => this.props.logout() }
                    //                ],
                    //     { cancelable: false }
                    // )
                }  else {
                    Alert.alert('Error', response.message);
                }

            })
            .then(() => {

                this.setState({ dataHasValue: true });
                this.setState({ loading: false });
            })
            .catch(err => {
                console.log(err);
            });

    }


    render() {
        return (
            <Container style={styles.containerBackground} >
                <Content>

                    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: globals.colors.color_primary, paddingTop: 35, paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
                        <View style={{ flex: 0.7, marginLeft: 10 }}>
                            <Text style={styles.detailViewHeader}>{this.state.call_data.name}</Text>
                            <Text style={styles.detailViewHeaderText}>{this.state.call_data.status}</Text>
                        </View>
                    </View>
                    <View style={{ padding: 5 }}>

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Remarks</Label>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.call_data.description}</Text>
                            </View>
                        </View>
                        <Item></Item>

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>{globals.label_start_date_time}</Label>
                        {/* <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>+92 20982393753</Text>
                            <Item></Item> */}
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.date_formatted}</Text>
                            </View>
                        </View>

                        <Item></Item>
                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Process Type</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.call_data.process_type_c}</Text>

                        <Item></Item>
                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Dispostion</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.call_data.dispostion_c}</Text>

                        <Item></Item>
                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Sub Disposition</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.call_data.sub_disposition_c}</Text>
                        
                       
                        <Item></Item>
                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Duration</Label>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.call_data.duration_hours} Minutes</Text>
                            </View>
                        </View>
                        <Item></Item>

                        {/* <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Reminder</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.reminder_time}</Text>
                        <Item></Item> */}

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Related to Client</Label>
                        <Button transparent onPress={() => this.accountDetails(this.props.account_id)} >
                            <Text style={{ fontSize: 15, color: globals.colors.color_primary_dark, paddingTop: 0, fontWeight: 'bold', paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{parent_name}</Text>
                        </Button>


                        <Item></Item>
                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Assigned To</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.call_data.assigned_user_name}</Text>

                        
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
        basicdata: ownProps,
        token: state.auth.token,
        url: state.auth.url,
        username: state.auth.username,
        password: state.auth.password
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login, logout, updateToken }, dispatch)
};
export default Login = connect(mapStateToProps, mapDispatchToProps)(CallDetailsAccounts);