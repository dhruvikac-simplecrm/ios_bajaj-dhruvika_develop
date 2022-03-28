import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Image,
    AlertIOS,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Spinner, Content, Form, Item, Picker, Input, Label, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login, logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Navigation } from 'react-native-navigation';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import globals from '../../globals';
import { Dropdown } from 'react-native-material-dropdown';
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
const deviceWidth = Dimensions.get("window").width;
import {
    TextField
} from 'react-native-material-textfield';
import ImagePicker from 'react-native-image-crop-picker';// go to https://github.com/ivpusic/react-native-image-crop-picker for more info
import RNGooglePlaces from 'react-native-google-places';

//* this file creates a Lead for a specific Account

//this form data will be sent via the api to upload the profile pic
const createFormData = (photo, type) => {
    const data = new FormData();
    if (photo.path) {
        var path = "file://" + photo.path;
    }

    if (type === 'Gallery') {
        data.append("contents", {
            name: photo.filename,
            type: photo.mime,
            uri: photo.sourceURL//from the gallery you will get this value
            // Platform.OS === "android" ? url : url.replace("file://", "")
        });
    } else if (type === 'Camera') {
        data.append("contents", {
            name: 'lead_profile_pic.jpg',
            type: photo.mime,
            uri: path//from the camera pic you will get this temp path 
            // Platform.OS === "android" ? url : url.replace("file://", "")
        });
    }



    return data;
};


class LeadForAccount extends Component {


    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            lfirst_name: '',
            llast_name: '',
            ldetails: '',
            ltitle: '',
            lmobile_no: '',
            loffice_phone: '',
            lemail: '',
            lstatus: '',
            lcategory: '',
            llead_source: '',
            lcustomer_type: '',
            lstreet: '',
            lcity: '',
            lstate: '',
            lcountry: '',
            lcompany_name: '',
            ldata: '',
            image_url: '',
            from_camera: 0,
            status_list: [],
            photo_json: {},
            address_array: []
        }

        console.log('Lead Id = '+this.props.lead_id);
        //! this condition is not in use, so ignore it
        if (this.props.lead_id != undefined && this.props.lead_id != "" && this.props.token != "") {
            this.getDetails();
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

                this.createLead();


            }
        }
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

    //this will call create api and create a lead 
    //to relate this lead you need to call the relate API once you get the lead response. 
    //see the reponse of this API below
    createLead() {
        let proceed = true;

        if (this.state.lfirst_name === undefined || this.state.lfirst_name == '') {
            proceed = false;
            Alert.alert('Error', 'Please enter first name!');

        } else if (this.state.llast_name === undefined || this.state.llast_name == '') {
            proceed = false;
            Alert.alert('Error', 'Please enter last name!');

        }

        /*for mobile no: Mobile no is not a mandatory field. 
        But if entered then check for the length. If it is less than 10 then show an error message.
        User is not allowed to enter more than 10 digits, So no need to check for the length greater than 10.
        Then check if the entered string is a number or a charcter string. If the input is string then 
        show an error message. Otherwise user is good to go.

        */

        else if (this.state.lmobile_no === undefined || this.state.lmobile_no == '') {
            proceed = false;
            Alert.alert('Error', 'Please enter mobile no.!');

        }




        // else if (this.state.lmobile_no.length > 0 && this.state.lmobile_no.length < 10) {
        //     proceed = false;
        //     Alert.alert('Validation Error', 'Mobile number should not be less than 10 digits');
        // } 
        
        else if (this.state.lmobile_no.length === 10) {
            if (!globals.validateMobile(this.state.lmobile_no)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid Mobile Number');
            }
        }
        // else if(this.state.lmobile_no.length > 10){
        //     proceed = false;
        //     Alert.alert('Validation Error', 'Mobile number should not be more than 10 digits');
        // }
        else if (this.state.loffice_phone.length > 0 && this.state.loffice_phone.length < 10) {
            if (!globals.validateMobile(this.state.loffice_phone)) {
                proceed = false;
                Alert.alert('Validation Error', 'Phone number should not be less than 10 digits');
            }
        } else if (this.state.loffice_phone.length === 10) {
            if (!globals.validateMobile(this.state.loffice_phone)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid Phone Number');
            }
        }
        // else if(this.state.loffice_phone.length > 10){
        //     proceed = false;
        //     Alert.alert('Validation Error', 'Phone number should not be more than 10 digits');
        // }
        else if (this.state.lemail.length > 0) {
            if (!globals.validateEmail(this.state.lemail)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid email id');
            }

        }

        if (proceed) {
            this.disableButton();
            this.setState({ loading: true });
            console.log('create url');

            apiurl = globals.home_url + "/ustore" + "?token_id=" + this.props.token +
                "&module_name=" + globals.leads + "&first_name=" +
                this.state.lfirst_name +
                "&last_name=" +
                this.state.llast_name +
                "&email1=" +
                this.state.lemail +
                "&title=" +
                this.state.ltitle +
                "&phone_mobile=" +
                this.state.lmobile_no +
                "&phone_work=" +
                this.state.loffice_phone +
                "&account_name=" +
                this.state.lcompany_name +
                "&status=" +
                this.state.lstatus +
                "&category_c=" +
                this.state.lcategory +
                "&lead_source=" +
                this.state.llead_source +
                "&lead_customer_type_c=" +
                this.state.lcustomer_type +
                "&primary_address_street=" +
                this.state.lstreet +
                "&primary_address_city=" +
                this.state.lcity +
                "&primary_address_state=" +
                this.state.lstate +
                "&primary_address_country=" +
                this.state.lcountry +
                "&primary_address_postalcode=" +
                this.state.lpostalcode + "&assigned_user_name=" +
                this.props.username + "&assigned_user_id=" +
                this.props.assigned_user_id
                + "&url="+this.props.url;


            console.log(apiurl);

            llead_id = '';
            fetch(apiurl, {
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

                    console.log(' create lead response:');
                    console.log(response);
                    proceed = true;

                    if (response.success === true) {
                        llead_id = response.data.result.id;
                        this.relateLead(llead_id);// this will create a relationship between a lead and an account


                    } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                        Alert.alert(
                            globals.app_messages.error_string,
                            globals.app_messages.token_expired,
                            [
                            { text: globals.login, onPress: () => this.props.logout() }
                                       ],
                            { cancelable: false }
                        )
                    } else {
                        Alert.alert(globals.app_messages.error_string, response.data.description);
                    }

                });

        }



    }


    //this API will relate the lead with the account using the lead id and link field name. Mentioned in the below URL.
    relateLead(id) {

        //related_ids = the id of contact
        //link_field_name = to which you are linking the contact
        //

        let url = globals.home_url + "/setRelationship" + "?token_id=" + this.props.token + "&module_name=" + globals.accounts +
            "&module_id=" + this.props.data.id + "&link_field_name=leads" + "&related_ids=" + id + "&delete=0"
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

                console.log('relate LEAD response:');
                console.log(response);
                proceed = true;
                if (response.success === true) {

                    if (this.state.from_camera === 1) {
                        this.uploadProfilePhotoFromCamera(this.state.photo_json, id, "Camera");
                    }
                    else if (this.state.from_camera === 2) {
                        this.uploadProfilePhotoFromGallery(this.state.photo_json, id, "Gallery");
                    } else if (this.state.from_camera === 0) {
                        this.props.navigator.push({
                            screen: 'app.Details',
                            title:'Lead',
                            passProps: { lead_id: id }, // Object that will be passed as props to the pushed screen (optional)
                            animated: true, // does the push have transition animation or does it happen immediately (optional)
                        });
                    }

                    // this.props.navigator.push({
                    //     screen: 'app.Details',
                    //     passProps: { lead_id: id }, // Object that will be passed as props to the pushed screen (optional)
                    // });
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

    //for edit details
    //! this function is not in use, so feel free to ignore it
    getDetails() {
        console.log('token');
        console.log(this.props.token);
        var data = [];
        var proceed = false;
        console.log(globals.home_url + "/ushow" + "?token_id=" + this.props.token + "&module_name=Leads&fields=id,name,phone_mobile");
        fetch(globals.home_url + "/ushow" + "?token_id=" + this.props.token + "&id=" + this.props.lead_id + "&module_name=Leads&fields=id,first_name,last_name,phone_mobile,email1,title,phone_work,phone_other,status,description,primary_address_street,primary_address_city,primary_address_state,primary_address_postalcode,primary_address_country,lead_source,account_name,assigned_user_name,category_c,lead_customer_type_c"
        + "&url="+this.props.url, {
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

                console.log('Lead Details:');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    if (response.data.result) {
                        console.log('in result');
                        this.setState({ ldata: response.data.result });
                        console.log(this.state.ldata);
                        this.setState({
                            lfirst_name: this.state.ldata.first_name,
                            llast_name: this.state.ldata.last_name,
                            ldetails: this.state.ldata.description,
                            ltitle: this.state.ldata.title,
                            lmobile_no: this.state.ldata.phone_mobile,
                            loffice_phone: this.state.ldata.phone_work,
                            lemail: this.state.ldata.email1,
                            lstatus: this.state.ldata.status,
                            lcategory: this.state.ldata.category_c,
                            llead_source: this.state.ldata.lead_source,
                            lcustomer_type: this.state.ldata.lead_customer_type_c,
                            lstreet: this.state.ldata.primary_address_street,
                            lcity: this.state.ldata.primary_address_city,
                            lstate: this.state.ldata.primary_address_state,
                            lcountry: this.state.ldata.primary_address_country,
                            lcompany_name: this.state.ldata.account_name
                        });
                    }
                }else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    Alert.alert(
                        globals.app_messages.error_string,
                        globals.app_messages.token_expired,
                        [
                        { text: globals.login, onPress: () => this.props.logout() }
                                   ],
                        { cancelable: false }
                    )
                }  else {
                    Alert.alert(globals.error_string, globals.token_expired);
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

    goBack() {
        this.props.navigator.pop({
            animated: true, // does the pop have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }

    onValueChange(value) {

        this.setState({
            status: value
        });
    }

    onCategoryChange(value) {

        this.setState({
            category: value
        });
    }

    onLeadSourceChange(value) {

        this.setState({
            leadSource: value
        });
    }

    onCustomerTypeChange(value) {

        this.setState({
            customerType: value
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
                photo_json: image
            });
            this.setState({
                from_camera: 1
            });
            this.setState({
                image_url: image.data
            });
        });

    }

    fromGallery() {

        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true
        }).then(image => {
            console.log('selected image:');
            console.log(image);
            this.setState({
                photo_json: image
            });
            this.setState({
                from_camera: 2
            })
            this.setState({
                image_url: image.data
            });

            //alert(i + " Images uploaded");

        });
    }


    uploadProfilePhotoFromGallery(photo, id, type) {

        let image_url = globals.home_url + "/setImage"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.leads +
            "&id=" + id +
            "&filename=" + id + "_image.jpg" + "&field=photo"
            + "&url="+this.props.url;

        console.log(image_url);

        fetch(image_url, {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data;'
            },
            body: createFormData(photo, type)
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    this.props.navigator.push({
                        screen: 'app.Details',
                        title:'Lead',
                        passProps: { lead_id: llead_id }, // Object that will be passed as props to the pushed screen (optional)
                        animated: true, // does the push have transition animation or does it happen immediately (optional)
                    });
                    //alert("Profile pic uploaded");
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
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log("upload error", error);
                alert("Upload failed!");

            });
    }

    uploadProfilePhotoFromCamera(photo, id, type) {
        this.setState({ loading: true });
        let image_url = globals.home_url + "/setImage"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.leads +
            "&id=" + id +
            "&filename=" + id + "_image.jpg" + "&field=photo"
            + "&url="+this.props.url;

        console.log(image_url);

        fetch(image_url, {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data;'
            },
            body: createFormData(photo, type)
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    this.props.navigator.push({
                        screen: 'app.Details',
                        title:'Lead',
                        passProps: { lead_id: llead_id }, // Object that will be passed as props to the pushed screen (optional)
                        animated: true, // does the push have transition animation or does it happen immediately (optional)
                    });
                    //alert("Profile pic uploaded");
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
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log("upload error", error);
                alert("Upload failed!");

            });
    }


    //* all these are static dropdown values, saved in the globals.js file
    //status drop down array
    statusdropdown = globals.leadStatusItems;

    //Lead Source drop down array
    leadSourceDropDown = globals.leadSourceItems;

    //lead category drop down array
    leadCategory = globals.leadCategoryItems;

    //leadCustomerType drop down array
    leadCustomerType = globals.leadCustomerTypeItems;

    setAddress(place) {
        this.setState({
            lstreet: place.name
        });
        this.setState({
            address_array: place.addressComponents
        });
        this.state.address_array.forEach(element => {
            console.log(element);
            if (element.types[0] === 'postal_code') {
                this.setState({
                    lpostalcode: element.name
                });
            }

            if (element.types[0] === 'country') {
                this.setState({
                    lcountry: element.name
                });
            }

            if (element.types[0] === 'administrative_area_level_1') {
                this.setState({
                    lstate: element.name
                });
            }

            if (element.types[0] === 'locality') {
                this.setState({
                    lcity: element.name
                });
            }

        });

    }

    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
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
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 0 }} >

                        {/* <Image source={{ uri: 'https://reactnativecode.com/wp-content/uploads/2018/01/2_img.png' }}
                            style={{ width: 80, height: 80, borderRadius: 80 / 2, marginLeft: 15, marginTop: 20 }} /> */}

                            <View>
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
                                            <View>

                                                <Image source={{ uri: `data:${'image/jpeg'};base64,${this.state.image_url}` }}
                                                    style={{ width: 80, height: 80, borderRadius: 80 / 2, marginLeft: 15, marginTop: 20 }} />
                                                <View style={styles.stylecamera}>
                                                    <Icon style={styles.styleIcon} active name="md-camera" md="md-camera" />
                                                </View>
                                            </View>

                                        </TouchableHighlight>
                                    )

}

                            </View>



                        <View style={{ flex: 1, marginTop: 0, marginRight: 10, marginLeft: 10 }} >
                            <TextField
                                label='First Name*'
                                autoCapitalize='none'
                                //! caretHidden = {this.state.isCaretHidden}
                                value={this.state.lfirst_name}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(text) => this.setState({ lfirst_name: text })}
                                textColor='#000'
                                tintColor='red'
                                blurOnSubmit={this.state.isHidden}
                                placeholderTextColor='#000'
                            />

                            <TextField
                                label='Last Name*'
                                autoCapitalize='none'
                                value={this.state.llast_name}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(text) => this.setState({ llast_name: text })}
                                textColor='#000'
                                tintColor='red'
                                blurOnSubmit={true}
                                placeholderTextColor='#000'
                            />

                        </View>


                    </View>

                    <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }} >


                        <TextField
                            label='Details'
                            autoCapitalize='none'
                            value={this.state.ldetails}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ ldetails: text })}
                            textColor='#000'
                            multiline={true}
                            // maxLength={150}
                            // characterRestriction={150}
                            tintColor='red'
                            blurOnSubmit={true}
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Title'
                            autoCapitalize='none'
                            value={this.state.ltitle}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ ltitle: text })}
                            textColor='#000'
                            tintColor='red'
                            blurOnSubmit={true}
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Company Name'
                            autoCapitalize='none'
                            value={this.state.lcompany_name}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ lcompany_name: text })}
                            textColor='#000'
                            tintColor='red'
                            blurOnSubmit={true}
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Mobile No*'
                            autoCapitalize='none'
                            value={this.state.lmobile_no}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ lmobile_no: text })}
                            textColor='#000'
                            maxLength={10}
                            characterRestriction={10}
                            keyboardType='phone-pad'
                            tintColor='red'
                            blurOnSubmit={true}
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Email'
                            autoCapitalize='none'
                            value={this.state.lemail}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ lemail: text })}
                            textColor='#000'
                            tintColor='red'
                            keyboardType='email-address'
                            blurOnSubmit={true}
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Office Phone'
                            autoCapitalize='none'
                            value={this.state.loffice_phone}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ loffice_phone: text })}
                            textColor='#000'
                            maxLength={15}
                            characterRestriction={15}
                            keyboardType='phone-pad'
                            tintColor='red'
                            blurOnSubmit={true}
                            placeholderTextColor='#000'
                        />
                        <TouchableOpacity onPress={this._onPressDropdown}>
                            <Dropdown
                                label='Status'
                                data={this.statusdropdown}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(value) => {
                                    this.setState({ lstatus: value });
                                    this.setState({ isCaretHidden: true });
                                }}
                                value={(this.state.ldata == '') ? this.state.lstatus : this.state.ldata.status}
                            />
                        </TouchableOpacity>

                        <Dropdown
                            label='Category'
                            data={this.leadCategory}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(value) => { this.setState({ lcategory: value }) }}
                            value={(this.state.ldata == '') ? this.state.lcategory : this.state.ldata.category_c}
                        />
                        <Dropdown
                            label='Lead Source'
                            data={this.leadSourceDropDown}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(value) => { this.setState({ llead_source: value }) }}
                            value={(this.state.ldata == '') ? this.state.llead_source : this.state.ldata.lead_source}
                        />
                        <Dropdown
                            label='Customer Type'
                            data={this.leadCustomerType}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(value) => { this.setState({ lcustomer_type: value }) }}
                            value={(this.state.ldata == '') ? this.state.lcustomer_type : this.state.ldata.lead_customer_type_c}
                        />

                    </View>


                    {/* address fields */}
                    <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }} >

                        <View style={{flex:1, flexDirection: 'column', justifyContent: "flex-end" }}>
                           <View style={{width:"90%", flex:0.9}}>
                            <TextField
                                label='Street'
                                autoCapitalize='none'
                                value={this.state.lstreet}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(text) => this.setState({ lstreet: text })}
                                textColor='#000'
                                blurOnSubmit={true}
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
                            value={this.state.lcity}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ lcity: text })}
                            textColor='#000'
                            blurOnSubmit={true}
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='State'
                            autoCapitalize='none'
                            value={this.state.lstate}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ lstate: text })}
                            textColor='#000'
                            blurOnSubmit={true}
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Postal Code'
                            autoCapitalize='none'
                            value={this.state.lpostalcode}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ lpostalcode: text })}
                            textColor='#000'
                            blurOnSubmit={true}
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Country'
                            autoCapitalize='none'
                            value={this.state.lcountry}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ lcountry: text })}
                            textColor='#000'
                            blurOnSubmit={true}
                            tintColor='red'
                            placeholderTextColor='#000'
                        />


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
        token: state.auth.token,
        username: state.auth.username,
        assigned_user_id: state.auth.assigned_user_id,
        url: state.auth.url,

    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login, logout }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(LeadForAccount);