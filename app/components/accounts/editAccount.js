import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Dimensions,
    StatusBar,
    Image,
    AlertIOS,
    TouchableHighlight, TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Form, Spinner, Item, Picker, Input, Label, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login, logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import globals from '../../globals';
import { Dropdown } from 'react-native-material-dropdown';
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
import {
    TextField
} from 'react-native-material-textfield';
import RNGooglePlaces from 'react-native-google-places';

//* this is a separate file to edit account details
class EditAccount extends Component {


    constructor(props) {
        super(props);//this variable contains the details of the account

        this.state = {
            loading: false,
            disable: false,
            aname: this.props.data.name,
            aofficephone: this.props.data.phone_office,
            awebsite: this.props.data.website,
            aemail: this.props.data.email1,
            adetails: this.props.data.description,
            aannual_revenu: this.props.data.annual_revenue,
            aaccount_type: this.props.data.account_type,
            astreet: this.props.data.billing_address_street,
            acity: this.props.data.billing_address_city,
            astate: this.props.data.billing_address_state,
            acountry: this.props.data.billing_address_country,
            apostal_code: this.props.data.billing_address_postalcode,
            acompany_name: '',
            aaccount_type: this.props.data.account_type,
            adata: '',
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
                this.update();//this method will update the details
            }
        }
    }

    //disable the button if clicked once to avoid creating multiple records

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

    //this will update the account details
    update() {
        let proceed = true;
        if (this.state.aname === undefined || this.state.aname == '') {
            proceed = false;
            Alert.alert('Validation Error', 'Please enter Account Name!');

        } 
        // else if (this.state.aofficephone.length > 0 && this.state.aofficephone.length < 10) {
        //     if (!globals.validateMobile(this.state.aofficephone)) {
        //         proceed = false;
        //         Alert.alert('Validation Error', 'Phone number should not be less than 10 digits');
        //     }

        // } 
        else if (this.state.aofficephone.length == 15) {
            if (!globals.validateMobile(this.state.aofficephone)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid Phone Number');
            }
        }
        
        else if(this.state.aofficephone.length > 15){
            proceed = false;
            Alert.alert('Validation Error', 'Phone number should not be more than 15 digits');
        }
        else if (this.state.aemail.length > 0) {
            if (!globals.validateEmail(this.state.aemail)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid email id');
            }

        }


        if (proceed) {

            this.disableButton();
            this.setState({ loading: true });
            this.setState({ disable: true });
            console.log('Assigned User ID')
            console.log(this.props.assigned_user_id);
            console.log(this.props.username);

            let apiurl = globals.home_url + "/uupdate" +
                "?token_id=" +
                this.props.token +
                "&id=" +
                this.props.data.id +
                "&module_name=" +
                globals.accounts +
                "&name=" +
                this.state.aname +
                "&phone_office=" +
                this.state.aofficephone +
                "&website=" +
                this.state.awebsite +
                "&email1=" +
                this.state.aemail +
                "&description=" +
                this.state.adetails +
                "&annual_revenue=" +
                this.state.aannual_revenu +
                "&account_type=" +
                this.state.aaccount_type +
                "&billing_address_street=" +
                this.state.astreet +
                "&billing_address_city=" +
                this.state.acity +
                "&billing_address_state=" +
                this.state.astate +
                "&billing_address_postalcode=" +
                this.state.apostal_code +
                "&billing_address_country=" +
                this.state.acountry + "&assigned_user_name=" +
                this.props.username + "&assigned_user_id=" +
                this.props.assigned_user_id
                + "&url="+this.props.url;

            console.log('create account url');

            console.log(apiurl);
            aaccount_id = '';
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
                    console.log(' update account response:');
                    console.log(response);
                    proceed = true;

                    if (response.success === true) {

                        aaccount_id = response.data.result.id;

                        this.props.navigator.push({
                            screen: 'app.AccountDetails',
                            title:'Client',
                            passProps: { account_id: aaccount_id }, // Object that will be passed as props to the pushed screen (optional)
                            animated: true, // does the push have transition animation or does it happen immediately (optional)
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
                    Alert.alert('Error', 'Oops! Something went wrong, please try again.');
                });
        }
    }



    //! this function is not in used
    goBack() {
        this.props.navigator.pop({
            animated: true, // does the pop have transition animation or does it happen immediately (optional)
            animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the pop have different transition animation (optional)
        });
    }


    onValueChange(value) {

        this.setState({
            accountType: value
        });
    }

    setAddress(place){

        this.setState({
            astreet: place.name
        });
        this.setState({
            address_array: place.addressComponents
        });
        this.state.address_array.forEach(element => {
            console.log(element);
            if(element.types[0]=== 'postal_code'){
                this.setState({
                    apostal_code: element.name
                });
            }
            
            if(element.types[0]=== 'country'){
                this.setState({
                    acountry: element.name
                });
            }

            if(element.types[0]=== 'administrative_area_level_1'){
                this.setState({
                    astate: element.name
                });
            }

            if(element.types[0]=== 'locality'){
                this.setState({
                    acity: element.name
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



    //dropdown values stated in the globals.js file press ctrl/command and hover to go to the definition
    accountnamedropdown = globals.contactAccountItems;

    render() {
        return (
            <Container>
                <Content enableResetScrollToCoords = {false} keyboardShouldPersistTaps="never">

                    {this.state.loading &&
                        <View style={[styles.content, { marginTop: containerHeight / 3 }]}>
                            <Spinner color='red' />
                        </View>
                    }

                    <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }} >

                        <TextField
                            label='Name*'
                            autoCapitalize='none'
                            value={this.state.aname}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ aname: text })}
                            textColor='#000'
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Office Phone'
                            autoCapitalize='none'
                            keyboardType='phone-pad'
                            value={this.state.aofficephone}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ aofficephone: text })}
                            textColor='#000'
                            maxLength={15}
                            characterRestriction={15}
                            keyboardType='phone-pad'
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Website'
                            autoCapitalize='none'
                            value={this.state.awebsite}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ awebsite: text })}
                            textColor='#000'
                            keyboardType='url' //!for ios only
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Email'
                            autoCapitalize='none'
                            value={this.state.aemail}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ aemail: text })}
                            textColor='#000'
                            keyboardType='email-address'
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Details'
                            autoCapitalize='none'
                            value={this.state.adetails}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ adetails: text })}
                            textColor='#000'
                            multiline={true}
                            // maxLength={150}
                            // characterRestriction={150}
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Annual Revenue'
                            autoCapitalize='none'
                            value={this.state.aannual_revenu}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ aannual_revenu: text })}
                            textColor='#000'
                            keyboardType='decimal-pad'
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <Dropdown
                            label='Account Type'
                            data={this.accountnamedropdown}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(value) => { this.setState({ aaccount_type: value }) }}
                            value={this.state.aaccount_type}
                        />

                        <View style={{ flex:1,flexDirection: 'column', justifyContent: "flex-end" }}>
<View style={{width:"90%", flex:0.9}}>
                            <TextField
                                label='Street'
                                autoCapitalize='none'
                                value={this.state.astreet}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                onChangeText={(text) => this.setState({ astreet: text })}
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


                        {/* <FontAwesome style={{
                                color: '#0080FF',
                                fontSize: 20,
                                marginTop: 15,
                            }} >
                                {Icons.search}
                            </FontAwesome> */}

                        <TextField
                            label='City'
                            autoCapitalize='none'
                            value={this.state.acity}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ acity: text })}
                            textColor='#000'
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='State'
                            autoCapitalize='none'
                            value={this.state.astate}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ astate: text })}
                            textColor='#000'
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Postal Code'
                            autoCapitalize='none'
                            value={this.state.apostal_code}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ apostal_code: text })}
                            textColor='#000'
                            tintColor='red'
                            placeholderTextColor='#000'
                        />

                        <TextField
                            label='Country'
                            autoCapitalize='none'
                            value={this.state.acountry}
                            style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                            onChangeText={(text) => this.setState({ acountry: text })}
                            textColor='#000'
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

export default Login = connect(mapStateToProps, mapDispatchToProps)(EditAccount);