import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Dimensions,
    StatusBar,
    Image,
    AlertIOS,
    TouchableHighlight,
    Keyboard,
    ActionSheetIOS,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Spinner, Content, Form, Item, Picker, Input, Label, Button, Left, Right, Body, Icon, Text, Separator } from 'native-base';
import { login, logout, updateToken } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Navigation } from 'react-native-navigation';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import globals from '../../globals';
import { Dropdown } from 'react-native-material-dropdown';//go to https://github.com/n4kz/react-native-material-dropdown#readme for more info
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
import {
    TextField
} from 'react-native-material-textfield';// go to https://github.com/n4kz/react-native-material-textfield for more info
import ImagePicker from 'react-native-image-crop-picker';// go to https://github.com/ivpusic/react-native-image-crop-picker for more info
const deviceWidth = Dimensions.get("window").width;
import RNGooglePlaces from 'react-native-google-places';
import DropDown from '../DropDown';
import consts from '../../consts';
import DatePicker from 'react-native-datepicker'
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import MultiSelectBox from './multiSelectBox';

import ExpandableView from './ExpandableView';
import ExpandableViewAddress from './ExpandableViewAddress';
import ExpandableViewRmAllocation from './ExpandableViewRmAllocation';

import MultiPickerMaterialDialog from '../custom/multiPickerMaterialDialog';
import apiCallForToken from '../../controller/ApiCallForToken';

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


const createFormDataVisitingCard = (photo, type) => {
    const data = new FormData();
    if (photo.path) {
        var path = "file://" + photo.path;
    }

    if (type === 'Gallery') {
        data.append("file", {
            name: photo.filename,
            type: photo.mime,
            uri: photo.sourceURL//from the gallery you will get this value
            // Platform.OS === "android" ? url : url.replace("file://", "")
        });
    } else if (type === 'Camera') {
        data.append("file", {
            name: 'visiting_card.jpg',
            type: photo.mime,
            uri: path//from the camera pic you will get this temp path 
            // Platform.OS === "android" ? url : url.replace("file://", "")
        });

    }

    return data;
};

class Create extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            disable: false,

            ldetails: '',
            ltitle: '',
            loffice_phone: '',
            lstatus: '',
            lcategory: '',
            lcustomer_type: '',
            lstreet: '',
            lcity: '',
            lstate: '',
            lcountry: '',
            lpostalcode: '',
            lcompany_name: '',
            ldata: '',
            isHidden: true,
            image_url: '',
            from_camera: 0,
            status_list: [],
            photo_json: {},
            address_array: [],
            name: "some text",
            textFieldName: null,

            visitingCard: '',
            fullAddress: '',
            cardReading: false,

            currentLatitude: '0.00', //lead location 
            currentLongitude: '0.00',


            //Required fields for this proj

            first_name: '',
            last_name: '',
            phone_mobile: '',
            lead_source: '',
            email: '',

            //new fields
            salutation: '',
            middle_name_c: '',
            phone_other: '',
            interested_product_c: '',
            designation_c: '',
            retirement_date_c: '',
            age_in_number_c: '',
            phone_home: '',
            mode_of_lead_c: '',
            lead_type_c: '',
            service_type_c: '',
            users_leads_2_name: '',
            users_leads_2users_ida: '',
            occupation_type_c: '',

            //Campaign details
            organization_c: '',
            campaign_name: '',
            campaign_id:'',

            //address
            address_1__c: '',
            address_2__c: '',
            state_c: '',
            city_c: '',
            postal_code_c: '',

            //RM Allocation
            disposition_category_c: 'Open',
            dispositions_c: 'Open',
            client_category_c: '',
            prefered_date_time_date: '',
            appointment_date_time_date: '',
            remarks_c: '',
            meeting_done_c: '',
            who_cancelled_c: '',
            lost_reason_c: '',


            //Dynamic Dropdowns
            salutationList: [],
            lead_sourceList: [],
            statusList: [],
            interested_product_cList: [],
            product_sub_category_cList: [],

            // productSubCatgSelected: '',
            productSubCatgSelected: [],

            disposition_category_cList: [],
            dispositions_cList: [],
            occupation_type_cList: [],
            statesList: [],
            city_cList: [],
            postal_code_cList: [],

            meeting_done_cList: [],
            who_cancelled_cList: [],
            lost_reason_cList: [],

            campaignVisibility: false,
            addressVisibility: false,
            rmAllocationVisibility: false,

            isPSCVisible: false,
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
                },
                // {
                //     id: 'captureLead', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                //     testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                //     disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                //     // disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                //     buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                //     buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                //     buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                //     systemItem: 'camera'
                // }

            ], // see "Adding buttons to the navigator" below for format (optional)


            animated: true // does the change have transition animation or does it happen immediately (optional)
        });

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));//to add click event onto the buttons defined

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
                this.save();
            }
            if (event.id == 'captureLead') {
                this.captureLeadData()
            }
        }
    }

    disableSaveButton(isEnable) {
        this.props.navigator.setButtons({
            rightButtons: [
                {
                    id: 'save', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                    disabled: isEnable, // optional, used to disable the button (appears faded and doesn't interact)
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

    save() {
        let proceed = true;
        if (this.state.last_name === undefined || this.state.last_name == '') {
            proceed = false;
            Alert.alert('Error', 'Please enter last name!');
        } else if (this.state.phone_mobile === undefined || this.state.phone_mobile == '') {
            proceed = false;
            Alert.alert('Error', 'Please enter phone number.!');
        } else if (this.state.email != undefined && this.state.email.length > 0) {
            if (!globals.validateEmail(this.state.email)) {
                proceed = false;
                Alert.alert('Error', 'Invalid email id');
            }
        } else if (this.state.interested_product_c === undefined || this.state.interested_product_c == '') {
            proceed = false;
            Alert.alert('Error', 'Please select interested product!');
        } else if (this.state.state_c === undefined || this.state.state_c == '') {
            proceed = false;
            Alert.alert('Error', 'Please select State from Address Information panel!');
        } else if (this.state.city_c === undefined || this.state.city_c == '') {
            proceed = false;
            Alert.alert('Error', 'Please select City from Address Information panel!');
        }
        else if (this.state.disposition_category_c === undefined || this.state.disposition_category_c == '') {
            proceed = false;
            Alert.alert('Error', 'Please select Disposition Category from RM Allocation panel!');
        } else if (this.state.dispositions_c === undefined || this.state.dispositions_c == '') {
            proceed = false;
            Alert.alert('Error', 'Please select Dispositions from RM Allocation panel!');
        }


        let productSubCatg = ""
        this.state.productSubCatgSelected.forEach(element => {
            productSubCatg +=
                // '^' + 
                element.value
                // + '^'
                + ","
        });
        productSubCatg = productSubCatg.length > 0 ? productSubCatg.substr(0, productSubCatg.length - 1) : "";



        if (proceed) {
            this.disableSaveButton(true);
            this.setState({ loading: true });
            this.setState({ disable: true });

            apiurl = globals.home_url + "/ustore" +
                "?token_id=" + this.props.token +
                "&module_name=" + globals.leads + "&first_name=" +
                this.state.first_name +
                "&last_name=" +
                this.state.last_name +
                "&phone_mobile=" +
                this.state.phone_mobile +
                "&email1=" + this.state.email +
                "&lead_source=" +
                this.state.lead_source +

                //new fields
                "&salutation=" +
                this.state.salutation +
                "&middle_name_c=" +
                this.state.middle_name_c +
                "&phone_other=" +
                this.state.phone_other +
                "&interested_product_c=" +
                this.state.interested_product_c +
                "&designation_c=" +
                this.state.designation_c +
                "&retirement_date_c=" +
                this.state.retirement_date_c +
                "&age_in_number_c=" +
                this.state.age_in_number_c +
                "&phone_home=" +
                this.state.phone_home +
                "&mode_of_lead_c=" +
                this.state.mode_of_lead_c +
                "&lead_type_c=" +
                this.state.lead_type_c +
                "&service_type_c=" +
                this.state.service_type_c +
                "&users_leads_2_name=" +
                this.props.username + //this.state.users_leads_2_name +
                "&users_leads_2users_ida=" +
                this.props.assigned_user_id + // this.state.users_leads_2users_ida +
                "&occupation_type_c=" +
                this.state.occupation_type_c +
                "&product_sub_category_c=" + productSubCatg +


                //Campaign details
                "&organization_c=" +
                this.state.organization_c +
                "&campaign_name=" +
                this.state.campaign_name +
                "&campaign_id="+this.state.campaign_id + 

                //address
                "&address_1__c=" +
                this.state.address_1__c +
                "&address_2__c=" +
                this.state.address_2__c +
                "&state_c=" +
                this.state.state_c +
                "&city_c=" +
                this.state.city_c +
                "&postal_code_c=" +
                this.state.postal_code_c +

                //RM Allocation
                "&disposition_category_c=" +
                this.state.disposition_category_c +
                "&dispositions_c=" +
                this.state.dispositions_c +
                "&client_category_c=" +
                this.state.client_category_c +
                "&prefered_date_time_date=" +
                this.state.prefered_date_time_date +
                "&appointment_date_time_date=" +
                this.state.appointment_date_time_date +
                "&remarks_c=" +
                this.state.remarks_c +
                "&meeting_done_c=" +
                this.state.meeting_done_c +
                "&who_cancelled_c=" +
                this.state.who_cancelled_c +
                "&lost_reason_c=" +
                this.state.lost_reason_c +
                
                "&assigned_user_name=" +
                this.props.username +
                "&assigned_user_id=" +
                this.props.assigned_user_id +
                "&url=" + this.props.url
                ; //Extra added


            console.log(apiurl);

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
                        this.props.navigator.push({
                            screen: 'app.Details',
                            title:'Lead',
                            passProps: { lead_id: llead_id }, // Object that will be passed as props to the pushed screen (optional)
                            animated: true, // does the push have transition animation or does it happen immediately (optional)
                        });
                    } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                        apiCallForToken.getToken(this.props).then(token => {
                            console.log("getToken: token = " + token)
                            if (token == null) {
                                this.setState({ loading: false, disable: false });
                                return;
                            }
                            //save lead, after session generated
                            this.save()
                        }).catch(error => {
                            console.log("getToken: error = " + error)
                            this.setState({ loading: false, disable: false });
                            this.disableSaveButton(false);
                        })

                    } else {
                        Alert.alert(globals.app_messages.error_string, response.data.description);
                        this.setState({ loading: false, disable: false });
                        this.disableSaveButton(false);
                    }

                }).then(() => {
                    this.disableSaveButton(false);
                    this.setState({ loading: false });
                    this.setState({ disable: false });
                })
                .catch(err => {
                    console.log(err);
                    this.disableSaveButton(false);
                    this.setState({ loading: false });
                    Alert.alert('Error', 'Oops! Something went wrong, please try again.');
                });

        }

    }



    //! this function is not in use
    goBack() {
        this.props.navigator.pop({
            animated: true, // does the pop have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }

    onStatusChange(value) {

        this.setState({
            lstatus: value
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

    statusdropdown = globals.leadStatusArray
    //Lead Source drop down array
    leadSourceDropDown = globals.leadSourceItems;

    //lead category drop down array
    leadCategory = globals.leadCategoryItems;

    //leadCustomerType drop down array
    leadCustomerType = globals.leadCustomerTypeItems;

    _onPressDropdown() {

        console.log('clicked');
        this.setState({
            isHidden: true
        })
    }

    hideKeyBoard = () => {
        Keyboard.dismiss()
    }

    componentWillMount() {
        const handler = (e) => {
            console.log("handler e = " + e)
            if (this.state.modal) { this.onPress(null) }
        }
        const handlerHide = (e) => {
            console.log("handlerHide e = " + e)

            if (this.state.modal) {
                this.onPress(null)
            }
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handler)
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handlerHide)
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }


    captureLeadData() {
        ActionSheetIOS.showActionSheetWithOptions({
            title: 'Select Visiting Card',
            options: ['Cancel', 'Open Camera', 'Select from Gallery'],
            cancelButtonIndex: 0,
            // destructiveButtonIndex: 1,
        },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    this.openCameraLead();
                }

                if (buttonIndex === 2) {
                    this.fromGalleryLead();
                }
            });
    }

    openCameraLead() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            writeTempFile: true,
            cropping: false,
            includeBase64: true,
        }).then(image => {
            console.log("openCameraLead: image = " + image);
            this.setState({
                visitingCard: image
            });
            this.fetchDataFromVisitingCard(image, 'Camera')
        });
    }

    fromGalleryLead() {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: false,
            includeBase64: true
        }).then(image => {
            console.log("fromGalleryLead: image = " + image);
            this.setState({
                visitingCard: image
            });
            this.fetchDataFromVisitingCard(image, 'Gallery')
        });
    }

    fetchDataFromVisitingCard(photo, type) {
        this.setState({ cardReading: true });
        let image_url = "https://simplecrmperformance.com:8000/visiting_cards_data/get_extracted_data";

        console.log("fetchDataFromVisitingCard: API URL = " + image_url);

        fetch(image_url, {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data;'
            },
            body: createFormDataVisitingCard(photo, type)
        })
            .then(response => response.json())
            .then(response => {
                console.log("fetchDataFromVisitingCard response = " + JSON.stringify(response))
                if (response.Name === "" && response.Designation == "" && response.Email_id == ""
                    && response.Address == "" && response.Organisation == "" && response.Phone_no == ""
                    && response.website == "") {
                    //Nothing find from image
                    this.setState({ cardReading: false });
                    alert("Sorry, couldn't read from image.")
                } else {

                    // let mobile = response.Phone_no.replace("(","").replace(")","").splt(" +")
                    let mobileString = response.Phone_no
                    let mobile = mobileString.split("(").join("").split(")").join("").split(" +")
                    console.log("mobile = " + mobile[0])
                    this.setState({
                        cardReading: false,
                        first_name: response.Name,
                        last_name: '',
                        // ldetails: '',
                        ltitle: response.Designation,
                        phone_mobile: mobile.length > 0 ? mobile[0] : '',
                        // loffice_phone: '',
                        lemail: response.Email_id,
                        lstreet: response.Address,
                        lcity: '',
                        lstate: '',
                        lcountry: '',
                        lpostalcode: '',
                        lcompany_name: response.Organisation,

                        fullAddress: response.Address,
                    })
                }
            })
            .then(() => {
                this.setState({ cardReading: false });
            })
            .catch(error => {
                this.setState({ cardReading: false });
                console.log("upload error", error);
                alert("Failed to read from image.");

            });

    }

    showImageOption() {
        ActionSheetIOS.showActionSheetWithOptions({
            title: 'Select Profile Picture',
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
        });
    }

    componentDidMount() {
        this.setState({
            status_list: globals.leadStatusItems
        });
        console.log(this.state.status_list);

        this.getCityState()
        this.getLeadsDropdown()
    }


    getLeadsDropdown() {
        fetch(globals.demo_instance + "index.php?entryPoint=getleadsdropdownlist", {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    //Save in one variable
                    let salutation = []
                    let lead_source = []
                    let status = []
                    let interested_product_c = []
                    let disposition_category_c = []
                    let occupation_type_c = []
                    let process_type_c = []

                    response.dropdowns.forEach(element => {
                        if (element.label == 'salutation') {
                            salutation = element.dropdown_values
                        } else if (element.label == 'lead_source') {
                            lead_source = element.dropdown_values
                        } else if (element.label == 'status') {
                            status = element.dropdown_values
                        } else if (element.label == 'interested_product_c') {
                            interested_product_c = element.dropdown_values
                        } else if (element.label == 'disposition_category_c') {
                            disposition_category_c = element.dropdown_values
                        } else if (element.label == 'occupation_type_c') {
                            occupation_type_c = element.dropdown_values
                        } else if (element.label == 'process_type_c') {
                            process_type_c = element.dropdown_values
                        }
                    });
                    this.setState({
                        salutationList: salutation,
                        lead_sourceList: lead_source,
                        statusList: status,
                        interested_product_cList: interested_product_c,
                        disposition_category_cList: disposition_category_c,
                        occupation_type_cList: occupation_type_c
                    })
                }
            })
            .then(() => {
            })
            .catch(error => {
                console.log("upload error", error);
            });
    }

    getCityState() {
        fetch(globals.demo_instance + "index.php?entryPoint=getMobileCityState", {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
        })
            .then(response => response.json())
            .then(response => {
                if (response.success) {
                    //Save in one variable
                    this.setState({
                        statesList: response.states
                    })
                }
            })
            .then(() => {
            })
            .catch(error => {
                console.log("upload error", error);
            });
    }


    setAddress(place) {
        this.setState({
            lstreet: place.name
        });
        this.setState({
            address_array: place.addressComponents, currentLatitude: '' + place.location.latitude, currentLongitude: '' + place.location.longitude
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

    openUsersSelector() {
        this.props.navigator.push({
            screen: 'app.CustomDropdown',
            title: 'Select Users',
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: {
                moduleName: globals.users, selectedId: this.state.users_leads_2users_ida, onSelected: (data) => {
                    console.log("Custom Callback Lead: onSelected: data = " + JSON.stringify(data))
                    this.setState({ users_leads_2_name: data.name, users_leads_2users_ida: data.id }); //This line causing problem
                }
            }, // Object that will be passed as props to the pushed screen (optional)
            animated: true, // does the push have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
            backButtonTitle: 'Back', // override the back button title (optional)
            backButtonHidden: false, // hide the back button altogether (optional)
            navigatorStyle: { navBarTextColor: 'black' }, // override the navigator style for the pushed screen (optional)
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

    openSearchModal() {
        RNGooglePlaces.openAutocompleteModal()
            .then((place) => {
                // place represents user's selection from the
                // suggestions and it is a simplified Google Place object.
                console.log("Places = " + JSON.stringify(place))
                this.setAddress(place);
            })
            .catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    render() {
        let data = { campaign_name: this.state.campaign_name, organization_c: this.state.organization_c }
        return (
            <Container>
                {/* enableResetScrollToCoords & keyboardShouldPersistTaps these props plays important role in scrolling and popup positioning */}
                <Content enableResetScrollToCoords={false} keyboardShouldPersistTaps="never">
                    {this.state.loading &&
                        <View style={[styles.content, { marginTop: containerHeight / 3 }]}>
                            <Spinner color='red' />
                        </View>
                    }
                    {this.state.loading === false &&
                        <View>

                            <View style={{ marginTop: 0, marginRight: 10, marginLeft: 10 }} >

                                <Dropdown
                                    label='Salutation'
                                    data={this.state.salutationList}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value) => { this.setState({ salutation: value }) }}
                                    value={this.state.salutation}
                                />

                                <TextField
                                    label='First Name'
                                    autoCapitalize='none'
                                    value={this.state.first_name}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => {
                                       
                                        if (globals.validateText(text)) {
                                            this.setState({ first_name: text })
                                        } else {
                                            this.timer = setTimeout(() => {
                                                const lastValue = text.substr(0, text.length - 1)
                                                console.log("onChanged " + lastValue)
                                                this.setState({ first_name: lastValue })
                                            }, 50);
                                        }
                                    }}
                                    textColor='#000'
                                    tintColor='red'
                                    blurOnSubmit={this.state.isHidden}
                                    placeholderTextColor='#000'
                                    ref={ref => { this.state.textFieldName = ref }}
                                    onBlur={() => console.log("Name blured")}

                                />

                                <TextField
                                    label='Middle Name'
                                    autoCapitalize='none'
                                    value={this.state.middle_name_c}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => {
                                        if (globals.validateText(text)) {
                                            this.setState({ middle_name_c: text })
                                        } else {
                                            this.timer = setTimeout(() => {
                                                const lastValue = text.substr(0, text.length - 1)
                                                console.log("onChanged " + lastValue)
                                                this.setState({ middle_name_c: lastValue })
                                            }, 50);
                                        }
                                      
                                    }}
                                    textColor='#000'
                                    tintColor='red'
                                    keyboardType='name-phone-pad'
                                    blurOnSubmit={this.state.isHidden}
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Last Name*'
                                    autoCapitalize='none'
                                    value={this.state.last_name}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => {
                                        // this.setState({ last_name: text })
                                        if (globals.validateText(text)) {
                                            this.setState({ last_name: text })
                                        } else {
                                            this.timer = setTimeout(() => {
                                                const lastValue = text.substr(0, text.length - 1)
                                                console.log("onChanged " + lastValue)
                                                this.setState({ last_name: lastValue })
                                            }, 50);
                                        }
                                    }}
                                    textColor='#000'
                                    tintColor='red'
                                    blurOnSubmit={true}
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Phone Number*'
                                    autoCapitalize='none'
                                    value={this.state.phone_mobile}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ phone_mobile: text })}
                                    textColor='#000'
                                    maxLength={15}
                                    characterRestriction={15}
                                    keyboardType='phone-pad'
                                    tintColor='red'
                                    blurOnSubmit={true}
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Alternate Mobile No'
                                    autoCapitalize='none'
                                    value={this.state.phone_other}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ phone_other: text })}
                                    textColor='#000'
                                    maxLength={15}
                                    characterRestriction={15}
                                    keyboardType='phone-pad'
                                    tintColor='red'
                                    blurOnSubmit={true}
                                    placeholderTextColor='#000'
                                />


                                <TextField
                                    label='Email'
                                    autoCapitalize='none'
                                    value={this.state.email}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ email: text })}
                                    textColor='#000'
                                    keyboardType='email-address'
                                    tintColor='red'
                                    placeholderTextColor='#000'
                                />

                                <Dropdown
                                    label='Lead Source'
                                    data={this.state.lead_sourceList}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value) => { this.setState({ lead_source: value }) }}
                                    value={this.state.lead_source}
                                />

                                <Dropdown
                                    label='Interested Product*'
                                    data={this.state.interested_product_cList}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value, index) => {
                                        console.log("Interested Product: value = " + value + " index = " + index);
                                        console.log("Interested Product: json = " + JSON.stringify(this.state.interested_product_cList[index]));
                                        this.setState({ product_sub_category_cList: this.state.interested_product_cList[index].product_sub_category_c, productSubCatgSelected:[] })
                                        this.setState({ interested_product_c: value })
                                    }}
                                    value={this.state.interested_product_c}
                                />


                                <TouchableOpacity onPress={() => {
                                    if (this.state.product_sub_category_cList.length > 0) {
                                        this.setState({ isPSCVisible: true })
                                    } else {

                                    }
                                }}>

                                    <View style={{ flex: 1, flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: globals.colors.grey }}>
                                        <View style={{ flex: 9.5, paddingTop: 5, paddingBottom: 5 }}>
                                            <Text style={{ fontSize: 12, color: globals.colors.grey, marginBottom: -5, marginTop: 10, marginBottom: 5 }}>{"Product Sub Category"}</Text>
                                            <Text style={{ marginBottom: 5 }}>{this.state.productSubCatgSelected.map(({ value, label }, index) => (label)).join()}</Text>
                                        </View>
                                        <Image source={require('../../../images/dropdown.png')}
                                            style={{ flex: 0.5, width: 27, height: 27, tintColor: globals.colors.grey, alignSelf: 'flex-end' }} />
                                    </View>
                                </TouchableOpacity>

                                <MultiPickerMaterialDialog
                                    title={"Product Sub Category"}
                                    scrolled
                                    items={this.state.product_sub_category_cList.map(({ value, label }, index) => ({ value: value, label: label }))}
                                    visible={this.state.isPSCVisible}
                                    selectedItems={this.state.productSubCatgSelected}
                                    onOk={result => {
                                        this.setState({ isPSCVisible: false });
                                        console.log("RESULYTTTT = " + JSON.stringify(result))
                                        console.log("MultiSelect : result.selectedItem = " + result.selectedItems + " result.selectedItem.length = " + result.selectedItems.length)
                                        if (result.selectedItems != null) {
                                            this.setState({
                                                productSubCatgSelected: result.selectedItems
                                            });
                                        }
                                    }}
                                />

                                <Dropdown
                                    label='Designation'
                                    data={consts.dropdown.designation}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value) => { this.setState({ designation_c: value }) }}
                                    value={this.state.designation_c}
                                />

                                <Dropdown
                                    label='Mode of Lead'
                                    data={consts.dropdown.mode_of_lead}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value) => { this.setState({ mode_of_lead_c: value }) }}
                                    value={this.state.mode_of_lead_c}
                                />

                                <Dropdown
                                    label='Lead Type'
                                    data={consts.dropdown.lead_type}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value) => { this.setState({ lead_type_c: value }) }}
                                    value={this.state.lead_type_c}
                                />
                                <Dropdown
                                    label='Occupation Type'
                                    data={consts.dropdown.occupation_type}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(value) => { this.setState({ occupation_type_c: value }) }}
                                    value={this.state.occupation_type_c}
                                />
                                <TextField
                                    label='Service Type'
                                    autoCapitalize='none'
                                    value={this.state.service_type_c}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ service_type_c: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    blurOnSubmit={true}
                                    placeholderTextColor='#000'
                                />


                                <TextField
                                    label='Age in Number'
                                    autoCapitalize='none'
                                    value={this.state.age_in_number_c}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ age_in_number_c: text })}
                                    textColor='#000'
                                    maxLength={10}
                                    characterRestriction={10}
                                    keyboardType='phone-pad'
                                    tintColor='red'
                                    blurOnSubmit={true}
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Land Line Number'
                                    autoCapitalize='none'
                                    value={this.state.phone_home}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ phone_home: text })}
                                    textColor='#000'
                                    maxLength={15}
                                    characterRestriction={15}
                                    keyboardType='phone-pad'
                                    tintColor='red'
                                    blurOnSubmit={true}
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Retirement Date'
                                    autoCapitalize='none'
                                    value={this.state.retirement_date_c}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    textColor='#000'
                                    tintColor='red'
                                    onChangeText={(text) => {
                                        this.setState({ retirement_date_c: text })
                                    }}
                                    placeholderTextColor='#000'
                                />

                            </View>

                            <ExpandableViewAddress component={this} />

                            <ExpandableView component={this} />

                            <ExpandableViewRmAllocation component={this} />

                        </View>
                    }

                    <Modal
                        animationType={'fade'}
                        transparent
                        hardwareAccelerated
                        visible={this.state.cardReading}
                        supportedOrientations={['portrait', 'landscape']}
                    >
                        <View style={{
                            position: 'absolute',
                            alignSelf: 'center',
                            top: deviceHeight / 2,
                            borderRadius: 10,
                            bottom: 0,
                            width: deviceWidth / 2,
                            height: deviceHeight / 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Spinner style={styles.loading} color='white' />
                            <Text style={styles.loadingText}>Reading card data...</Text>
                        </View>
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
        token: state.auth.token,
        username: state.auth.username,
        password: state.auth.password,
        assigned_user_id: state.auth.assigned_user_id,
        url: state.auth.url,

    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login, logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Create);