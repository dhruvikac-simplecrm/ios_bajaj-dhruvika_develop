import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Image,
    Dimensions,
    StatusBar,
    ActionSheetIOS,
    TouchableHighlight,
    AlertIOS
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Content, Form, Item, Picker, Input, Label, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Spinner } from 'native-base';
import { login, logout } from '../../actions/auth';
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
import ImagePicker from 'react-native-image-crop-picker';
import RNGooglePlaces from 'react-native-google-places';
class ConvertToContact extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            disable: false,
            assigned_user_id: '',
            username: '',
            submitLoading: true,
            password: '',
            accountName: undefined,
            first_name: this.props.data.name.substring(0, this.props.data.name.lastIndexOf(" ") + 1),
            last_name: this.props.data.name.substring(this.props.data.name.lastIndexOf(" ") + 1, this.props.data.name.length),
            title: this.props.data.title,
            account_name: this.props.account_name,
            account_id: this.props.account_id,
            phone_mobile: this.props.data.phone_mobile,
            email1: this.props.data.email1,
            description: this.props.data.description,
            phone_work: this.props.data.phone_work,
            primary_address_street: this.props.data.primary_address_street,
            primary_address_city: this.props.data.primary_address_city,
            primary_address_state: this.props.data.primary_address_state,
            primary_address_postalcode: this.props.data.primary_address_postalcode,
            primary_address_country: this.props.data.primary_address_country,
            data_arr_s: [],
            address_array: []
        }

        console.log('lead info');
        console.log(this.props.data);
        console.log(this.props.convertOpportunity);



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

    showImageOption() {

        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', 'Open Camera', 'Select from Gallery'],

            cancelButtonIndex: 0,
        },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    this.openCamera();
                }

                if (buttonIndex === 2) {
                    this.fromGallery();
                }


            });

    }

    openCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            writeTempFile: true,
            cropping: true,
            includeBase64: true,
        }).then(image => {
            console.log(image);
            this.setState({
                from_camera: true
            })
            this.setState({
                image_url: image.data
            });
        });

    }

    fromGallery() {

        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log('selected image:');
            console.log(image);
            this.setState({
                from_camera: false
            })
            this.setState({
                image_url: image.sourceURL
            });

            //alert(i + " Images uploaded");

        });
    }



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
        
        else if (this.state.phone_work.length == 15) {
            if (!globals.validateMobile(this.state.phone_work)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid Phone Number');
            }
        } else if (this.state.phone_work.length > 15) {
            proceed = false;
            Alert.alert('Validation Error', 'Phone number should not be more than 15 digits');
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
                        this.relateContact(contact_id)

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

    componentDidMount() {
        this.accounts();
    }

    accounts() {
        this.setState({ loading: true });
        this.setState({ disable: true });

        let url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
            "&module_name=Accounts" +
            "&next_offset=0" + "&search_text=" + '' +
            "&search_fields=" + "&fields=id,name"
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
                console.log('Account response');
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

                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    Alert.alert(
                        globals.app_messages.error_string,
                        globals.app_messages.token_expired,
                        [
                        { text: globals.login, onPress: () => this.props.logout() }
                                   ],
                        { cancelable: false }
                    )
                } else {
                    console.error('Error');
                }

            })
            .then(() => {

                this.setState({ loading: false });
                this.setState({ disable: false });
                // console.log(this.state.booking_nums);
            })
            .catch((error) => {
                this.setState({ loading: false });
                console.error(error);
            });
    }

    saveContactOrCreateOpportunity() {

        //if the value is true then take the user to convert to opportunity screen and 
        //create opportunity, once the oppotunity is created then go to the Leads detail view.
        //if the value is false then create a contact and take the user to the Leads detail view and update the status to converted
        if (this.props.convertOpportunity) {
            this.props.navigator.push({
                screen: 'app.ConvertToOpportunity',
                title: 'Convert to Opportunity',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { data: this.props.data, account_id: this.props.account_id, account_name: this.props.account_name }, // Object that will be passed as props to the pushed screen (optional)
                animated: true, // does the push have transition animation or does it happen immediately (optional)
                animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                backButtonTitle: 'Back', // override the back button title (optional)
                backButtonHidden: true, // hide the back button altogether (optional)
                navigatorStyle: {
                    navBarBackgroundColor: 'white',
                    navBarTextColor: '#0067ff',
                    navBarButtonColor: '#0067ff'
                } // override the navigator style for the pushed screen (optional)
            });

        } else {
            this.props.navigator.push({
                screen: 'app.Details',
                title: 'Lead',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { lead_id: this.props.data.id }, // Object that will be passed as props to the pushed screen (optional)
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

    }

    checkOpportunityIsTrue() {

        //here we check if opportunity is true 
        //if it is true then show the dialog that contact created successfully and redirect to create opportunity
        //if it is false then call update lead status api and then redirect the user to leads detail view


        if (this.props.convertOpportunity) {

            this.showDialog();

        } else {
            //call lead status api
            this.updateLeadStatus();
        }

    }

    updateLeadStatus() {
        let url = globals.home_url + "/uupdate" + "?token_id=" + this.props.token +
            "&module_name=" + globals.leads +
            "&id=" + this.props.data.id +
            "&status=Converted"
            + "&url="+this.props.url;

        console.log('lead status url');
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

                console.log('lead status response');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    //update the lead status here to converted
                    this.showDialog();
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    Alert.alert(
                        globals.app_messages.error_string,
                        globals.app_messages.token_expired,
                        [
                        { text: globals.login, onPress: () => this.props.logout() }
                                   ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert('Error', response.data.description);
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

    showDialog() {

        //check if convert to opportunity is true here if yes then go to convert to opportunity 
        //or update the lead status to converted and then take user to the detail view

        this.saveContactOrCreateOpportunity()

        // AlertIOS.alert(globals.app_name, globals.app_messages.contact_create_message,

        //     [
        //         {
        //             text: 'OK',
        //             onPress: () => 
        //         }
        //     ]

        // );

    }

    relateContact(id) {

        //related_ids = the id of contact
        //link_field_name = to which you are linking the contact
        //

        let url = globals.home_url + "/setRelationship" + "?token_id=" + this.props.token + "&module_name=" + globals.leads +
            "&module_id=" + this.props.data.id + "&link_field_name=contacts" + "&related_ids=" + id 
            + "&delete=0" 
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
                    //update the lead status here to converted
                    this.checkOpportunityIsTrue();

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


                    {this.state.loading === false && this.state.submitLoading &&
                        <View>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 0 }} >

                                {/* <Image source={{ uri: 'https://reactnativecode.com/wp-content/uploads/2018/01/2_img.png' }}
                                    style={{ width: 80, height: 80, borderRadius: 80 / 2, marginLeft: 15, marginTop: 20 }} /> */}

                                //* this view tag contains the image attachment logic
                                <View>

                                    {/* <Image source={
                            require('../../../images/placeholder.png')
                        }
                            style={{ width: 80, height: 80, borderRadius: 80 / 2, marginLeft: 15, marginTop: 20 }} /> */}

                                    {/* from here */}
                                    {
                                        (this.state.image_url === undefined || this.state.image_url === '')
                                            ?
                                            (
                                                <TouchableHighlight onPress={() => this.showImageOption()} underlayColor="transparent">

                                                    <View>

                                                        <Image source={
                                                            require('../../../images/placeholder.png')
                                                        }
                                                            style={{ width: 80, height: 80, borderRadius: 80 / 2, marginLeft: 15, marginTop: 20 }} />

                                                        <View style={styles.stylecamera}>
                                                            <Icon style={styles.styleIcon} active name="md-camera" md="md-camera" />
                                                        </View>

                                                    </View>



                                                </TouchableHighlight>
                                            ) :
                                            (
                                                <TouchableHighlight onPress={() => this.showImageOption()} underlayColor="transparent">
                                                    {(this.state.from_camera)
                                                        ?
                                                        (
                                                            <View>
                                                                <Image source={{ uri: `data:${'image/jpeg'};base64,${this.state.image_url}` }}
                                                                    style={{ width: 80, height: 80, borderRadius: 80 / 2, marginLeft: 15, marginTop: 20 }} />

                                                                <View style={styles.stylecamera}>
                                                                    <Icon style={styles.styleIcon} active name="md-camera" md="md-camera" />
                                                                </View>
                                                            </View>


                                                        ) :
                                                        (
                                                            <View>
                                                                <Image source={{ uri: this.state.image_url }}
                                                                    style={{ width: 80, height: 80, borderRadius: 80 / 2, marginLeft: 15, marginTop: 20 }} />

                                                                <View style={styles.stylecamera}>
                                                                    <Icon style={styles.styleIcon} active name="md-camera" md="md-camera" />
                                                                </View>
                                                            </View>


                                                        )

                                                    }


                                                </TouchableHighlight>
                                            )
                                    }
                                    {/* till here */}
                                    {/* <TouchableHighlight onPress={() => this.showImageOption()} underlayColor="transparent">
                                        <Text style={{ color: globals.colors.blue_default, textAlign: 'center', marginLeft: 10, marginTop: 5 }}>Add</Text>
                                    </TouchableHighlight> */}

                                </View>

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

                                <Dropdown
                                    label='Account Name'
                                    data={this.state.data_arr_s}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value) => { this.setState({ account_name: value }) }}
                                    value={this.state.account_name}
                                />

                                <TextField
                                    label='Mobile No'
                                    autoCapitalize='none'
                                    value={this.state.phone_mobile}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ phone_mobile: text })}
                                    textColor='#000'
                                    maxLength={10}
                                    keyboardType='phone-pad'
                                    characterRestriction={10}
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
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Details'
                                    autoCapitalize='none'
                                    value={this.state.description}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ description: text })}
                                    textColor='#000'
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
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />

                                <View style={{ flexDirection: 'column', justifyContent: "flex-end" }}>
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

                                    <TouchableHighlight onPress={() => this.openSearchModal()} style={{ alignSelf: 'flex-end' }}>

                                        <FontAwesome style={{
                                            color: '#0080FF',
                                            fontSize: 20,
                                            position: 'absolute',
                                            top: -40,
                                            right: 10

                                        }} >
                                            {Icons.search}
                                        </FontAwesome>

                                    </TouchableHighlight>


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
    return bindActionCreators({ login, logout }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(ConvertToContact);