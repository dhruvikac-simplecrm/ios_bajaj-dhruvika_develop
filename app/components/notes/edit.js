// import React, { Component } from 'react';
// import {
//     View,
//     Alert,
//     TextInput,
//     Dimensions,
//     StatusBar,
//     Image,
//     AlertIOS,
//     TouchableHighlight,
//     Keyboard,
//     ActionSheetIOS,
//     TouchableOpacity
// } from 'react-native';
// import { connect } from 'react-redux';

// import { Container, Header, Title, Spinner, Content, Form, Item, Picker, Input, Label, Button, Left, Right, Body, Icon, Text } from 'native-base';
// import { login, logout } from '../../actions/auth';
// import { bindActionCreators } from 'redux';
// import styles from './style';
// import { Navigation } from 'react-native-navigation';
// import FontAwesome, { Icons } from 'react-native-fontawesome';
// import globals from '../../globals';
// import { Dropdown } from 'react-native-material-dropdown';//go to https://github.com/n4kz/react-native-material-dropdown#readme for more info
// const deviceHeight = Dimensions.get("window").height;
// const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
// import {
//     TextField
// } from 'react-native-material-textfield';// go to https://github.com/n4kz/react-native-material-textfield for more info
// import ImagePicker from 'react-native-image-crop-picker';// go to https://github.com/ivpusic/react-native-image-crop-picker for more info
// const deviceWidth = Dimensions.get("window").width;

// class EditNote extends Component {


//     constructor(props) {
//         super(props);
// this.titleTextField = null;

//         this.state = {
//             loading: false,
//             disable: false,
//             title: this.props.data.name,
//             description: this.props.data.description,
//             note: this.props.data,
//         }


//         this.props.navigator.setButtons({
//             rightButtons: [
//                 {
//                     id: 'save', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
//                     testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
//                     disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
//                     disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
//                     buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
//                     buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
//                     buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
//                     systemItem: 'save'
//                 }
//             ], // see "Adding buttons to the navigator" below for format (optional)


//             animated: true // does the change have transition animation or does it happen immediately (optional)
//         });

//         this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));//to add click event onto the buttons defined



//         this.props.navigator.setDrawerEnabled({
//             side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
//             enabled: true // should the drawer be enabled or disabled (locked closed)
//         });
//     }

   
//     onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

//         if (event.type == 'NavBarButtonPress') {
//             // this is the event type for button presses
//             if (event.id == 'save') { // this is the same id field from the static navigatorButtons definition
//                 //AlertIOS.alert('SalesMobi', 'You pressed search button');
//                 this.save();
           
//             }
//         }
//     }

//     disableSaveButton(isEnable) {
//         this.props.navigator.setButtons({
//             rightButtons: [
//                 {
//                     id: 'save', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
//                     testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
//                     disabled: isEnable, // optional, used to disable the button (appears faded and doesn't interact)
//                     disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
//                     buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
//                     buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
//                     buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
//                     systemItem: 'save'
//                 }
//             ], // see "Adding buttons to the navigator" below for format (optional)


//             animated: true // does the change have transition animation or does it happen immediately (optional)
//         });
//     }

//     save() {
//         let proceed = true;
//         if (this.state.title === undefined || this.state.title == '') {
//             proceed = false;
//             Alert.alert('Error', 'Please enter title for the note!');
//         } 

//         if (proceed) {
//             this.disableSaveButton(true);
//             this.setState({ loading: true });
//             this.setState({ disable: true });
        
//                 let url = globals.home_url + "/uupdate"
//                     + "?token_id=" + this.props.token 
//                     + "&module_name=" + globals.notes 
//                     + "&id="+this.props.data.id
//                     + "&name=" + this.state.title 
//                     + "&description=" +this.state.description 
//                     + "&assigned_user_id=" + this.props.assigned_user_id 
//                     + "&assigned_user_name=" + this.props.username 
//                     + "&parent_type=" + globals.accounts 
//                     + "&parent_id=" 
//                     + "&url="+this.props.url;
        
//                 fetch(url, {
//                     method: "GET",
//                     dataType: 'jsonp',
//                     headers: {
//                         'Content-Type': 'application/x-www-form-urlencoded',
//                         'Accept': 'application/json'
//                     },
//                 })
//                     .then((response) => {
//                         return response.json() // << This is the problem
//                     })
//                     .then((response) => {
        
//                         console.log('Note Response');
//                         console.log(response);
//                         proceed = true;
//                         if (response.success === true) {
//                             this.setState({
//                                 note_id: response.data.result.id//this id is required to set attachments to this note
        
//                             })
//                             // now, redirect it to detailed view 
//                             alert("Note created! id = "+response.data.result.id)
//                             this.disableSaveButton(false);
//                             this.setState({ loading: false });

//                         } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
//                             Alert.alert(
//                                 globals.app_messages.error_string,
//                                 globals.app_messages.token_expired,
//                                 [
//                                 { text: globals.login, onPress: () => this.props.logout() }
//                                            ],
//                                 { cancelable: false }
//                             )
//                             this.disableSaveButton(false);
//                             this.setState({ loading: false });

//                         } else {
//                             Alert.alert('Error', response.message);
//                             this.disableSaveButton(false);
//                             this.setState({ loading: false });

//                         }
        
//                     })
                    
//                     .catch(err => {
//                         console.log(err);
//                         this.disableSaveButton(false);
//                         this.setState({ loading: false });
//                     });
        
        
//         }

//     }



//     //! this function is not in use
//     goBack() {
//         this.props.navigator.pop({
//             animated: true, // does the pop have transition animation or does it happen immediately (optional)
//             animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
//         });
//     }

//     hideKeyBoard = () => {
//         Keyboard.dismiss()
//     }

//     componentWillMount() {
//         const handler = (e) => {
//             console.log("handler e = " + e)
//             if (this.state.modal) { this.onPress(null) }
//         }
//         const handlerHide = (e) => {
//             console.log("handlerHide e = " + e)

//             if (this.state.modal) {
//                 this.onPress(null)
//             }
//             // this.state.textFieldName.blur() 
//         }
//         this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', handler)
//         this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', handlerHide)
//     }

//     componentWillUnmount() {
//         this.keyboardDidShowListener.remove()
//         this.keyboardDidHideListener.remove()
//     }

  
//     componentDidMount() {
//         this.titleTextField.focus()
//     }
   

//     render() {

//         return (
//             <Container>
//                 {/* enableResetScrollToCoords & keyboardShouldPersistTaps these props plays important role in scrolling and popup positioning */}
//                 <Content enableResetScrollToCoords={false} keyboardShouldPersistTaps="never">
//                     {this.state.loading &&
//                         <View style={[styles.content, { marginTop: containerHeight / 3 }]}>
//                             <Spinner color='red' />
//                         </View>
//                     }
//                     {this.state.loading===false &&
//                     <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 0 }} >

//                         <View style={{ flex: 1, marginTop: 0, marginRight: 10, marginLeft: 10 }} >
//                             <TextField
//                                 label='Note Title*'
//                                 autoCapitalize='none'
//                                 value={this.state.note.name}
//                                 style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
//                                 onChangeText={(text) => this.setState({ title: text })}
//                                 textColor='#000'
//                                 tintColor='red'
//                                 blurOnSubmit={true}
//                                 placeholderTextColor='#000'
//                                 ref = {(refer)=> this.titleTextField = refer}

//                             />

//                             <TextField
//                                 label='Details'
//                                 autoCapitalize='none'
//                                 value={this.state.note.description}
//                                 style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
//                                 onChangeText={(text) => this.setState({ description: text })}
//                                 textColor='#000'
//                                 tintColor='red'
//                                 blurOnSubmit={true}
//                                 placeholderTextColor='#000'
//                             />

//                         </View>


//                     </View>

//                     }
//                 </Content>
//             </Container>

//         );
//     }


// }

// const mapStateToProps = (state, ownProps) => {
//     return {
//          isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
//         token: state.auth.token,
//         username: state.auth.username,
//         assigned_user_id: state.auth.assigned_user_id,
//         url: state.auth.url,

//     };
// }

// const mapDispatchToProps = (dispatch) => {
//     return bindActionCreators({ login , logout}, dispatch)
// };

// export default Login = connect(mapStateToProps, mapDispatchToProps)(EditNote);