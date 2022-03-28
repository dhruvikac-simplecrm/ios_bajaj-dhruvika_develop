import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Dimensions,
    StatusBar,
    Image,
    AlertIOS,
    TouchableHighlight
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Spinner } from 'native-base';
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
class ConvertToAccount extends Component {


    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            disable: false,
            aname: this.props.data.account_name,
            aofficephone: this.props.data.phone_work,
            awebsite: '',
            aemail: this.props.data.email1,
            adetails: this.props.data.description,
            aannual_revenu: '',
            aaccount_type: '',
            astreet: this.props.data.primary_address_street,
            acity: this.props.data.primary_address_city,
            astate: this.props.data.primary_address_state,
            acountry: this.props.data.primary_address_country,
            apostal_code: this.props.data.primary_address_postalcode,
            acompany_name: '',
            aaccount_type: '',
            adata: '',
            address_array: []
        }

        console.log('lead info');
        console.log(this.props.data);
        console.log(this.props.convertAccount);
        console.log(this.props.convertContact);
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
                // if (this.state.ldata == '') {
                //     
                // } else {
                //     apiurl = globals.home_url + "/uupdate" + "?token_id=" + this.props.token + "&id=" + this.props.account_id + "&module_name=Accounts&name=" + this.state.aname + "&phone_office=" + this.state.aofficephone + "&website=" + this.state.awebsite + "&email1=" + this.state.aemail + "&description=" + this.state.adetails+"&annual_revenue=" + this.state.aannual_revenu+"&account_type="+this.state.aaccount_type+"&billing_address_street="+this.state.astreet+"&billing_address_city="+this.state.acity+"&billing_address_state="+this.state.astate+"&billing_address_postalcode="+this.state.apostal_code+"&billing_address_country="+this.state.acountry;
                // }
                this.save();
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


    save() {
        let proceed = true;
        if (this.state.aname === undefined || this.state.aname == '') {
            proceed = false;
            Alert.alert('Validation Error', 'Please enter Account Name!');

        }

        // else if (this.state.aofficephone.length > 0 && this.state.aofficephone.length < 10) {

        //     proceed = false;
        //     Alert.alert('Validation Error', 'Phone number should not be less than 10 digits');

        // } 

        else if (this.state.aofficephone.length == 15) {
            if (!globals.validateMobile(this.state.aofficephone)) {
                proceed = false;
                Alert.alert('Validation Error', 'Invalid Phone Number');
            }
        }

        else if (this.state.aofficephone.length > 15) {
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

            let apiurl = globals.home_url + "/ustore" + "?token_id=" + this.props.token +
                "&module_name=" + globals.accounts +
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
                + "&url=" + this.props.url;

            console.log('create account url');

            console.log(apiurl);
            aaccount_id = '';
            account_name = '';
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
                    console.log(' create account response:');
                    console.log(response);
                    proceed = true;

                    if (response.success === true) {

                        aaccount_id = response.data.result.id;
                        account_name = response.data.result.name;

                        //call relate api here
                        this.relateAccount(aaccount_id, account_name);


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
                        this.setState({ loading: false })
                        Alert.alert('Error', response.data.description)
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

    relateAccount(id, name) {

        //related_ids = the id of contact
        //link_field_name = to which you are linking the contact


        let url = globals.home_url + "/setRelationship" + "?token_id=" + this.props.token + "&module_name=" + globals.leads +
            "&module_id=" + this.props.data.id + "&link_field_name=accounts" + "&related_ids=" + id
            + "&delete=0"
            + "&url=" + this.props.url;

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

                console.log('relate ACCOUNT response:');
                console.log(response);
                proceed = true;
                if (response.success === true) {

                    this.props.navigator.push({
                        screen: 'app.ConvertToContact',
                        title: 'Convert to Contact',
                        subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                        passProps: { data: this.props.data, account_id: id, account_name: name, convertOpportunity: this.props.convertOpportunity }, // Object that will be passed as props to the pushed screen (optional)
                        animated: true, // does the push have transition animation or does it happen immediately (optional)
                        animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                        backButtonTitle: 'Back', // override the back button title (optional)
                        backButtonHidden: true, // hide the back button altogether (optional)
                        navigatorStyle: {
                            navBarBackgroundColor: 'white',
                            navBarTextColor: '#0067ff',
                            navBarButtonColor: '#0067ff'

                        }, // override the navigator style for the pushed screen (optional)

                    })
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
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

    setAddress(place) {

        this.setState({
            astreet: place.name
        });
        this.setState({
            address_array: place.addressComponents
        });
        this.state.address_array.forEach(element => {
            console.log(element);
            if (element.types[0] === 'postal_code') {
                this.setState({
                    apostal_code: element.name
                });
            }

            if (element.types[0] === 'country') {
                this.setState({
                    acountry: element.name
                });
            }

            if (element.types[0] === 'administrative_area_level_1') {
                this.setState({
                    astate: element.name
                });
            }

            if (element.types[0] === 'locality') {
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



    accountnamedropdown = globals.contactAccountItems;

    render() {
        return (
            <Container>
                <Content>

                    {this.state.loading &&
                        <View style={[styles.content, { marginTop: containerHeight / 3 }]}>
                            <Spinner color='red' />
                        </View>
                    }
                    
                    {this.state.loading === false &&
                        <View>
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
                                    tintColor='red'
                                    keyboardType='email-address'
                                    placeholderTextColor='#000'
                                />

                                <TextField
                                    label='Details'
                                    autoCapitalize='none'
                                    value={this.state.adetails}
                                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                    onChangeText={(text) => this.setState({ adetails: text })}
                                    textColor='#000'
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
                                <View style={{ flexDirection: 'column', justifyContent: "flex-end" }}>
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

export default Login = connect(mapStateToProps, mapDispatchToProps)(ConvertToAccount);