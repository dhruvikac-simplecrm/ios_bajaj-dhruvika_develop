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
    FlatList, WebView, Platform
} from 'react-native';
import OpenFile from 'react-native-doc-viewer';

import { connect } from 'react-redux';

import { Container, Spinner, Content, Tab, Tabs, ScrollableTab, Button, Icon, Text, Card } from 'native-base';
import { login } from '../../../actions/auth';
import { logout , updateToken} from '../../../actions/auth';

import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';

import globals from "../../../globals";
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import apiCallForToken from '../../../controller/ApiCallForToken';

class AttachmentDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            disable: false,
            base64StringOfFile: ""
        }

        this.props.navigator.setButtons({
            rightButtons: [
            ], // see "Adding buttons to the navigator" below for format (optional)

            leftButtons: [
                {
                    id: 'back',
                    title: 'Back',
                    testID: 'back',
                    icon: require('../../../../images/icon_left30.png'), // for icon button, provide the local image asset name
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
            enabled: false // should the drawer be enabled or disabled (locked closed)
        });

    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.type == 'NavBarButtonPress') {
            // this is the event type for button presses

            if (event.id == 'back') {
                //AlertIOS.alert('SalesMobi', 'Back button pressed');
                this.goBack();

            }

        }
    }

    componentDidMount() {
        this.getAttachedPhotos(this.props.data)
    }

    getAttachedPhotos(note) {
        this.showLoader()

        let url = globals.home_url + "/getAttachment"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&id=" + note.id
            + "&url=" + this.props.url;

        console.log("getAttachedPhotos: URL: " + url)

        fetch(url, {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        })
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                console.log('Note: Attachments Response:');
                console.log(response);

                if (response.success === true) {

                    console.log("base64StringOfFile: " + this.state.base64StringOfFile)

                    this.setState({ base64StringOfFile: response.data.result.note_attachment.file })
                    console.log("After updating base64StringOfFile: " + this.state.base64StringOfFile)
                    this.handlePressb64()
                } else if (response.data.number === 11) {
                    // Alert.alert(
                    //     'Alert',
                    //     'Your session has been expired. Login again to continue.',
                    //     [
                    //     { text: 'Ok', onPress: () => this.props.logout() }
                    //                ],
                    //     { cancelable: false }
                    // )


                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.hideLoader()
    
                            return;
                        }
                        //Get attached photo, after session generated
                        this.getAttachedPhotos(note)
    
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.hideLoader()
    
                    })

                } else {
                    Alert.alert('Error', response.message);
                    this.hideLoader()

                }

            })
            .catch(err => {
                console.log(err);
                this.hideLoader()
            });
    }


    handlePressb64 = () => {
        //Doc-Viewer supports these formats: pdf, png, jpg, xls, doc, ppt, xlsx, docx, pptx etc
        // const fileFormat = this.props.data.filename.split()
        const [filename, fileExtension] = this.props.data.filename.split(/\.(?=[^\.]+$)/);
        console.log("FileName = " + filename + "FileExtention = " + fileExtension);

        if (Platform.OS === 'ios') {
            OpenFile.openDocb64([{
                base64: this.state.base64StringOfFile,
                fileName: this.props.data.filename,
                fileType: fileExtension
            }], (error, url) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(url)
                }
            })
        } else {
            //Android
            OpenFile.openDocb64([{
                base64: "{BASE64String}",
                fileName: "sample",
                fileType: "png",
                cache: true /*Use Cache Folder Android*/
            }], (error, url) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(url)
                }
            })
        }
    }

    hideLoader() {
        this.setState({
            loading: false
        })
    }

    showLoader() {
        this.setState({
            loading: true
        })
    }


    goBack() {
        this.props.navigator.pop(this.props.screen)
    }

    render() {
        return (
            <View>
                {/*  */}
                {this.state.loading &&
                    <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, marginTop: 20 }}>
                        <Spinner color='red' />
                    </View>
                }

                {this.state.loading == false && this.state.disable == true &&
                    <View>
                        <Text >{this.props.data.file_mime_type}</Text>
                        {/* source = {{uri:"data:image/jpg;base64,"}} */}
                        <Image
                            // source = {{uri:"data:image/png;base64,"+ this.state.base64StringOfFile}}
                            source={{ uri: "data:image/*" + ";base64," + this.state.base64StringOfFile }}
                            style={{ width: "100%", height: 300, resizeMode: "contain", resizeMethod: "resize", justifyContent: "center", alignSelf: "center" }} />

                        {/* <WebView source={{uri:"data:"+this.props.data.file_mime_type+";base64," + this.state.base64StringOfFile}}
                  style = {{width:"100%", height:300, resizeMode: "contain", resizeMethod:"resize"}}/> */}

                    </View>
                }
            </View>
        )
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
    return bindActionCreators({ login, logout , updateToken}, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(AttachmentDetails);