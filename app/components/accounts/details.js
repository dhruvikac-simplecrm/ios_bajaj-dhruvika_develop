import React, { Component } from 'react';
import {
    View,
    Alert,
    Image,
    TextInput,
    AlertIOS,
    StatusBar,
    ActionSheetIOS,
    Dimensions,
    FlatList,
    Modal,
    TouchableOpacity,
    TouchableHighlight,
    NativeModules

} from 'react-native';
import { connect } from 'react-redux';

import { Container, Spinner, Content, Tab, Tabs, ScrollableTab, Icon, Text, Button } from 'native-base';
import { login, logout, updateToken } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';

import BasicInfoAccount from './basicInfo';
import AppointmentsAccount from "./appointments";
import DocumentsAccount from './documents';
import HistoryAccount from './history';
import AccountsOpportunities from './accountsOpportunities';
import AccountsContacts from './accountsContacts';
import AccountsLeads from './accountsLeads';
import globals from '../../globals';
import ImagePicker from 'react-native-image-crop-picker';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import { Navigation } from 'react-native-navigation';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
import Photos from './accountPhotos';
import { Linking } from 'react-native';
import apiCallForToken from '../../controller/ApiCallForToken';
import FontAwesome, { Icons } from 'react-native-fontawesome';

//* this file contains all the details of a specific account
//* This file also has all the tabs like Basic Info, Appointments, Contacts, Leads, Opportunities, Documents, History


// create a form data which will contain data related to the photo
const createFormData = (photo) => {
    const data = new FormData();

    data.append("contents", {
        name: photo.filename,
        type: photo.mime,
        uri: photo.sourceURL
        // Platform.OS === "android" ? url : url.replace("file://", "")
    });

    return data;
};


const createFormDataForSingleImage = (photo) => {
    const data = new FormData();
    var path = "file://" + photo.path;
    console.log('image path: ', path);
    data.append("contents", {
        name: 'abc.jpg',
        type: photo.mime,
        uri: path
        // Platform.OS === "android" ? url : url.replace("file://", "")
    });

    return data;
};


//create a form data which will contain the data related to the document selected
const createFormDataForDocument = (document) => {
    const data = new FormData();

    data.append("contents", {
        name: document.fileName,
        type: 'mime',
        uri: document.uri
        // Platform.OS === "android" ? url : url.replace("file://", "")
    });
    return data;
};

let tagName = globals.tagName;

class AccountDetails extends Component {



    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            disable: false,
            submitLoading: true,
            username: '',
            password: '',
            document: '',
            adata: '',
            images_data: [],
            photo: '',
            note_id: '',

            imageTagModalVisible: false,
            imageTagArray: []
        }

        this.props.navigator.setButtons({
            rightButtons: [

                //     {
                //         id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                //         testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                //         disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                //         disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                //         buttonColor: 'white',
                //         buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                //         buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                //         systemItem: 'edit'
                //     },
                {
                    id: 'action',
                    testID: 'e2e_action',
                    disableIconTint: true,
                    buttonFontSize: 14,
                    buttonFontWeight: '600',
                    systemItem: 'add'
                }
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

        //  this.getDetails();
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.type == 'NavBarButtonPress') {
            // this is the event type for button presses
            if (event.id == 'edit') { // this is the same id field from the static navigatorButtons definition
                //AlertIOS.alert('SalesMobi', 'You pressed search button');
                this.props.navigator.push({
                    screen: 'app.EditAccount',
                    title: 'Edit Account',
                    subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                    passProps: { data: this.state.adata }, // Object that will be passed as props to the pushed screen (optional)
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
            if (event.id == 'action') {
                //this is an action sheet which has some options to choose from
                //below are the click events on the options
                ActionSheetIOS.showActionSheetWithOptions({
                    options: ['Cancel', 'Schedule Meeting', 'Log Call', 'Create Task',  'Attach Images', 'Attach Documents'],

                    cancelButtonIndex: 0,
                },
                    (buttonIndex) => {
                        
                        if (buttonIndex === 1) {
                            this.props.navigator.push({
                                screen: 'app.ScheduleMeetingAccount',
                                title: 'Schedule Meeting',
                                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                                passProps: { data: this.state.adata }, // Object that will be passed as props to the pushed screen (optional)
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

                        if (buttonIndex === 2) {

                            //go to the log call screen
                            this.props.navigator.push({
                                screen: 'app.LogCallAccount',
                                title: 'Log Call',
                                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                                passProps: { data: this.state.adata }, // Object that will be passed as props to the pushed screen (optional)
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

                        if (buttonIndex === 3) {
                            this.props.navigator.push({
                                screen: 'app.CreateTaskAccount',
                                title: 'Create Task',
                                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                                passProps: { data: this.state.adata }, // Object that will be passed as props to the pushed screen (optional)
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

                            if (buttonIndex === 4) {
                                //Show another action sheet here with two options 1. Open Camera 2. Select from Gallery

                            this.showImageOption();
                        }
                            if (buttonIndex === 5) {
                                this.selectDocuments();

                        }
                    });

            }

            if (event.id == 'back') {
                //AlertIOS.alert('SalesMobi', 'Back button pressed');

                this.goBack();
            }
        }
    }

    //this function will open the document picker and will allow user to select a document from their phone
    selectDocuments() {
        // iPhone/Android
        DocumentPicker.show({
            filetype: [DocumentPickerUtil.allFiles()],
        }, (error, res) => {

            this.setState({
                document: res
            });

            console.log(this.state.document);
            this.createNoteForDocument(this.state.document);

            
        });

    }

    //after selecting a document you first have to create a note in the CRM
    //this method does it. It will create a note with the file name
    createNoteForDocument(document) {
        this.setState({ loading: true });
        this.setState({ disable: true });



        let url = globals.home_url + "/ustore"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&name=" + document.fileName + "&description=" + "&assigned_user_id=" + this.props.assigned_user_id +
            "&assigned_user_name=" + this.props.username + "&parent_type=" + globals.accounts +
            "&parent_id=" + this.state.adata.id
            + "&url=" + this.props.url;

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

                console.log('Note Response');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    this.setState({
                        note_id: response.data.result.id
                    })

                    this.uploadDocument(document, this.state.note_id);
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    // Alert.alert(
                    //     globals.app_messages.error_string,
                    //     globals.app_messages.token_expired,
                    //     [
                    //         { text: globals.login, onPress: () => this.props.logout() }
                    //     ],
                    //     { cancelable: false }
                    // )

                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.setState({ loading: false, disable: false });
                            return;
                        }
                        //get create Note For Document, after session generated
                        this.createNoteForDocument(document)
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ loading: false, disable: false });
                       
                    })

                } else {
                    Alert.alert('Error', response.data.description);
                    this.setState({ loading: false });
                    this.setState({ disable: false });
            
            
                }

            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
                this.setState({ disable: false });
        
        
            });

    }

    //this method will upload the document in the note you have created earlier
    //the doument uploaded will be saved in the notes module inside the note
    uploadDocument(document, note_id) {

        let document_url = globals.home_url + "/setAttachment"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&id=" + note_id +
            "&filename=" + document.fileName
            + "&url=" + this.props.url;

        console.log(document_url);

        fetch(document_url, {
            method: "POST",
            body: createFormDataForDocument(document)
        })
            .then(response => response.json())
            .then(response => {
                console.log("upload succes", response);
                this.setState({ document: null });

                this.setState({ loading: false });
                this.setState({ disable: false });
                alert("Document uploaded");


            })
            .catch(error => {
                this.setState({ loading: false });
                console.log("upload error", error);
                alert("Upload failed!");
            });


    }



    //let user choose the image either from the gallery or click one using camera
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
                    this.selectPhotos();
                }


            });
    }

    //open camera to capture the image and then create a note
    openCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            console.log(image);
            this.setState({
                images_data: image
            })

            this.createNoteForSingleImage(image);


        });

    }



    createNoteForSingleImage(photo) {
        this.setState({ loading: true });
        this.setState({ disable: true });

        let url = globals.home_url + "/ustore"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&name=" + "image" + "&description=" + "&assigned_user_id=" + this.props.assigned_user_id +
            "&assigned_user_name=" + this.props.username + "&parent_type=" + globals.accounts +
            "&parent_id=" + this.state.adata.id
            + "&url=" + this.props.url;

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

                console.log('Note Response');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    this.setState({
                        note_id: response.data.result.id
                    })

                    this.uploadPhotoForSingleImage(photo, this.state.note_id);

                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                   

                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.setState({ loading: false, disable: false });
                            return;
                        }
                        //get create Note For Single Image, after session generated
                        this.createNoteForSingleImage(photo)
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ loading: false, disable: false });
                       
                    })

                    
            
            
                } else {
                    Alert.alert('Error', response.data.description);
                    this.setState({ loading: false });
                    this.setState({ disable: false });
                }

            })
            // .then(() => {

            //     this.setState({ loading: false });
            // })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false });
                    this.setState({ disable: false });
            });
    }


    uploadPhotoForSingleImage(photo, id) {

        let image_url = globals.home_url + "/setAttachment"
            + "?token_id=" + this.props.token +
            "&id=" + id +
            "&filename=" + id + "_image.jpg"
            + "&url=" + this.props.url;

        console.log(image_url);

        fetch(image_url, {
            method: "POST",
            headers: {
                'Content-Type': 'multipart/form-data;'
            },
            body: createFormDataForSingleImage(photo)
        })
            .then(response => response.json())
            .then(response => {
                console.log("upload succes", response);
                //alert(i + " Images uploaded");
                this.setState({ photo: null });
                this.setState({ loading: false });
                this.setState({ disable: false });
                alert("Image uploaded");
            })
            .catch(error => {
                this.setState({ loading: false });
                console.log("upload error", error);
                alert("Upload failed!");

            });
    }




    //select photos from the gallery, you can select multiple images cause muliple = true
    selectPhotos() {
        ImagePicker.openPicker({
            multiple: true
        }).then(images => {
            console.log('selected images:');
            console.log(images);
            this.setState({
                images_data: images
            })
            var i = 0;
            var uploadResult = [];

            this.setImageTagModalVisibility(true);

            for (const sourceURL in images) {
                if (images.hasOwnProperty(sourceURL)) {
                    this.setState({ photo: images[i] });
                    console.log(this.state.photo);

                    this.addImageTagItem(images[i])

                }
                i++;

            }

            //alert(i + " Images uploaded");

        });
    }

    //addImageTagItem() this function creates new array by linking image and tag together
    addImageTagItem(image) {
        const obj = { 'image': image, 'tag': '' };
        this.setState({
            imageTagArray: [...this.state.imageTagArray, obj]
        });
    }

    //When User cancels image uploading this uploadCancelButtonClick() gets called
    uploadCancelButtonClick() {
        this.setImageTagModalVisibility(!this.state.imageTagModalVisible)
        this.setState({
            imageTagArray: [],
            photo: '',
            document: '',
            images_data: [],
            image_url: ''
        })
    }

    //When user clicks on upload button uploadButtonClick() this function gets called
    uploadButtonClick() {
        this.setImageTagModalVisibility(!this.state.imageTagModalVisible)
        for (let index = 0; index < this.state.imageTagArray.length; index++) {
            const element = this.state.imageTagArray[index];
            //create note here first then upload photo for each note. 
            //for N no of images N no of notes to be created
            this.createNote(element, this.state.imageTagArray.length, index + 1);
        }
    }

    //setImageTagModalVisibility() this is just to set visibility of image tag modal
    setImageTagModalVisibility(isVisible) {
        console.log('tag modal: ', isVisible);
        this.setState({ imageTagModalVisible: isVisible })
    }

    //create a note item for every image selected
    createNote(element, length, count) {
        //This change req
        const photo = element.image;
        if (element.tag !== '') {
            tagName = element.tag
        } else {
            tagName = globals.tagName;
        }

        this.setState({ loading: true });
        this.setState({ disable: true });

        let url = globals.home_url + "/ustore"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&name=" + tagName + "&description=" + "&assigned_user_id=" + this.props.assigned_user_id +
            "&assigned_user_name=" + this.props.username + "&parent_type=" + globals.accounts +
            "&parent_id=" + this.state.adata.id
            + "&url=" + this.props.url;

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

                console.log('Note Response');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    this.setState({
                        note_id: response.data.result.id
                    })
                    this.uploadPhotos(photo, length, count, this.state.note_id);
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    

                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.setState({imageTagArray:[]})
                            this.setState({ loading: false, disable: false });
                            return;
                        }
                        //get create Note For Document, after session generated
                        this.createNote(element, length, count)
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({imageTagArray:[]})

                        this.setState({ loading: false, disable: false });
                    })

                } else {
                    Alert.alert('Error', response.data.description);
                    this.setState({
                        imageTagArray: []
                    })
                    this.setState({ loading: false });
                    this.setState({ disable: false });
                }

            })
            // .then(() => {

            //     this.setState({ loading: false });
            // })
            .catch(err => {
                console.log(err);
                this.setState({
                    imageTagArray: []
                })
                this.setState({ loading: false });
                    this.setState({ disable: false });
            });
    }


    //this is a set attachments api which will add image in the note created for every image selected
    //so here to set multiple images mulitple notes will be created. Mulitple images can not be stored in a single note
    //every note can have only one image or attachment
    uploadPhotos(photo, length, i, id) {

        let image_url = globals.home_url + "/setAttachment"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&id=" + id +
            "&filename=" + photo.filename
            + "&url=" + this.props.url;

        console.log(image_url);

        fetch(image_url, {
            method: "POST",
            body: createFormData(photo)
        })
            .then(response => response.json())
            .then(response => {
                console.log("upload succes", response);
                //alert(i + " Images uploaded");
                this.setState({ photo: null });
                if (length === i) {
                    this.setState({ loading: false });
                    this.setState({ disable: false, imageTagArray: [] });
                    // alert(length + " Images uploaded");

                }
            })
            .catch(error => {
                this.setState({ loading: false, imageTagArray: [] });
                console.log("upload error", error);
                //alert("Upload failed!");

            });



    }


    //once you click on the list item this method will be called to get the details of an Account
    componentDidMount() {
        this.getDetails();
    }



    //get all the details of an account from this API
    getDetails() {
        this.setState({ loading: true });
        this.setState({ disable: true });

        console.log('token');
        console.log(this.props.token);
        var data = [];
        var proceed = false;
        let url = globals.home_url + "/ushow" + "?token_id=" + this.props.token + "&id=" + this.props.account_id
            + "&module_name=" + globals.accounts + "&fields=" + globals.ACCOUNTS_DETAIL_FIELDS
            + "&url=" + this.props.url;
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

                console.log('Accounts Details:');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    if (response.data.result) {
                        console.log('in result');
                        //this is a state varible adata. which has all the details stored
                        this.setState({ adata: response.data.result });
                        console.log(this.state.adata);
                        this.setState({ loading: false });
                        this.setState({ disable: false });

                        if (this.props.from_list) {

                            this.props.navigator.push({
                                screen: 'app.EditAccount',
                                title: 'Edit Account',
                                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                                passProps: { data: this.state.adata }, // Object that will be passed as props to the pushed screen (optional)
                                animated: true, // does the push have transition animation or does it happen immediately (optional)
                                animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                                backButtonTitle: 'Back', // override the back button title (optional)
                                backButtonHidden: false, // hide the back button altogether (optional)
                            });

                        }
                    }
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    
                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.setState({ loading: false, disable: false });
                            this.setState({ dataHasValue: true });
                            return;
                        }
                        //get client details, after session generated
                        this.getDetails()
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ loading: false, disable: false });
                        this.setState({ dataHasValue: true });
                    })


                } else {
                    this.setState({ dataHasValue: true });
                    this.setState({ loading: false });
                    Alert.alert('Error', response.data.description, () => { this.goBack() });
                }

            })
            .catch(err => {
                console.log(err);
                this.setState({ dataHasValue: true });
                this.setState({ loading: false });
            });
    }

    goBack() {
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'app.Accounts',
                title: 'Clients',
                animationType: 'slide-horizontal',
                navigatorButtons: {

                    leftButtons: [
                        {
                            icon: require('../../../images/hamburger_small.png'), // for icon button, provide the local image asset name
                            id: 'menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                        },
                    ]

                } // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)

            },
            drawer: {
                left: {
                    screen: 'app.Menu'
                }
            }
        });
    }

    delete(id) {

        this.setState({ loading: true });
        this.setState({ disable: true });
        let url = globals.home_url + "/udestroy" + "?token_id=" + this.props.token
            + "&id=" + id + "&module_name=" + globals.accounts
            + "&url=" + this.props.url;
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

                this.setState({ dataHasValue: true });
                this.setState({ loading: false });
            })
            .catch(err => {
                console.log(err);
            });

    }

    render() {
        return (
            <Container style={{ backgroundColor: '#ffffff' }} >
                <Content scrollEnabled={true}>

                    {this.state.loading &&
                        <View style={[styles.content, { marginTop: containerHeight / 3 }]}>
                            <Spinner color='red' />
                        </View>
                    }

                    {this.state.loading == false && this.state.submitLoading &&
                        <View>

                            {/* modal starts here for Adding tags for images */}
                            <View style={{ marginTop: 0 }}>
                                <Modal
                                    animationType="slide"
                                    transparent={false}
                                    visible={this.state.imageTagModalVisible}
                                    onRequestClose={() => {
                                        Alert.alert('Modal has been closed.');
                                    }}>

                                    {/* Add Top bar with screen title, upload and cancel buttons */}
                                    <View style={styles.imageTagScreen.topBar}>
                                        <View style={styles.imageTagScreen.left}>
                                            <Button transparent onPress={() => this.uploadCancelButtonClick()} >
                                                <View style={{ justifyContent: "flex-end", alignItems: 'flex-end' }} >
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: globals.colors.red, padding: 5 }}>Cancel</Text>
                                                </View>
                                            </Button>
                                        </View>
                                        <Text style={styles.imageTagScreen.center}>Add Tags</Text>
                                        <View style={styles.imageTagScreen.right}>
                                            <Button transparent onPress={() => this.uploadButtonClick()} style={{ justifyContent: 'center', alignSelf: 'flex-end' }}>
                                                <View style={{ justifyContent: "flex-end", alignItems: 'flex-end' }} >
                                                    <Text style={{ fontWeight: 'bold', fontSize: 16, color: globals.colors.blue_default, padding: 5 }}>Upload</Text>
                                                </View>
                                            </Button>
                                        </View>
                                    </View>

                                    <View style={{ margin: 10, padding: 10 }}>
                                        <View >
                                            {/* FlatList to show all selected/captured images */}
                                            <FlatList
                                                style={{ marginBottom: 50, width: '100%', paddingLeft: 5, paddingRight: 3 }}
                                                keyExtractor={(item, index) => index}
                                                data={this.state.imageTagArray}
                                                renderItem={({ item, index }) =>
                                                    // Child View to display single element of list
                                                    <View style={{ marginTop: 15 }}>
                                                        <Image source={{ uri: item.image.sourceURL }}
                                                            style={{
                                                                height: 150, justifyContent: "flex-end",
                                                                borderRadius: 10
                                                            }}
                                                        />
                                                        <View style={{ height: 5, backgroundColor: globals.colors.color_primary_dark }} />
                                                        <TextInput placeholder="Tag it"
                                                            value={item.tag}
                                                            style={{ fontSize: 20, backgroundColor: globals.colors.light_grey, padding: 5 }}
                                                            onChangeText={(text) => {
                                                                item.tag = text
                                                            }} />
                                                    </View>

                                                }
                                            />
                                        </View>
                                    </View>

                                </Modal>
                            </View>
                            {/* end of the modal for Adding Tags for images */}

                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: globals.colors.color_primary, paddingTop: 35, paddingBottom: 20, paddingLeft: 20, paddingRight: 20 }}>

                            <View style={{ flex: 0.3 }}>
                                    <View style={{backgroundColor:globals.colors.grey, width:80, height:80, marginTop: 15, marginLeft: 0, marginRight: 5, marginBottom: 5, borderRadius: 80, alignContent:'center', justifyContent:'center', alignItems:'center' }}>
                                            <Text style = {{fontSize:30, fontWeight:'bold', alignSelf:'center', textAlign:'center', color:globals.colors.color_primary_dark}}>{this.state.adata.name != undefined && this.state.adata.name != '' ? this.state.adata.name.substr(0,1).toUpperCase() : ''}</Text>
                                    </View>
                                </View>

                                  
                                <View style={{ flex: 0.7, marginLeft: 0, marginTop: 10 }}>

                                    <Text style={styles.detailViewHeader}>{this.state.adata.name}</Text>

                                    

                                    {this.state.adata.phone_office &&
                                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }} >
                                            <TouchableHighlight
                                                underlayColor='transparent'
                                                onPress={() => globals.makeAPhoneCall(this.state.adata.phone_office)} >
                                                <View style={{ flexDirection: 'row' }}>

                                                    <FontAwesome style={{ color: 'white', fontSize: 20, }} > {Icons.phone}
                                                    </FontAwesome>

                                                    <Text style={{ marginLeft: 10, color: '#fff' }}>{this.state.adata.phone_office} </Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    }

                                    {this.state.adata.email1 &&
                                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }} >
                                            <TouchableHighlight
                                                underlayColor='transparent'
                                                onPress={() => globals.openMailClient(this.state.adata.email1)} >
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Icon name="ios-mail" style={{ fontSize: 20, color: '#fff' }} />
                                                    <Text style={{ marginLeft: 10, color: '#fff' }}>{this.state.adata.email1} </Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    }

                                </View>

                            </View>

                            <Tabs tabBarUnderlineStyle={{ backgroundColor: '#ffbc00' }} renderTabBar={() => <ScrollableTab tabsContainerStyle={{ backgroundColor: globals.colors.color_primary }} />}>
                                <Tab style={{ backgroundColor: globals.colors.color_primary }} activeTabStyle={{ backgroundColor: globals.colors.color_primary, borderColor: globals.colors.color_primary }} activeTextStyle={{ fontSize: 14, color: '#fff' }} tabStyle={{ backgroundColor: globals.colors.color_primary }} textStyle={{ fontSize: 14, color: '#fff' }} heading="BASIC INFO">
                                    {this.state.loading == false &&
                                        <BasicInfoAccount data={this.state.adata} />
                                    }
                                </Tab>
                                <Tab style={{ backgroundColor: globals.colors.color_primary }} activeTabStyle={{ backgroundColor: globals.colors.color_primary, borderColor: globals.colors.color_primary }} activeTextStyle={{ fontSize: 14, color: '#fff' }} tabStyle={{ backgroundColor: globals.colors.color_primary }} textStyle={{ fontSize: 14, color: '#fff' }} heading="APPOINTMENTS">
                                    <AppointmentsAccount data={this.state.adata} />
                                </Tab>

                                <Tab style={{ backgroundColor: globals.colors.color_primary }} activeTabStyle={{ backgroundColor: globals.colors.color_primary, borderColor: globals.colors.color_primary }} activeTextStyle={{ fontSize: 14, color: '#fff' }} tabStyle={{ backgroundColor: globals.colors.color_primary }} textStyle={{ fontSize: 14, color: '#fff' }} heading="DOCUMENTS">
                                    <Photos data={this.state.images_data} module_id={this.state.adata.id} 
                                        navigator = {this.props.navigator}/>
                               </Tab>

                                <Tab style={{ backgroundColor: globals.colors.color_primary }} activeTabStyle={{ backgroundColor: globals.colors.color_primary, borderColor: globals.colors.color_primary }} activeTextStyle={{ fontSize: 14, color: '#fff' }} tabStyle={{ backgroundColor: globals.colors.color_primary }} textStyle={{ fontSize: 14, color: '#fff' }} heading="HISTORY">
                                    <HistoryAccount data={this.state.adata} />
                                </Tab>

                            </Tabs>
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
        assigned_user_id: state.auth.assigned_user_id,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login, logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(AccountDetails);