import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Image,
    Dimensions,
    DatePickerIOS,
    TouchableHighlight,
    StatusBar,
    AlertIOS
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Content, Form, Item, Input, Label, Picker, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Spinner } from 'native-base';
import { login, logout, updateToken } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Navigation } from 'react-native-navigation';
import FontAwesome, { Icons, parseIconName } from 'react-native-fontawesome';
import globals from '../../globals';
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
import {
    TextField
} from 'react-native-material-textfield';
import DatePicker from 'react-native-datepicker'
import NotificationService from '../../NotificationService';
import apiCallForToken from '../../controller/ApiCallForToken';
import { Dropdown } from 'react-native-material-dropdown';//go to https://github.com/n4kz/react-native-material-dropdown#readme for more info
import RelateToView from '../custom/relateToView';

//* this is the separate file to update the call details for account
class UpdateCallAccount extends Component {


    constructor(props) {
        super(props);

        const curr = new Date().toISOString().split('T')[0];//! not in use
        this.notif = new NotificationService(this)
        this.state = {
            loading: false,
            disable: false,
            //assigned_user_id:this.props.data.assigned_user_id,
            username: '',
            submitLoading: true,
            password: '',
            accountName: '',
            account_name: '',
           
           
            title: this.props.data.name,
            description: this.props.data.description,
            date: globals.formatUtcDateAndTimeToLocal(this.props.data.date_start),
            formatDate: '',
            reminder: this.props.data.reminder_time,
            duration: this.props.data.duration_hours,
            status: this.props.data.status,
            relate_to: '',
            adata: '',
           
            parent_name: this.props.account_name,
            parent_id: this.props.account_id,
            module_name:globals.accounts,

            parent_data: [],

            //new fields
            process_type_c: this.props.data.process_type_c,
            dispostion_c: this.props.data.dispostion_c,
            sub_disposition_c: this.props.data.sub_disposition_c,
            dispostion_cList: [],
            sub_disposition_cList: [],

        }

        this.state.parent_id = this.props.account_id;
        this.state.adata = this.props.data;
        console.log('in update call');
        console.log(this.props.data);
        console.log('call id: ' + this.state.adata.id);


        // this.state.adata = this.props.data;
        // console.log('update contact data');
        // console.log(this.state.adata);


        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'create', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                    disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    systemItem: 'save'
                }
            ], // see "Adding buttons to the navigator" below for format (optional)


            animated: true // does the change have transition animation or does it happen immediately (optional)
        });

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

        this.props.navigator.setStyle({
            navBarBackgroundColor: 'white',
            navBarTextColor: '#0067ff',
            navBarButtonColor: '#0067ff'
        });

        this.props.navigator.setDrawerEnabled({
            side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
            enabled: true // should the drawer be enabled or disabled (locked closed)
        });
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.type == 'NavBarButtonPress') {
            // this is the event type for button presses
            if (event.id == 'create') { // this is the same id field from the static navigatorButtons definition
                //AlertIOS.alert('SalesMobi', 'You pressed search button');
                // this.props.navigator.push({
                //     screen: 'app.ContactDetails'
                // });

                this.logCall();
            }
        }
    }


    //! not in use
    goBack() {
        this.props.navigator.pop({
            animated: true, // does the pop have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }


    onValueChange(value) {
        this.setState({
            reminder: value
        });
    }

    onDurationChange(value) {
        this.setState({
            duration: value
        });
    }

    onStatusChange(value) {
        this.setState({
            status: value
        });
    }


    // disable the save button once clicked to avoid creating mulitple records by pressing it multiple time
    disableButton() {
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'create', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                    disabled: true, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    systemItem: 'save'
                }
            ], // see "Adding buttons to the navigator" below for format (optional)


            animated: true // does the change have transition animation or does it happen immediately (optional)
        });

    }

    //re-format the date and send it to the CRM. This will return a date and can be sent via api
    // reFormatDate(date){
    //     Number.prototype.padLeft = function (base, chr) {
    //         var len = (String(base || 10).length - String(this).length) + 1;
    //         return len > 0 ? new Array(len).join(chr || '0') + this : this;
    //     }
    //     console.log('before: ',date);//this date should be sent with API
    //     //var dformat = new Date(date);
    //     var d = new Date(date),
    //     dformat = [d.getFullYear(),
    //     (d.getMonth() + 1).padLeft(),
    //     d.getDate().padLeft(),
    //     ].join('-') + ' ' +
    //         [d.getHours().padLeft(),
    //         d.getMinutes().padLeft(),
    //         d.getSeconds().padLeft()].join(':');

    //     console.log('reformatted: ',dformat);//this date should be sent with API
    //     return dformat;
    // }

    //integrate log call api here. This will update the call details into the CRM
    logCall() {

        let proceed = true;
        if (this.state.title == '' || this.state.title == null || this.state.title == ' ' || this.state.title == undefined) {
            proceed = false;
            Alert.alert('Validation Error', 'Please enter Subject');
        } else if (this.state.date == '' || this.state.date == null || this.state.date == ' ' || this.state.date == undefined) {
            proceed = false;
            Alert.alert('Validation Error', 'Please select a date');
        } else if (this.state.duration == '' || this.state.duration == null || this.state.duration == ' ' || this.state.duration == undefined) {
            Alert.alert('Validation Error', 'Please select duration');
            proceed = false;
        }

        if (proceed) {
            this.disableButton();
            var data = [];
            this.setState({ loading: true });
            this.setState({ disable: true });

            let url = globals.home_url + "/uupdate" + "?token_id=" + this.props.token + "&id=" + this.state.adata.id + "&module_name=" + globals.calls +
                "&name=" + this.state.title + "&status=" + this.state.status +
                // "&reminder_time="+ this.state.reminder +
                "&date_start=" + globals.reFormatDateToSendOnServer(this.state.date) + "&duration_hours=" + this.state.duration + "&description=" + this.state.description +
                "&assigned_user_name=" + this.props.username
                + "&process_type_c=" + this.state.process_type_c
                + "&dispostion_c=" + this.state.dispostion_c
                + "&sub_disposition_c=" + this.state.sub_disposition_c
                + "&assigned_user_id=" + this.props.assigned_user_id +
                "&parent_id=" + this.state.parent_id + "&parent_type=" + globals.accounts
                + "&url=" + this.props.url;
            console.log(url);

            fetch(url, {
                method: "GET",
                dataType: 'jsonp',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            })
                .then((response) => {
                    return response.json() // << This is the problem
                })
                .then((response) => {

                    console.log('update call response:');
                    console.log(response);
                    proceed = true;
                    if (response.success === true) {
                        console.log('call id');
                        console.log(response.data.result.id);
                        this.setState({ parent_data: response.data.result });

                        // this.setReminder(response)
                        //call relationship api here to relate this created call with this particular lead
                        this.relateCall(response.data.result.id);

                        this.setState({ loading: false });
                        this.setState({ disable: false });

                        Navigation.startSingleScreenApp({
                            screen: {
                                screen: 'app.CallDetailsAccounts',
                                title: '',
                                animationType: 'slide-horizontal',

                            },
                            passProps: { id: response.data.result.id, type: 'create', module: 'Calls', account_id: this.state.parent_id, parent_name: this.state.parent_name }, // simple serializable object that will pass as props to all top screens (optional)
                            animationType: 'slide-horizontal'
                        })

                        //call relationship api here to relate this created call with this particular lead
                    } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
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
                            //create the call, after session generated
                            this.logCall()

                        }).catch(error => {
                            console.log("getToken: error = " + error)
                            this.setState({ loading: false, disable: false });
                        })

                    } else {
                        this.setState({ loading: false });
                        this.setState({ disable: false });
                    }

                })
                .catch(err => {
                    console.log(err);
                    this.setState({ loading: false });
                    this.setState({ disable: false });
                    Alert.alert('Error', 'Oops! Something went wrong, please try again.');
                });
        }
    }

    /**
         * setReminder(response) : this method sets the notification from NotificationService file
         * @param {*} response : is the response we get after saving appointment
         */
    setReminder(response) {
        this.notif.updateScheduledNotification(response, globals.calls, globals.accounts)
    }


    relateCall(id) {

        let url = globals.home_url + "/setRelationship" + "?token_id=" + this.props.token + "&module_name=" + globals.accounts +
            "&module_id=" + this.state.parent_id + "&link_field_name=" + globals.calls + "&related_ids=" + id + "&delete=0"
            + "&url=" + this.props.url;

        console.log('Relate call url');
        console.log(url);


        fetch(url, {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                return response.json() // << This is the problem
            })
            .then((response) => {

                console.log('relate call response:');
                console.log(response);
                proceed = true;
                if (response.success === true) {

                    // Navigation.startSingleScreenApp({
                    //     screen: {
                    //         screen: 'app.CallDetailsAccounts',
                    //         title: '',
                    //         animationType: 'slide-horizontal',

                    //     },
                    //         passProps: {id: id,type: 'create',module: 'Calls',account_id: this.state.account_data.id, parent_name: parent_name}, // simple serializable object that will pass as props to all top screens (optional)
                    //     animationType: 'slide-horizontal'
                    // })
                }

            })
            .then(() => {
                this.setState({ loading: false });
                this.setState({ disable: false });
                // console.log(this.state.booking_nums);
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
                Alert.alert('Error', 'Oops! Something went wrong, please try again.');
            });

    }

    render() {
        return (
            <Container>
                <Content>

                    {this.state.loading &&
                        <View style={[styles.content, { marginTop: containerHeight / 3 }]}>
                            <Spinner color='red' />
                        </View>
                    }


                    {this.state.loading == false && this.state.submitLoading &&
                        <View>

                            <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>
                                <TextField
                                    label='Subject*'
                                    autoCapitalize='none'
                                    value={this.state.title}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ title: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />
                            </View>

                            <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>
                                <TextField
                                    label='Remarks'
                                    autoCapitalize='none'
                                    value={this.state.description}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ description: text })}
                                    textColor='#000'
                                    multiline={true}
                                    // maxLength={150}
                                    // characterRestriction={150}
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />
                            </View>

                            <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', marginRight: 0, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>
                                <View style={{ flex: 0.9 }} >
                                    <TextField
                                        label='Start Date & Time*'
                                        autoCapitalize='none'
                                        value={this.state.date}
                                        style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                        textColor='#000'
                                        tintColor='red'
                                        placeholderTextColor='#000'
                                    />
                                </View>

                                <View style={{ flex: 0.1, flexDirection: 'column', justifyContent: 'center' }}>
                                    {/* <TouchableHighlight style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }} underlayColor="white">
                                        <FontAwesome style={{ fontSize: 25, color: globals.colors.color_accent }} >
                                            {Icons.calendar}
                                        </FontAwesome>

                                    </TouchableHighlight> */}
                                    <DatePicker
                                        style={{ width: 20 }}
                                        date={this.state.date}
                                        mode="datetime"
                                        placeholder="select date"
                                        format={globals.DEFAULT_FORMAT}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        onDateChange={(date) => { this.setState({ date: date }) }}
                                    />
                                </View>
                            </View>

                            <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>

                                <Dropdown
                                    label='Process Type'
                                    data={this.props.process_type_cList}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value, index) => {
                                        this.setState({ process_type_c: value })
                                        console.log("Process Type: json = " + JSON.stringify(this.props.process_type_cList[index]));
                                        this.setState({ dispostion_cList: this.props.process_type_cList[index].dispostion_c , sub_disposition_cList:[], dispostion_c:'', sub_disposition_c:''})
                                    }}
                                    value={this.state.process_type_c}
                                />


                                <Dropdown
                                    label='Dispostion'
                                    data={this.state.dispostion_cList}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value, index) => {
                                        this.setState({ dispostion_c: value })
                                        console.log("Process Type: json = " + JSON.stringify(this.state.dispostion_cList[index]));
                                        this.setState({ sub_disposition_cList: this.state.dispostion_cList[index].sub_disposition_c, sub_disposition_c:'' })

                                    }}
                                    value={this.state.dispostion_c}
                                />

                                <Dropdown
                                    label='Sub Disposition'
                                    data={this.state.sub_disposition_cList}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value) => { this.setState({ sub_disposition_c: value }) }}
                                    value={this.state.sub_disposition_c}
                                />
                            </View>

                            <Form>
                                {/* 
                            <Picker
                                mode="dropdown"
                                iosHeader="Reminder"
                                placeholder="Reminder"
                                style={{ width: deviceWidth }}
                                selectedValue={this.state.reminder}
                                onValueChange={this.onValueChange.bind(this)}
                            >
                                <Picker.Item label="No Reminder" value="0" />
                                    <Picker.Item label="1 Minute Prior" value="60" />
                                    <Picker.Item label="5 Minute Prior" value="300" />
                                    <Picker.Item label="10 Minute Prior" value="600" />
                                    <Picker.Item label="15 Minute Prior" value="900" />
                                    <Picker.Item label="30 Minute Prior" value="1800" />
                                    <Picker.Item label="1 Hour Prior" value="3600" />
                                    <Picker.Item label="2 Hour Prior" value="7200" />
                            </Picker> */}

                                <Text style={{ marginRight: 17, marginLeft: 17, fontSize: 12, color: globals.colors.grey, marginTop: 10 }}>Duration*</Text>

                                <Picker
                                    mode="dropdown"
                                    iosHeader="Duration"
                                    placeholder="Duration*"
                                    style={{ width: deviceWidth }}
                                    selectedValue={this.state.duration}
                                    onValueChange={this.onDurationChange.bind(this)}
                                >
                                    <Picker.Item label="15 Minutes" value="15" />
                                    <Picker.Item label="30 Minutes" value="30" />
                                    <Picker.Item label="45 Minutes" value="45" />
                                    <Picker.Item label="60 Minutes" value="60" />
                                    <Picker.Item label="75 Minutes" value="75" />
                                    <Picker.Item label="90 Minutes" value="90" />
                                </Picker>
                                <Text style={{ marginRight: 17, marginLeft: 17, fontSize: 12, color: globals.colors.grey, marginTop: 10 }}>Status</Text>

                                <Picker
                                    mode="dropdown"
                                    iosHeader="Status"
                                    placeholder="Status"
                                    style={{ width: deviceWidth }}
                                    selectedValue={this.state.status}
                                    onValueChange={this.onStatusChange.bind(this)}
                                >
                                    <Picker.Item label="Planned" value="Planned" />
                                    <Picker.Item label="Held" value="Held" />
                                    <Picker.Item label="Not Held" value="Not Held" />
                                </Picker>
                            </Form>

                            {/* <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>
                                <TextField
                                    label={globals.label_relate_to + " Client"}
                                    autoCapitalize='none'
                                    disabled={true}
                                    value={this.state.parent_name}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ parent_name: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />
                            </View> */}


                        <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 20, paddingBottom: 0 }} >
                            <RelateToView component={this} />
                        </View>

                        </View>
                    }
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
         isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
        token: state.auth.token,
        username: state.auth.username,
        password: state.auth.password,
        basicdata: ownProps,
        assigned_user_id: state.auth.assigned_user_id,
        url: state.auth.url,


        salutationList: state.auth.salutationList,
        lead_sourceList: state.auth.lead_sourceList,
        statusList: state.auth.statusList,
        interested_product_cList: state.auth.interested_product_cList,
        disposition_category_cList: state.auth.disposition_category_cList,
        occupation_type_cList: state.auth.occupation_type_cList,
        process_type_cList: state.auth.process_type_cList,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login, logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(UpdateCallAccount);