import React, { Component } from 'react';
import {
    View,
    Alert,
    Dimensions,
    StatusBar,
    AlertIOS
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Content, Form, Picker, Text, Spinner } from 'native-base';
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
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-material-dropdown';
import PushController from '../../PushController';
import PushNotification from 'react-native-push-notification';
import NotificationService from '../../NotificationService';
import apiCallForToken from '../../controller/ApiCallForToken';
import RelateToView from '../custom/relateToView';

////* this file is to create a meeting from a calendar. In this file if you want to relate this meeting to a particular module
//* such as Leads, Contacts, Accounts or Opportunities then you have to select module name from the dropdown and then 
//* from the next dropdown you have to select a particular module item. Then this meeting gets related to that particular item

class CreateMeetingCalendar extends Component {


    constructor(props) {
        super(props);
        this.notif = new NotificationService(this)

        this.state = {
            adata: '',
            loading: false,
            disable: false,
            //assigned_user_id:this.props.data.assigned_user_id,
            username: '',
            submitLoading: true,
            password: '',
            account_id: '',
            title: '',
            description: '',
            date: '',
            formatDate: '',
            reminder: '300',
            duration: '30',
            status: 'Planned',
            relate_to: '',
            
            module_name: 'Leads',
            parent_id: '',
            parent_name:'',

            location: '',
            module_arr: [],
            data_arr_s: [],
            show_dropdown: false,
            show_dropdown_has_value: false
        }


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

                //this.update();
                this.scheduleMeeting();
            }
        }
    }


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

    disableButton(){
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

    //schedule meeting api
    scheduleMeeting() {
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

            let url = globals.home_url + "/ustore" + "?token_id=" + this.props.token + "&module_name=" + globals.meetings +
                "&name=" + this.state.title + "&status=" + this.state.status 
                // + "&reminder_time=" + this.state.reminder 
                + "&date_start=" + globals.reFormatDateToSendOnServer(this.state.date) + "&duration_hours=" + this.state.duration + "&description=" + this.state.description +
                "&assigned_user_name=" + this.props.username + "&location=" + this.state.location +
                "&assigned_user_id=" + this.props.assigned_user_id +
                "&parent_id=" + this.state.parent_id + "&parent_type=" + this.state.module_name
                + "&url="+this.props.url;

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

                    console.log('meeting response:');
                    console.log(response);
                    proceed = true;
                    if (response.success === true) {
                        console.log('meeting id');
                        console.log(response.data.result.id);
                        this.setState({ parent_data: response.data.result });

                        // PushNotification.localNotificationSchedule({
                        //     //... You can use all the options from localNotifications
                        //     message: response.data.result.name, // (required)
                        //     date: new Date(Date.now() + (response.data.result.reminder_time * 1000)),// in 60 secs
                        //     data: {},
                        // });


                        // this.setReminder(response)

                        this.props.navigator.push({
                            screen: 'app.MeetingDetailsCalendar',
                            title: '',
                            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                            passProps: { id: response.data.result.id, module: 'Meetings' }, // Object that will be passed as props to the pushed screen (optional)
                            animated: true, // does the push have transition animation or does it happen immediately (optional)
                            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                            backButtonTitle: 'Back', // override the back button title (optional)
                            backButtonHidden: false, // hide the back button altogether (optional)
                        })
                        this.relateMeeting(response.data.result.id);
                        //call relationship api here to relate this created call with this particular lead


                    }else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
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
                            //get the call details, after session generated
                            this.scheduleMeeting()
                        }).catch(error => {
                            console.log("getToken: error = " + error)
                            this.setState({ loading: false, disable: false });
                        })
                    } else{
                        this.setState({ loading: false });
                    this.setState({ disable: false });
                    }

                })
                .catch(err => {
                    console.log(err);
                    this.setState({ loading: false });
                    Alert.alert('Error', 'Oops! Something went wrong, please try again.');
                });


        }


    }

     /**
     * setReminder(response) : this method sets the notification from NotificationService file
     * @param {*} response : is the response we get after saving appointment
     */
    setReminder(response) {
        this.notif.scheduleNotification(response, globals.meetings, globals.type_calendar)
    }

     /**
     * relateMeeting(id) : this method relates the appointment to the particule module
     * @param {*} id : created meeting Id 
     */

    relateMeeting(id){

        let url = globals.home_url+"/setRelationship"+"?token_id="+ this.props.token +"&module_name="+ this.state.module_name + 
        "&module_id=" + this.state.parent_id +"&link_field_name=meetings" + "&related_ids="+ id+"&delete=0"
        + "&url="+this.props.url;
     
        console.log('Relate meeting url');
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

            console.log('relate meeting response:');
            console.log(response);
            proceed = true;
            if (response.success === true) {

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
           //  Alert.alert('Error','Oops! Something went wrong, please try again.');
        });

    }


    formatCurrentDate(){
        const newFormatedDate = globals.formatCurrentDateAndTime()
        console.log("newFormatedDate = "+newFormatedDate)

        this.setState({
            date: newFormatedDate
        });
        return newFormatedDate;
    }

    componentDidMount(){
        this.formatCurrentDate();
    }

    loadModuleList(module_name) {

        let url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
            "&module_name=" + module_name +
            "&next_offset=0" + "&search_text=" + '' +
            "&search_fields=" + "&fields=id,name"
            +"&max_results="+globals.RECORD_LIMIT
            + "&url="+this.props.url;

        console.log(url);

        fetch(url, {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
        }
        )
            .then((response) => response.json())
            .then((response) => {
                console.log('Module response');
                console.log(response);
                if (response.success === true) {


                    this.setState({ module_arr: response.data.result });
                    console.log(this.state.module_arr);
                    var data_arr = [];
                    for (var i = 0; i < this.state.module_arr.length; i++) {
                        data_arr.push({
                            "label": this.state.module_arr[i]['name'],
                            "value": this.state.module_arr[i]['id']
                        })
                        // data_arr[i]['label'] = this.state.module_arr[i]['name'];
                        // data_arr[i]['value'] = this.state.module_arr[i]['id'];

                    }

                    console.log(data_arr);
                    this.setState({ data_arr_s: data_arr });
                    this.setState({
                        show_dropdown: false
                    });

                    this.setState({

                        show_dropdown_has_value: true

                    });
                } else {
                    console.error('Error');
                }

            })
            .catch((error) => {
                console.error(error);
            });


    }

    dependancyFunction(value) {

        this.setState({
            show_dropdown: true
        });

        this.setState({

            show_dropdown_has_value: false

        });
        console.log(value);
        //call api here to load the records with respect to the selected item
        this.loadModuleList(value);
        //set the selected item to the next dropdown title
        this.setState({
            module_name: value
        });
    }




    relateToItems = globals.relateToItems;






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
                                    label='Description'
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

                            <Form>

                                {/* <Picker
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


<Text style={{ marginRight: 17, marginLeft: 17, fontSize:12, color:globals.colors.grey, marginTop:10}}>Duration*</Text>

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

                                <Text style={{ marginRight: 17, marginLeft: 17, fontSize:12, color:globals.colors.grey, marginTop:10}}>Status</Text>

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


                            <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>
                                <TextField
                                    label='Location'
                                    autoCapitalize='none'
                                    value={this.state.location}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ location: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />
                            </View>

                            {/* <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0 }} >
                                <Form>
                                    <Dropdown
                                        label={globals.label_relate_to}
                                        data={this.relateToItems}
                                        value = {this.state.parent_name}
                                        style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                        //onChangeText={(value)=>{this.setState({parent_name:value})}}
                                        onChangeText={(value) => { this.dependancyFunction(value) }}
                                    />
                                </Form>
                            </View>

                            {this.state.show_dropdown &&
                                <View style={{ marginRight: 17, marginLeft: 17, marginTop: 10, paddingBottom: 0 }}>
                                    <Text style={{ color: 'grey' }} >Loading...</Text>
                                </View>
                            }

                            {this.state.show_dropdown_has_value &&
                                <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0 }} >
                                    <Form>
                                        <Dropdown
                                            label={this.state.parent_name}
                                            data={this.state.data_arr_s}
                                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                            onChangeText={(value) => { this.setState({ parent_id: value }) }}
                                        />
                                    </Form>
                                </View>
                            } */}




                        <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 20, paddingBottom: 0 }} >
                            <RelateToView component={this} isRelateToDropdown = {true} />
                        </View>

                        </View>
                    }
                    {/* <PushController /> */}
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
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login, logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(CreateMeetingCalendar);