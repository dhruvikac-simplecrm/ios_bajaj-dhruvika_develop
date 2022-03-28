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

import {  Container, Header, Title, Content, Form, Item, Input, Label, Picker, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Spinner } from 'native-base';
import { login, logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Navigation } from 'react-native-navigation';
import FontAwesome, { Icons } from 'react-native-fontawesome';
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
import {
    TextField
} from 'react-native-material-textfield';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-material-dropdown';
import globals from '../../globals';

//* this file create an opportunity for a specific Account. 
//* Using create opportunity api and relate to account API

class OpportunityForAccount extends Component {


    constructor(props) {
        super(props);

        const curr = new Date().toISOString().split('T')[0];

        this.state = {
            loading: false,
            disable: false,
            username: '',
            password: '',
            salesStage: 'Prospecting',
            next_step: '',
            name: '',
            date: curr,
            amount: '',
            details: '',
            submitLoading: true,
            accountName: this.props.data.name,
            account_id: this.props.data.id,
            type: ''
        }

        this.props.navigator.setButtons({
            rightButtons: [
                {

                    id: 'save', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
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



        this.props.navigator.setDrawerEnabled({
            side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
            enabled: true // should the drawer be enabled or disabled (locked closed)
        });
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.type == 'NavBarButtonPress') {
            // this is the event type for button presses
            if (event.id == 'save') { // this is the same id field from the static navigatorButtons definition
                //AlertIOS.alert('SalesMobi', 'You pressed search button');
                this.createOpportunity();
            }
        }
    }

    onSalesStageChange(value) {

        this.setState({
            salesStage: value
        });
    }

    onAccountChange(value) {
        this.setState({

            accountName: value

        });
    }

    onTypeChange(value) {

        this.setState({
            type: value
        });

    }

    //disable the save button once clicked to avoid duplicate record creation

    disableButton(){
        this.props.navigator.setButtons({
            rightButtons: [
                {

                    id: 'save', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
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

    //these dropdown values are static and saved in the globals.js file

    salesStageItems = globals.salesStageItems;
    typeItems = globals.businessTypeItems;

    //create opportunity using this function. This function will only create an opportunity record.
    // to relate this created opportunity you have to call another API ie relate API
    // see the response of this api the function is written there.
    createOpportunity(){

        let proceed = true;
        let opportunity_id = '';

        if (this.state.name == '' || this.state.name == null || this.state.name == ' ' || this.state.name == undefined) {
            proceed = false;
            Alert.alert('Validation Error','Opportunity Name is required!');
        }else if (this.state.amount == '' || this.state.amount == null || this.state.amount == ' ' || this.state.amount == undefined) {
            Alert.alert('Validation Error','Opportunity Amount is required!');   
            proceed = false;
        }else if(!globals.validateAmount(this.state.amount)){
            Alert.alert('Validation Error','Please enter a valid amount');   
            proceed = false;
        } else if (this.state.date == '' || this.state.date == null || this.state.date == ' ' || this.state.date == undefined) {
            Alert.alert('Validation Error','Expected Close Date is required!');   
            proceed = false;
        }

        if (proceed) {
            this.disableButton();
            var data = [];
            this.setState({ loading: true });
            this.setState({ disable: true });

            let url = globals.home_url+"/ustore"+"?token_id="+ this.props.token +"&module_name="+ globals.opportunity + 
            "&name=" + this.state.name +"&date_closed="+ this.state.date + "&amount="+ this.state.amount+"&description="+ this.state.details + "&sales_stage="+ this.state.salesStage + "&next_step="+ this.state.next_step +
            "&account_id=" + this.state.account_id + "&opportunity_type="+ this.state.type +
             "&assigned_user_name="+this.props.username + "&assigned_user_id="+
             this.props.assigned_user_id
             + "&url="+this.props.url;

             console.log('Opportunity url');
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

                console.log(' create contact response:');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    opportunity_id = response.data.result.id;
                    this.relateOpportunity(opportunity_id);// this will relate the opportunity to a specific account
                   
                }else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    Alert.alert(
                        globals.app_messages.error_string,
                        globals.app_messages.token_expired,
                        [
                        { text: globals.login, onPress: () => this.props.logout() }
                                   ],
                        { cancelable: false }
                    )
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
                 Alert.alert('Error','Oops! Something went wrong, please try again.');
            });
        }


    }

    //function responsible for the linking between opportunity and account.
    relateOpportunity(id){

        //related_ids = the id of contact
        //link_field_name = to which you are linking the contact
        //

        let url = globals.home_url+"/setRelationship"+"?token_id="+ this.props.token +"&module_name="+ globals.accounts + 
        "&module_id=" + this.props.data.id +"&link_field_name=opportunities"
         + "&related_ids="+ id+"&delete=0"
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

            console.log('relate Opportunity response:');
            console.log(response);
            proceed = true;
            if (response.success === true) {

                this.props.navigator.push({
                    screen: 'app.OpportunityDetails',
                    passProps: {opportunity_id: id}, // Object that will be passed as props to the pushed screen (optional)
                });
            }else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                Alert.alert(
                    globals.app_messages.error_string,
                    globals.app_messages.token_expired,
                    [
                    { text: globals.login, onPress: () => this.props.logout() }
                               ],
                    { cancelable: false }
                )
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
             Alert.alert('Error','Oops! Something went wrong, please try again.');
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
                                label='Opportunity Name*'
                                autoCapitalize='none'
                                value={this.state.name}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(text) => this.setState({ name: text })}
                                textColor='#000'
                                tintColor='red'
                                placeholderTextColor='#000'
                            />
                        </View>

                       
                       

                        <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', marginRight: 0, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>
                            <View style={{ flex: 0.9 }} >
                                <TextField
                                    label='Expected Close Date*'
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
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    onDateChange={(date) => { this.setState({ date: date }) }}
                                />
                            </View>
                        </View>

                        <Form>

                        <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>
                            <TextField
                                label='Opportunity Amount*'
                                autoCapitalize='none'
                                value={this.state.amount}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(text) => this.setState({ amount: text })}
                                textColor='#000'
                                tintColor='red'
                                placeholderTextColor='#000'
                            />
                        </View>

                        <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>
                            <TextField
                                label='Details'
                                autoCapitalize='none'
                                value={this.state.details}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(text) => this.setState({ details: text })}
                                textColor='#000'
                                multiline={true}
                                // maxLength={150}
                                // characterRestriction={150}
                                tintColor='red'
                                placeholderTextColor='#000'
                            />
                        </View>


                        {/* this is a dropdown */}
                        <View style={{  marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0}} >
                        <Form>
                            <Dropdown
                                label='Sales Stage'
                                data={this.salesStageItems}
                                value={this.state.salesStage}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(value)=>{this.setState({salesStage:value})}}

                            />
                        </Form>
                    </View>


                        {/* <Picker
                            mode="dialog"
                            iosHeader="Sales Stage"
                            placeholder="Sales Stage"
                            data = {this.salesStageItems}
                            style={{ width: deviceWidth }}
                            selectedValue={this.state.salesStage}
                            onValueChange={this.onSalesStageChange.bind(this)}
                        />
 */}

                        <View style={{ marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0, }}>
                            <TextField
                                label='Next Step'
                                autoCapitalize='none'
                                value={this.state.next_step}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(text) => this.setState({ next_step: text })}
                                textColor='#000'
                                tintColor='red'
                                placeholderTextColor='#000'
                            />
                        </View>

                        <View style={{  marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0}} >

                        <TextField
                                label='Account Name'
                                autoCapitalize='none'
                                value={this.state.accountName}
                                editable = {false}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(text) => this.setState({ accountName: text })}
                                textColor='#000'
                                tintColor='red'
                                placeholderTextColor='#000'
                            />

                    </View>

                    <View style={{  marginRight: 17, marginLeft: 17, marginBottom: 0, paddingBottom: 0}} >
                        <Form>
                            <Dropdown
                                label='Type'
                                data= {this.typeItems}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(value)=>{this.setState({type:value})}}

                            />
                        </Form>
                    </View>


                        </Form>


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
        assigned_user_id: state.auth.assigned_user_id,
        url: state.auth.url,

    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login, logout }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(OpportunityForAccount);