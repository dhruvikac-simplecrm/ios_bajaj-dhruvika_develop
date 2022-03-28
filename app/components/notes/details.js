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
    TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Spinner, Content, Form, Item, Picker, Input, Label, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login, logout , updateToken} from '../../actions/auth';
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
import apiCallForToken from '../../controller/ApiCallForToken';
const deviceWidth = Dimensions.get("window").width;
// let titleTextField = null

class NoteDetails extends Component {


    constructor(props) {
        super(props);
        // this.updateRef = this.updateRef.bind(this, 'input');
        this.titleTextField = null;
        this.state = {
            loading: false,
            disable: false,
            title: this.props.data.name,
            description: this.props.data.description,
            note: this.props.data,
            isEditable: this.props.isEditable,
        }

        this.setButton(false)

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));//to add click event onto the buttons defined

        this.props.navigator.setDrawerEnabled({
            side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
            enabled: true // should the drawer be enabled or disabled (locked closed)
        });
    }

    setButton(isDisable) {
        let buttonName;
        let rightButtons = [
            {
                id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                disabled: isDisable, // optional, used to disable the button (appears faded and doesn't interact)
                disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                systemItem: buttonName
            },
            // {
            //     id: 'delete', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
            //     testID: 'e2e_delete', // optional, used to locate this view in end-to-end tests
            //     disabled: isDisable, // optional, used to disable the button (appears faded and doesn't interact)
            //     disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
            //     buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
            //     buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
            //     systemItem: 'trash'
            // }
        ]

        if (this.state.isEditable) {
            buttonName = 'save'
             rightButtons = [
                {
                    id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                    disabled: isDisable, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    systemItem: buttonName
                }
            ]
        } else {
            buttonName = 'edit'
          rightButtons = [
                {
                    id: 'edit', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                    disabled: isDisable, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    systemItem: buttonName
                },
                {
                    id: 'delete', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    testID: 'e2e_delete', // optional, used to locate this view in end-to-end tests
                    disabled: isDisable, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    systemItem: 'trash'
                }
            ]
        }

        this.props.navigator.setButtons({
            leftButtons: [
                {
                    id: 'back',
                    title: 'Notes',
                    testID: 'back',
                    icon: require('../../../images/icon_left30.png'), // for icon button, provide the local image asset name
                    buttonFontSize: 16,
                    buttonFontWeight: '600',
                }
            ],
            rightButtons: rightButtons, // see "Adding buttons to the navigator" below for format (optional)


            animated: true // does the change have transition animation or does it happen immediately (optional)
        });
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.type == 'NavBarButtonPress') {
            // this is the event type for button presses
            if (event.id == 'edit') { // this is the same id field from the static navigatorButtons definition
                if (this.state.isEditable) {
                    // Edit screen, save button clicked
                    this.save();

                } else {
                    // View screen, edit button clicked
                    this.setState({ isEditable: !this.state.isEditable })
                    this.setButton(false)
                    console.log("titleTextField: " + this.titleTextField.isFocused)
                    this.titleTextField.focus()
                }

            }

            if(event.id == 'delete'){
                Alert.alert(
                    'Delete',
                    'Are you sure you want to delete this Note?',
                    [
                        {
                            text: 'OK',
                            onPress: () => this.delete(this.props.data.id)
                        },
                        { text: 'Cancel', style: 'cancel' },
                    ],
                    { cancelable: false }
                )
            }


            if (event.id == 'back') {
                this.goBack()    
            }

        }
    }

    disableSaveButton(isEnable) {
       this.setButton(isEnable)
    }

    save() {
        let proceed = true;
        if (this.state.title === undefined || this.state.title == '') {
            proceed = false;
            Alert.alert('Error', 'Please enter title for the note!');
            return
        }
      
        this.setState({ isEditable: false })
        this.setButton(false)

        if (proceed) {
            this.disableSaveButton(true);
            this.setState({ loading: true });
            this.setState({ disable: true });

            let url = globals.home_url + "/uupdate"
                + "?token_id=" + this.props.token
                + "&module_name=" + globals.notes
                + "&id=" + this.props.data.id
                + "&name=" + this.state.title
                + "&description=" + this.state.description
                + "&assigned_user_id=" + this.props.assigned_user_id
                + "&assigned_user_name=" + this.props.username
                + "&parent_type=" + globals.accounts
                + "&parent_id="
                + "&url=" + this.props.url;

            console.log("url = " + url)

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
                            note_id: response.data.result.id//this id is required to set attachments to this note

                        })
                        // now, redirect it to detailed view 
                        alert("Note saved successfully!")

                        this.setState({note: response.data.result, title:response.data.result.name, description: response.data.result.description})
                       
                        this.disableSaveButton(false);
                        this.setState({ loading: false });

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
                                this.disableSaveButton(false);
                                this.setState({ loading: false });
                                this.setState({ isEditable: true })
        
                                return;
                            }
                            //Create note, after session generated
                            this.save()
        
                        }).catch(error => {
                            console.log("getToken: error = " + error)
                            this.disableSaveButton(false);
                            this.setState({ loading: false });
                            this.setState({ isEditable: true })
    
                        })

                        
                    } else {
                        Alert.alert('Error', response.message);
                        this.setState({ isEditable: true })
                        this.disableSaveButton(false);
                        this.setState({ loading: false });
                        this.setState({ isEditable: true })


                    }

                })

                .catch(err => {
                    console.log(err);
                    this.setState({ isEditable: true })
                    this.disableSaveButton(false);
                    this.setState({ loading: false });
                    this.setState({ isEditable: true })

                });


        }

    }

    delete(id){
        this.disableSaveButton(true);

        this.setState({ loading: true });
        this.setState({ disable: true });
        let url = globals.home_url + "/udestroy" + "?token_id=" + this.props.token + "&id=" + id 
        + "&module_name=" + globals.notes
        + "&url="+this.props.url;
        
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
                console.log("Delete Note Response: ")
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    if (response.data.result) {
                        this.goBack();
                    }

                }else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    Alert.alert(
                        globals.app_messages.error_string,
                        globals.app_messages.token_expired,
                        [
                        { text: globals.login, onPress: () => this.props.logout() }
                                   ],
                        { cancelable: false }
                    )

                }  else {
                    Alert.alert('Error', response.data.description);
                }

            })
            .then(() => {
                this.disableSaveButton(false);
                this.setState({ dataHasValue: true });
                this.setState({ loading: false });
            })
            .catch(err => {
                this.disableSaveButton(false);
                console.log(err);
            });

    }

    goBack() {
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'app.Notes',
                title: 'Notes',
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
            // this.state.textFieldName.blur() 
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handler)
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handlerHide)
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }


    componentDidMount() {
        if(this.state.isEditable){
            console.log("titleTextField: " + this.titleTextField.isFocused)
           this.titleTextField.focus()
        }
    }
    // setFocus = () => {
    //     this._textInput.;
    //   }

    updateRef(name, ref) {
        this[name] = ref;
    }

    render() {

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
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 0 }} >

                            <View style={{ flex: 1, marginTop: 0, marginRight: 10, marginLeft: 10 }} >
                                <TextField
                                    editable={this.state.isEditable}
                                    label='Note Title*'
                                    autoCapitalize='none'
                                    value={this.state.note.name}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ title: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    blurOnSubmit={true}
                                    placeholderTextColor='#000'
                                    ref={(refer) => this.titleTextField = refer}
                                />

                                <TextField
                                    editable={this.state.isEditable}
                                    label='Details'
                                    autoCapitalize='none'
                                    value={this.state.note.description}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ description: text })}
                                    textColor='#000'
                                    tintColor='red'
                                    blurOnSubmit={true}
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
        password: state.auth.password,
        assigned_user_id: state.auth.assigned_user_id,
        url: state.auth.url,

    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login, logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(NoteDetails);