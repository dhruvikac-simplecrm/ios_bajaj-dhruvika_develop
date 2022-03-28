import React, { Component } from 'react';
import {
    View,
    Alert,
    Image,
    TextInput,
    AlertIOS,
    Switch,
    Modal,
    StatusBar,
    TouchableHighlight,
    ActionSheetIOS,
    Dimensions,
    FlatList, ScrollView
} from 'react-native';

import { connect } from 'react-redux';

import { Container, Spinner, Content, Tab, Tabs, ScrollableTab, Button, Icon, Text, Card } from 'native-base';
import { login, logout, updateToken } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Navigation } from 'react-native-navigation';
import ImagePicker from 'react-native-image-crop-picker';

import LeadsBasicInfo from './leadsBasicInfo';
import LeadsAppointments from "./leadsAppointments";
import LeadsDocuments from './leadsDocuments';
import LeadPhotos from "./leadPhotos"
import LeadHistory from './leadsHistory';
import globals from '../../globals';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import apiCallForToken from '../../controller/ApiCallForToken';

/**
 * actionButton : TopBar button, is used to handle multiple actions in the module like creating meeting, call, task etc
 */
const actionButton = {
    id: 'action',
    testID: 'e2e_action',
    disableIconTint: true,
    buttonFontSize: 14,
    buttonFontWeight: '600',
    systemItem: 'add'
}

/**
 * editButton : TopBar button, is used to edit the module
 */
const editButton = {
    id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
    testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
    disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
    buttonColor: 'white',
    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
    systemItem: 'edit',
}

/**
 * backButton : TopBar button, is used in top bar to handle the back navigation
 */
const backButton = {
    id: 'back',
    title: 'Leads',
    testID: 'back',
    icon: require('../../../images/icon_left30.png'), // for icon button, provide the local image asset name
    buttonFontSize: 16,
    buttonFontWeight: '600',
}

const createFormData = (photo) => {
    const data = new FormData();

    data.append("contents", {
        name: photo.filename,
        type: photo.mime,
        uri: photo.sourceURL
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
    });


    return data;
};


const createFormDataForDocument = (document) => {
    const data = new FormData();

    data.append("contents", {
        name: document.fileName,
        type: 'mime',
        uri: document.uri
    });


    return data;
};

let tagName = globals.tagName;

class Details extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            disable: false,
            submitLoading: true,
            username: '',
            password: '',
            ldata: '',
            modalVisible: false,
            switch_account: true,
            switch_contact: true,
            switch_opportunity: false,

            imageTagModalVisible: false,
            imageTagArray: [],
            photo: '',
            document: '',
            images_data: [],
            image_url: '',
            note_id: '',
            profile_pic: '',

            rButtons: [
                actionButton
            ]
        }

        //setup top bar left/right buttons
        this.setTopBarButtons()

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

        //this.getDetails();
    }

    setTopBarButtons() {
        this.props.navigator.setButtons({
            rightButtons: this.state.rButtons, // see "Adding buttons to the navigator" below for format (optional)
            leftButtons: [
                backButton
            ],

            animated: true // does the change have transition animation or does it happen immediately (optional)
        });
    }

    // this method shows the edit option or hides it on top bar
    setModuleEditable(isEditable) {
        if (isEditable == true) {
            this.setState({
                rButtons: [
                    editButton, actionButton
                ]
            })
        } else {
            this.setState({
                rButtons: [
                    actionButton
                ]
            })
        }
        //set the top bar buttons accordingly
        this.setTopBarButtons()

    }


    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.type == 'NavBarButtonPress') {
            // this is the event type for button presses
            if (event.id == 'edit') { // this is the same id field from the static navigatorButtons definition
                //AlertIOS.alert('SalesMobi', 'You pressed search button');

                this.props.navigator.push({
                    screen: 'app.EditLead',
                    title: 'Edit Lead',
                    subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                    passProps: { data: this.state.ldata, photo: this.state.profile_pic }, // Object that will be passed as props to the pushed screen (optional)
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

                ActionSheetIOS.showActionSheetWithOptions({
                    options: ['Cancel', 'Schedule Meeting', 'Log Call', 'Create Task', 'Attach Images', 'Attach Documents'],
                    cancelButtonIndex: 0,
                },
                    (buttonIndex) => {

                        if (buttonIndex === 1) {
                            this.props.navigator.push({
                                screen: 'app.ScheduleMeetingLeads',
                                title: 'Schedule Meeting',
                                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                                passProps: { data: this.state.ldata }, // Object that will be passed as props to the pushed screen (optional)
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
                                screen: 'app.LogCallLead',
                                title: 'Log Call',
                                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                                passProps: { data: this.state.ldata }, // Object that will be passed as props to the pushed screen (optional)
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
                                screen: 'app.CreateTaskLead',
                                title: 'Create Task',
                                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                                passProps: { data: this.state.ldata }, // Object that will be passed as props to the pushed screen (optional)
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
                            //this.selectPhotos();
                        }
                        if (buttonIndex === 5) {

                            this.selectDocuments();

                        }
                        if (buttonIndex === 6) {

                            if (this.state.ldata.status === 'Converted') {
                                AlertIOS.alert('SalesMobi', 'This lead is already converted');
                            } else {
                                this.setModalVisible(true);
                            }




                        }
                    });

            }
            if (event.id == 'back') {
                //AlertIOS.alert('SalesMobi', 'Back button pressed');
                this.goBack();

            }

        }
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

    openCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            writeTempFile: false,
            cropping: true,
            includeBase64: true,
        }).then(image => {
            console.log('image: ', image);
            this.setState({
                image_url: image.data
            });


            //create a note for a single image
            this.createNoteForSingleImage(image);

        });

    }

    selectDocuments() {
        // iPhone/Android
        try {

            DocumentPicker.show({
                filetype: [DocumentPickerUtil.allFiles()],
            }, (error, res) => {
                try {
                    console.log("selectDocuments: error = " + error)

                    this.setState({
                        document: res
                    });

                    console.log(this.state.document);
                    this.createNoteForDocument(this.state.document);
                } catch (er) {

                    console.log("selectDocuments: er = " + er)
                    alert("selectDocuments: er = " + er)
                }

            });
        } catch (err) {
            console.log("selectDocuments: err = " + err)
            alert("selectDocuments: err = " + err)
        }

    }



    selectPhotos() {

        ImagePicker.openPicker({
            multiple: true,
            includeBase64: true
        }).then(images => {
            console.log('selected images:');
            console.log(images);
            this.setState({
                images_data: images,
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

        });
    }


    //create a note first for every single image selected and
    //get the id of that note to set attachments to that note
    addImageTagItem(image) {
        const obj = { 'image': image, 'tag': '' };
        this.setState({
            imageTagArray: [...this.state.imageTagArray, obj]
        });
    }


    //addImageTagItem() this function creates new array by linking image and tag together


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

    createNote(element, length, count) {
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
            //            "&name=" + "image " + count 
            "&name=" + tagName
            + "&description=" + "&assigned_user_id=" + this.props.assigned_user_id +
            "&assigned_user_name=" + this.props.username + "&parent_type=" + globals.leads +
            "&parent_id=" + this.state.ldata.id
            + "&url=" + this.props.url;

        console.log("createNote: url = " + url);

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

                console.log('createNote: Note Response');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    this.setState({
                        note_id: response.data.result.id//this id is required to set attachments to this note

                    })

                    this.uploadPhotos(photo, length, count, this.state.note_id);
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
                            this.setState({
                                imageTagArray: []
                            })
                            return;
                        }
                        //Create note, after session generated
                        this.createNote(element, length, count)
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ loading: false, disable: false });
                        this.setState({
                            imageTagArray: []
                        })
                    })


                } else {
                    Alert.alert('Error', response.message);
                    this.setState({
                        imageTagArray: []
                    })
                    this.setState({ loading: false, disable: false });

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
                this.setState({ loading: false, disable: false });
            });
    }


    createNoteForSingleImage(photo) {
        this.setState({ loading: true });
        this.setState({ disable: true });

        let url = globals.home_url + "/ustore"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&name=" + "image" + "&description=" + "&assigned_user_id=" + this.props.assigned_user_id +
            "&assigned_user_name=" + this.props.username + "&parent_type=" + globals.leads +
            "&parent_id=" + this.state.ldata.id
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
                        //Create note for single image, after session generated
                        this.createNoteForSingleImage(photo)
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ loading: false, disable: false });

                    })

                } else {
                    Alert.alert('Error', response.data.description);
                    this.setState({ loading: false, disable: false });

                }

            })
            // .then(() => {

            //     this.setState({ loading: false });
            // })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false, disable: false });

            });
    }



    createNoteForDocument(document) {

        this.setState({ loading: true });
        this.setState({ disable: true });

        let url = globals.home_url + "/ustore"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&name=" + document.fileName + "&description=" + "&assigned_user_id=" + this.props.assigned_user_id +
            "&assigned_user_name=" + this.props.username + "&parent_type=" + globals.leads +
            "&parent_id=" + this.state.ldata.id
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

                    this.uploadDocument(document, this.state.note_id);
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
                            this.setState({
                                imageTagArray: []
                            })
                            return;
                        }
                        //Create note for document, after session generated
                        this.createNoteForDocument(document)
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ loading: false, disable: false });
                        this.setState({
                            imageTagArray: []
                        })
                    })

                } else {
                    this.setState({
                        imageTagArray: []
                    })
                    this.setState({ loading: false, disable: false });

                    Alert.alert('Error', response.data.description);
                }

            })
            // .then(() => {

            //     this.setState({ loading: false });
            // })
            .catch(err => {
                this.setState({
                    imageTagArray: []
                })
                this.setState({ loading: false, disable: false });

                console.log(err);
            });

    }


    uploadPhotoForSingleImage(photo, id) {

        let image_url = globals.home_url + "/setAttachment"
            + "?token_id=" + this.props.token +
            // "&module_name=" + globals.notes +
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

    //set attachment to the note which is created for that particular image


    uploadPhotos(photo, length, i, id) {


        let image_url = globals.home_url + "/setAttachment"
            + "?token_id=" + this.props.token +
            // "&module_name=" + globals.notes +
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
                    this.setState({
                        disable: false,
                        imageTagArray: []
                    });
                    alert(length + " Images uploaded");

                }
            })
            .catch(error => {
                this.setState({ loading: false, imageTagArray: [] });
                console.log("upload error", error);
                //alert("Upload failed!");

            });
    }

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

    convertToContact(visible) {

        if (!visible) {
            this.props.navigator.push({
                screen: 'app.ConvertToContact',
                title: 'Convert to Contact',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { data: this.state.ldata }, // Object that will be passed as props to the pushed screen (optional)
                animated: true, // does the push have transition animation or does it happen immediately (optional)
                animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                backButtonTitle: 'Back', // override the back button title (optional)
                backButtonHidden: true, // hide the back button altogether (optional)
                navigatorStyle: {
                    navBarBackgroundColor: 'white',
                    navBarTextColor: '#0067ff',
                    navBarButtonColor: '#0067ff'

                }, // override the navigator style for the pushed screen (optional)

            });
        }


        this.setState({ modalVisible: visible });

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }



    convertToAccount(visible) {

        if (!visible) {
            this.props.navigator.push({
                screen: 'app.ConvertToAccount',
                title: 'Convert to Account',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { data: this.state.ldata, convertAccount: this.state.switch_account, convertContact: this.state.switch_contact, convertOpportunity: this.state.switch_opportunity }, // Object that will be passed as props to the pushed screen (optional)
                animated: true, // does the push have transition animation or does it happen immediately (optional)
                animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                backButtonTitle: 'Back', // override the back button title (optional)
                backButtonHidden: false, // hide the back button altogether (optional)
                navigatorStyle: {
                    navBarBackgroundColor: 'white',
                    navBarTextColor: '#0067ff',
                    navBarButtonColor: '#0067ff'
                }, // override the navigator style for the pushed screen (optional)
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
        this.setState({ modalVisible: visible });
    }
    convertToOpportunity(visible) {

        if (!visible) {
            this.props.navigator.push({
                screen: 'app.ConvertToOpportunity',
                title: 'Convert to Opportunity',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { data: this.state.ldata }, // Object that will be passed as props to the pushed screen (optional)
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
        }


        this.setState({ modalVisible: visible });

    }

    componentDidMount() {
        this.getDetails();
    }

    getDetails() {
        this.setState({ loading: true });
        this.setState({ disable: true });

        console.log('token');
        console.log(this.props.token);
        var data = [];
        var proceed = false;
        let url = globals.home_url + "/ushow" + "?token_id=" + this.props.token + "&id="
            + this.props.lead_id + "&module_name=" + globals.leads + "&fields="
            + globals.LEADS_DETAIL_VIEW_FIELDS
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

                console.log('Lead Details:');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    if (response.data.result) {
                        console.log('in result');
                        console.log("Props id: " + this.props.assigned_user_id)
                        console.log("Assigned id: " + response.data.result.assigned_user_id)
                        console.log("Props Name : " + this.props.username)
                        console.log("Assign Uname : " + response.data.result.assigned_user_name)
                        // if(response.data.result.assigned_user_id === this.props.assigned_user_id){
                        this.setModuleEditable(true)
                        // }else{
                        //    this.setModuleEditable(false)
                        // }
                        this.setState({ ldata: response.data.result });
                        console.log(this.state.ldata);
                        this.setState({ loading: false });
                        this.setState({ disable: false });

                        if (this.props.from_list) {
                            this.props.navigator.push({
                                screen: 'app.EditLead',
                                title: 'Edit Lead',
                                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                                passProps: { data: this.state.ldata, photo: this.state.profile_pic }, // Object that will be passed as props to the pushed screen (optional)
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
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.setState({ dataHasValue: true });
                            this.setState({ loading: false });
                            this.setState({ disable: false });
                            return;
                        }
                        //Get Lead details, after session generated
                        this.getDetails()
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ dataHasValue: true });
                        this.setState({ loading: false });
                        this.setState({ disable: false });
                    })

                } else {
                    Alert.alert('Error', response.data.description, () => { this.goBack() });
                    this.setState({ dataHasValue: true });
                    this.setState({ loading: false });
                    this.setState({ disable: false });
                }

            })
            .catch(err => {
                console.log(err);
                this.setState({ dataHasValue: true });
                this.setState({ loading: false });
                this.setState({ disable: false });
            });
    }

    goBack() {
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'app.Leads',
                title: 'Leads',
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

    sendToComponent(data) {
        // console.log('data as dadasdasdasd asdasdas')
        // console.log(data)
    }

    onSwitchToggledAccount(value) {

        this.setState({
            switch_account: value
        });
    }

    onSwitchToggledContact(value) {

        this.setState({
            switch_contact: value
        });
    }

    onSwitchToggledOpportunity(value) {

        this.setState({
            switch_opportunity: value
        });
    }

    delete(id) {

        //this.props.lead_id

        this.setState({ loading: true });
        this.setState({ disable: true });
        let url = globals.home_url + "/udestroy" + "?token_id=" + this.props.token + "&id=" + id
            + "&module_name=" + globals.leads
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
                this.setState({ disable: false });
            })
            .catch(err => {
                console.log(err);
            });

    }

    profilePhoto() {
        // let url = globals.demo_instance + "?entryPoint=image&id="
        let url = this.props.url + "index.php?entryPoint=image&id="
            + this.props.lead_id + "_photo&type=Leads"
            + "&url=" + this.props.url;
        console.log(url);
        fetch(url
            ,

            {
                method: "GET",
                dataType: 'jsonp',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },

            }

        )
            .then(response => response.json())
            .then((response) => {

                console.log('image string: ', response);
                this.setState({
                    profile_pic: response.content
                })
            })
    }

    getStatusColor(status) {
        switch (status) {
            case 'Open': return globals.lead_status_color.new;
            case 'Duplicate Lead': globals.lead_status_color.assigned
            case 'Existing Client': return globals.lead_status_color.inprocess
            case 'CSO Allocated': return globals.lead_status_color.recycled
            case 'RM Allocated': return globals.lead_status_color.rm_allocated
            case 'Converted': return globals.lead_status_color.converted
            case 'Lost': return globals.lead_status_color.dead
            case 'Appointment': return globals.lead_status_color.appointed
            case 'Follow Up': return globals.lead_status_color.follow_up
            case 'Cross Sell': return globals.lead_status_color.cross_sell

            default: return globals.lead_status_color.new
        }
    }

    render() {
        return (

            <Container style={{ backgroundColor: '#ffffff' }} >
                <Content>

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


                            {/* modal starts here */}
                            <View style={{ marginTop: 0 }}>
                                <Modal
                                    animationType="slide"
                                    transparent={false}
                                    visible={this.state.modalVisible}
                                    onRequestClose={() => {
                                        Alert.alert('Modal has been closed.');
                                    }}>

                                    <View style={{ marginTop: 22 }}>
                                        <View >

                                            <View style={{
                                                flex: 1, flexDirection: 'row', justifyContent: 'center',
                                                alignItems: 'stretch',
                                            }} >
                                                <View style={{ alignItems: 'center', justifyContent: 'center', width: deviceWidth, height: 50, backgroundColor: '#fff' }} >
                                                    <Text style={{
                                                        color: '#000', fontWeight: '600',
                                                        fontSize: 16
                                                    }} >Convert Into :</Text>
                                                </View>

                                            </View>
                                            <View style={{
                                                flex: 1, flexDirection: 'row', justifyContent: 'center',
                                                alignItems: 'stretch',
                                            }} >

                                            </View>

                                            <View style={{ marginTop: 50, alignItems: 'center', flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10 }} >
                                                <View style={{ flex: 1 }} >
                                                    <Text>ACCOUNT</Text>
                                                </View>
                                                <Switch

                                                    value={this.state.switch_account}
                                                // onValueChange={(value) => this.onSwitchToggledAccount(value)}
                                                ></Switch>
                                            </View>
                                            <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10 }} >
                                                <View style={{ flex: 1 }} >
                                                    <Text>CONTACT</Text>
                                                </View>
                                                <Switch

                                                    value={this.state.switch_contact}
                                                // onValueChange={(value) => this.onSwitchToggledContact(value)}
                                                ></Switch>
                                            </View>
                                            <View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10 }} >
                                                <View style={{ flex: 1 }} >
                                                    <Text>OPPORTUNITY</Text>
                                                </View>
                                                <Switch

                                                    value={this.state.switch_opportunity}
                                                    onValueChange={(value) => this.onSwitchToggledOpportunity(value)}
                                                ></Switch>
                                            </View>


                                            <View style={{
                                                flex: 1, flexDirection: 'row', justifyContent: 'center',
                                                alignItems: 'stretch', marginTop: 10
                                            }} >


                                                <Button danger style={{ width: 100, justifyContent: 'center', }} onPress={() => this.setModalVisible(!this.state.modalVisible)}>
                                                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}>Cancel</Text>
                                                </Button>

                                                <Button success style={{ width: 100, justifyContent: 'center', marginLeft: 20 }} onPress={() => this.convertToAccount(!this.state.modalVisible)}>
                                                    <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 16 }}>OK</Text>
                                                </Button>


                                            </View>

                                        </View>
                                    </View>
                                </Modal>

                            </View>

                            {/* end of the modal */}

                            <View>


                                {/* profile image code paddingTop:35*/}
                                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: globals.colors.color_primary, paddingTop: 0, paddingBottom: 20, paddingLeft: 10, paddingRight: 20 }}>

                                    <View style={{ flex: 0.3 }}>
                                        <View style={{ backgroundColor: globals.colors.white, width: 80, height: 80, marginTop: 15, marginLeft: 0, marginRight: 5, marginBottom: 5, borderRadius: 80, alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ ...{ fontSize: 30, fontWeight: 'bold', alignSelf: 'center', textAlign: 'center' }, color: this.getStatusColor(this.state.ldata.status) }}>{this.state.ldata.name != undefined && this.state.ldata.name != '' ? this.state.ldata.name.substr(0, 1).toUpperCase() : ''}</Text>
                                        </View>
                                    </View>

                                    <View style={{ flex: 0.7, marginLeft: 0, marginTop: 10 }}>
                                        <Text style={styles.detailViewHeader}>{this.state.ldata.name}</Text>

                                        {this.state.ldata.phone_mobile &&
                                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }} >
                                                <TouchableHighlight
                                                    underlayColor='transparent'
                                                    onPress={() => globals.makeAPhoneCall(this.state.ldata.phone_home)} >
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Icon name="md-phone-portrait" style={{ fontSize: 20, color: '#fff' }} />
                                                        <Text style={{ marginLeft: 10, color: '#fff' }}>{this.state.ldata.phone_mobile} </Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        }

                                        {this.state.ldata.email1 &&
                                            <View style={{ flex: 1, flexDirection: 'row', marginTop: 10 }} >
                                                <TouchableHighlight
                                                    underlayColor='transparent'
                                                    onPress={() => globals.openMailClient(this.state.ldata.email1)} >
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Icon name="ios-mail" style={{ fontSize: 20, color: '#fff' }} />
                                                        <Text style={{ marginLeft: 10, color: '#fff' }}>{this.state.ldata.email1} </Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>
                                        }

                                    </View>
                                </View>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: globals.colors.color_primary }}>

                                <Tabs tabBarUnderlineStyle={{ backgroundColor: '#ffbc00' }}
                                    renderTabBar={() => <ScrollableTab tabsContainerStyle={{ backgroundColor: globals.colors.color_primary }} />}>


                                    <Tab
                                        activeTabStyle={{ backgroundColor: globals.colors.color_primary }}
                                        activeTextStyle={{ fontSize: 14, color: '#fff' }}
                                        tabStyle={{ backgroundColor: globals.colors.color_primary, margin: 0 }}
                                        textStyle={{ fontSize: 14, color: '#fff' }}
                                        heading={"BASIC INFO" + ' '}>
                                        <LeadsBasicInfo data={this.state.ldata} />
                                    </Tab>
                                    <Tab
                                        activeTabStyle={{ backgroundColor: globals.colors.color_primary }}
                                        activeTextStyle={{ fontSize: 14, color: '#fff' }}
                                        tabStyle={{ backgroundColor: globals.colors.color_primary, margin: 0 }}
                                        textStyle={{ fontSize: 14, color: '#fff' }} heading={"APPOINTMENTS" + ' '}>
                                        <LeadsAppointments data={this.state.ldata} />
                                    </Tab>
                                    <Tab
                                        activeTabStyle={{ backgroundColor: globals.colors.color_primary }}
                                        activeTextStyle={{ fontSize: 14, color: '#fff' }}
                                        tabStyle={{ backgroundColor: globals.colors.color_primary, margin: 0 }}
                                        textStyle={{ fontSize: 14, color: '#fff' }} heading={"DOCUMENTS" + ' '}>

                                        {/* Instead of two tabs, show only one for document and images */}
                                        <LeadPhotos data={this.state.images_data} module_id={this.state.ldata.id}
                                            navigator={this.props.navigator} />

                                    </Tab>
                                    <Tab
                                        activeTabStyle={{ backgroundColor: globals.colors.color_primary }}
                                        activeTextStyle={{ fontSize: 14, color: '#fff' }}
                                        tabStyle={{ backgroundColor: globals.colors.color_primary, margin: 0 }}
                                        textStyle={{ fontSize: 14, color: '#fff' }} heading={"HISTORY" + ' '}>
                                        <LeadHistory data={this.state.ldata} />
                                    </Tab>

                                </Tabs>

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
        assigned_user_id: state.auth.assigned_user_id,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login, logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Details);