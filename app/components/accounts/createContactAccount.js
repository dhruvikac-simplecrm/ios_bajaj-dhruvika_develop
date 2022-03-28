import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Image,
    Dimensions,
    StatusBar,
    AlertIOS,
    TouchableHighlight, TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Content, Form, Item, Picker, Input, Label, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Spinner } from 'native-base';
import { login , logout} from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Navigation } from 'react-native-navigation';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import globals from '../../globals';
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
import { Dropdown } from 'react-native-material-dropdown';
import {
    TextField
} from 'react-native-material-textfield';
import RNGooglePlaces from 'react-native-google-places';

//* this file creates a contact related to a specific account
class ContactForAccount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            disable: false,
            assigned_user_id: '',
            username: '',
            submitLoading: true,
            password: '',
            accountName: '',
            first_name: '',
            last_name: '',
            title: '',
            account_name: this.props.data.name,
            account_id: this.props.data.id,
            phone_mobile: '',
            email1: '',
            description: '',
            phone_work: '',
            primary_address_street: '',
            primary_address_city: '',
            primary_address_state: '',
            primary_address_postalcode: '',
            primary_address_country: '',
            address_array: []
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
                // this.props.navigator.push({
                //     screen: 'app.ContactDetails'
                // });

                this.save();
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
            accountName: value
        });
    }


    //disable the save button if clicked once to save the record, just to avoid clicking it multiple times to save the record
    disableButton() {
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

    //this function will create a contact. To relate this contact to an account you need to call another api
    //The relate api is called once the contact is created. See the reponse code
    save() {
        let proceed = true;
        let contact_id = '';

        if (this.state.last_name == '' || this.state.last_name == null || this.state.last_name == ' ' || this.state.last_name == undefined) {
            proceed = false;
            Alert.alert('Validation Error', 'Please enter last name!');
        } 
        
        // else if (this.state.phone_mobile.length > 0 && this.state.phone_mobile.length < 10) {

        //     proceed = false;
        //     Alert.alert('Validation Error', 'Mobile number should not be less than 10 digits');

        // } 
        
        else if (this.state.phone_mobile.length == 10) {
            if (!globals.validateMobile(this.state.phone_mobile)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid Mobile Number');
            }
        } else if (this.state.phone_mobile.length > 10) {
            proceed = false;
            Alert.alert('Validation Error', 'Mobile number should not be more than 10 digits');
        } 
        
        // else if (this.state.phone_work.length > 0 && this.state.phone_work.length < 10) {
        //     if (!globals.validateMobile(this.state.phone_work)) {
        //         proceed = false;
        //         Alert.alert('Validation Error', 'Phone number should not be less than 10 digits');
        //     }

        // } 
        
        else if (this.state.phone_work.length == 10) {
            if (!globals.validateMobile(this.state.phone_work)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid Phone Number');
            }
        } else if (this.state.phone_work.length > 10) {
            proceed = false;
            Alert.alert('Validation Error', 'Phone number should not be more than 10 digits');
        } else if (this.state.email1.length > 0) {
            if (!globals.validateEmail(this.state.email1)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid email id');
            }
        }

        //let mobile_number = this.state.phone_mobile;


        if (proceed) {
            this.disableButton();
            var data = [];
            this.setState({ loading: true });
            this.setState({ disable: true });

            let url = globals.home_url + "/ustore" + "?token_id=" + this.props.token + "&module_name=" + globals.contacts +
                "&first_name=" + this.state.first_name + "&last_name=" + this.state.last_name + "&title=" + this.state.title +
                "&account_id=" + this.state.account_id + "&phone_mobile=" + this.state.phone_mobile + "&email1=" + this.state.email1 +
                "&description=" + this.state.description + "&phone_work=" + this.state.phone_work + "&primary_street_address=" + this.state.primary_address_street +
                "&primary_address_city=" + this.state.primary_address_city + "&primary_address_state=" + this.state.primary_address_state +
                "&primary_address_postalcode=" + this.state.primary_address_postalcode + "&primary_address_country=" + this.state.primary_address_country
                + "&assigned_user_name=" +
                this.props.username + "&assigned_user_id=" +
                this.props.assigned_user_id
                + "&url="+this.props.url;

            console.log('contact url');
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
                        contact_id = response.data.result.id;
                        this.relateContact(contact_id);//this function is responsible to relate contact with an account

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
                // .then(() => {

                //     this.setState({ loading: false });
                //     this.setState({ disable: false });
                //     // console.log(this.state.booking_nums);
                // })

                .catch(err => {
                    console.log(err);
                    this.setState({ loading: false });
                    Alert.alert('Error', 'Oops! Something went wrong, please try again.');
                });

        }


    }

    //this API call will relate the created contact with the account

    relateContact(id) {

        //related_ids = the id of contact
        //link_field_name = to which you are linking the contact
        //

        let url = globals.home_url + "/setRelationship" + "?token_id=" + this.props.token + "&module_name=" + globals.accounts +
            "&module_id=" + this.props.data.id + "&link_field_name=contacts" + "&related_ids=" + id + "&delete=0"
            + "&url="+this.props.url;

        console.log('Relate task url');
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

                console.log('relate CONTACT response:');
                console.log(response);
                proceed = true;
                if (response.success === true) {

                    this.props.navigator.push({
                        screen: 'app.ContactDetails',
                        passProps: { contact_id: id }, // Object that will be passed as props to the pushed screen (optional)
                    });
                }else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
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
                Alert.alert('Error', 'Oops! Something went wrong, please try again.');
            });

    }

    //status drop down array
    accountnamedropdown = globals.contactAccountItems;

    setAddress(place) {

        this.setState({
            primary_address_street: place.name
        });
        this.setState({
            address_array: place.addressComponents
        });
        this.state.address_array.forEach(element => {
            console.log(element);
            if (element.types[0] === 'postal_code') {
                this.setState({
                    primary_address_postalcode: element.name
                });
            }

            if (element.types[0] === 'country') {
                this.setState({
                    primary_address_country: element.name
                });
            }

            if (element.types[0] === 'administrative_area_level_1') {
                this.setState({
                    primary_address_state: element.name
                });
            }

            if (element.types[0] === 'locality') {
                this.setState({
                    primary_address_city: element.name
                });
            }

        });

    }

    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                console.log(place);
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
                this.setAddress(place);
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
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
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 0 }} >

                                <Image source={{ uri: 'https://reactnativecode.com/wp-content/uploads/2018/01/2_img.png' }}
                                    style={{ width: 80, height: 80, borderRadius: 80 / 2, marginLeft: 15, marginTop: 20 }} />

                                <View style={{ flex: 1, marginTop: 0, marginRight: 10, marginLeft: 10 }} >

                                    <TextField
                                        label='First Name'
                                        autoCapitalize='none'
                                        value={this.state.first_name}
                                        style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                        onChangeText={(text) => this.setState({ first_name: text })}
                                        textColor='#000'
                                        tintColor='red'
                                        placeholderTextColor='#000'
                                    />

                                    <TextField
                                        label='Last Name*'
                                        autoCapitalize='none'
                                        value={this.state.last_name}
                                        style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                        onChangeText={(text) => this.setState({ last_name: text })}
                                        textColor='#000'
                                        tintColor='red'
                                        placeholderTextColor='#000'
                                    />


                                </View>


                            </View>

                            <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }} >

                                <TextField
                                    label='Title'
                                    autoCapitalize='none'
                                    value={this.state.title}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ title: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Account Name'
                                    autoCapitalize='none'
                                    editable={false}
                                    value={this.state.account_name}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    // onChangeText={(text) => this.setState({ accountName: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />

                                {/* <Dropdown
                                    label='Account Name'
                                    data={this.state.data_arr_s}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value) => { this.setState({ accountName: value }) }}
                                    value={this.state.accountName}
                                /> */}

                                <TextField
                                    label='Mobile No'
                                    autoCapitalize='none'
                                    value={this.state.phone_mobile}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ phone_mobile: text })}
                                    textColor='#000'
                                    maxLength={10}
                                    characterRestriction={10}
                                    keyboardType='phone-pad'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Email'
                                    autoCapitalize='none'
                                    value={this.state.email1}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ email1: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    keyboardType='email-address'
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Details'
                                    autoCapitalize='none'
                                    value={this.state.description}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ description: text })}
                                    textColor='#000'
                                    multiline={true}
                                    // maxLength={150}
                                    // characterRestriction={10}
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />
                                <TextField
                                    label='Office Phone'
                                    autoCapitalize='none'
                                    value={this.state.phone_work}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ phone_work: text })}
                                    textColor='#000'
                                    maxLength={15}
                                    characterRestriction={15}
                                    keyboardType='phone-pad'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />
                                <View style={{flex:1, flexDirection: 'column', justifyContent: "flex-end" }}>
                                  
                                  <View style = {{width:"90%", flex:0.9}}>
                                    <TextField
                                        label='Street'
                                        autoCapitalize='none'
                                        value={this.state.primary_address_street}
                                        style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                        onChangeText={(text) => this.setState({ primary_address_street: text })}
                                        textColor='#000'
                                        tintColor='red'
                                        placeholderTextColor='#000'
                                    />
</View>

<TouchableOpacity onPress={() => this.openSearchModal()} style={{ alignContent: "center", alignItems: "center", width: 30, height: 30, marginTop: -40, flex: 0.1, alignSelf: 'flex-end', borderRadius: 5, borderWidth: 0.5, borderColor: "grey" }}>

<FontAwesome style={{
    color: '#0080FF',
    fontSize: 20,
    position: 'absolute',
    alignSelf: "center",
    top: 5,
}} >
    {Icons.search}
</FontAwesome>

</TouchableOpacity>
                                    {/* <TouchableHighlight onPress={() => this.openSearchModal()} style={{ alignSelf: 'flex-end' }}>

                                        <FontAwesome style={{
                                            color: '#0080FF',
                                            fontSize: 20,
                                            position: 'absolute',
                                            top: -40,
                                            right: 10

                                        }} >
                                            {Icons.search}
                                        </FontAwesome>

                                    </TouchableHighlight> */}


                                </View>




                                <TextField
                                    label='City'
                                    autoCapitalize='none'
                                    value={this.state.primary_address_city}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ primary_address_city: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='State'
                                    autoCapitalize='none'
                                    value={this.state.primary_address_state}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ primary_address_state: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Postal Code'
                                    autoCapitalize='none'
                                    value={this.state.primary_address_postalcode}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ primary_address_postalcode: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Country'
                                    autoCapitalize='none'
                                    value={this.state.primary_address_country}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ primary_address_country: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />
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
        assigned_user_id: state.auth.assigned_user_id,
        url: state.auth.url,

    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login , logout}, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(ContactForAccount);