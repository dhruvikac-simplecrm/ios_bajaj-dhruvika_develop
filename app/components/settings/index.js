import React, { cloneElement, Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Switch,FlatList,Modal,
    AlertIOS, TouchableOpacity, ActionSheetIOS, ScrollView
} from 'react-native';

import { Container, Spinner, Header, Title, Content, Card, CardItem, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Row } from 'native-base';

import { connect } from 'react-redux';
import { login, logout , updateCurrency} from '../../actions/auth';
import { bindActionCreators } from 'redux';

import styles from './style';
import { Navigation } from 'react-native-navigation';
import globals from '../../globals';
import PopupCurrency from './popupCurrency';

// import Modal from "react-native-modal"
import { CustomModal } from './CustomModal';


let backgColor = globals.colors.white; //default
let selectedCurrency = null
let ConnectedInstance = ''
class Settings extends Component {

    constructor(props) {
    console.log("Inside Console")
        super(props);

        if (props.url.startsWith('https://crm.bajajcapital.com/')) {
            ConnectedInstance = ''
        } else if (props.url.startsWith('https://uatcrm.bajajcapital.com/')) {
            ConnectedInstance = 'UAT'
        } else {
            ConnectedInstance = 'DEV'
        }

        this.state = {
            username: '',
            password: '',
            SwitchOnValueHolder: false,
            lastSyncDate: 'July 12, 2018',
            currencyArray: [],
            currencyNameArray: [],
            loading: false,
            showCurrencyPopup: false,
            clickedIndex: -1,
            userCurrencyId: this.props.userCurrencyId,
            value :  this.props.userCurrencyName,
            isActionDispatched: false,
            changedCurrency:null,
        }

        this.props.navigator.setButtons({
            rightButtons: [

                {
                    id: 'home', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    icon: require('../../../images/icon_home24.png'), // for icon button, provide the local image asset name
                },
            ], // see "Adding buttons to the navigator" below for format (optional)
            leftButtons: [

                {
                    icon: require('../../../images/hamburger_small.png'), // for icon button, provide the local image asset name
                    id: 'menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                },

            ],


            animated: true // does the change have transition animation or does it happen immediately (optional)
        });

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onSwitchToggled(value) {

        this.setState({
            SwitchOnValueHolder: value
        });
    }


    saveCurrencyChangeInRedux(){
        if(this.state.changedCurrency != null){
            this.props.updateCurrency(this.state.changedCurrency)
        } 
    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
           
            //!Remove this redux state updation from here and call it after successful updation of selected currency, Now unnecessary reload has been fixed
            //just to stop reloading screen, change local here
            this.saveCurrencyChangeInRedux()

            if (event.id == 'menu') {

                this.props.navigator.toggleDrawer({
                    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
                    animated: true, // does the toggle have transition animation or does it happen immediately (optional)
                    to: 'missing' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
                });
            }

            if (event.id == 'home') {


                Navigation.startSingleScreenApp({

                    screen: {
                        screen: 'app.TileMenu', // unique ID registered with Navigation.registerScreen
                        title: 'Home', // title of the screen as appears in the nav bar (optional)
                        navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
                    },

                    drawer: {
                        // optional, add this if you want a side menu drawer in your app
                        left: {
                            // optional, define if you want a drawer from the left
                            screen: 'app.Menu', // unique ID registered with Navigation.registerScreen
                            passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
                            disableOpenGesture: false, // can the drawer be opened with a swipe instead of button (optional, Android only)
                            fixedWidth: 500 // a fixed width you want your left drawer to have (optional)
                        },
                        style: {
                            // ( iOS only )
                            drawerShadow: false, // optional, add this if you want a side menu drawer shadow
                            contentOverlayColor: 'rgba(0,0,0,0.25)', // optional, add this if you want a overlay color when drawer is open
                            leftDrawerWidth: 70, // optional, add this if you want a define left drawer width (50=percent)
                            rightDrawerWidth: 50 // optional, add this if you want a define right drawer width (50=percent)
                        },
                        type: 'TheSideBar', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
                        animationType: 'slide-and-scale', //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
                        // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
                        disableOpenGesture: false // optional, can the drawer, both right and left, be opened with a swipe instead of button
                    },
                    passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
                    animationType: 'slide-left'
                });

            }


        }
    }

    cancelButtonClick(){
        this.setState({showCurrencyPopup:false})
    }

    saveButtonClick(){
        this.okHandler(selectedCurrency, this.state.clickedIndex)
     }

    //Add modal to display the list of currencies (current currency should be selected)

    render() {
        return (
            <Container>
                <Content padder>
                    {this.state.loading &&
                        <View>
                            <Spinner color='red' />
                        </View>
                    }

                    {/* <Card>
                        <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10 }} >
                            <View style={{ flex: 1}} > 
                                    <Text>Sync with Google Calendar</Text>
                            </View>
                            <Switch

                                value={this.state.SwitchOnValueHolder}
                                onValueChange={(value) => this.onSwitchToggled(value)}
                            ></Switch>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginLeft: 5, marginBottom: 10 }}> 
                        <Text style={{color: 'grey', fontSize: 14}} >Last Sync Date: </Text>
                        <Text style={{color: 'grey', fontSize: 14}} >July 11, 2018</Text>
                        </View>
                        

                    </Card> */}

                    //email address set up
                    {/* <Card>
                         <View style={{paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10}} >
                        <View style={{ alignItems: 'center', flexDirection: 'row'}} >
                            <View style={{ flex: 1 }} >
                                    <Text style={{color: 'black', fontSize: 16, margin: 0, padding: 0}}>Email address associated with the app</Text>
                            </View>
                        </View>
                        <View style={{alignItems: 'center', flexDirection: 'row', marginTop: 5 }}> 
                        <View style={{ flex: 1 }} > 

                        <Text style={{color: 'grey', fontSize: 14}} >No Email address is set up</Text>

                        </View>

                        <Text style={{marginRight: 10, fontSize: 14 , color: '#0080FF', fontStyle: 'italic'}} >Set up</Text>
                       

                        </View>
                        </View>

                    </Card> */}

                    {this.state.showCurrencyPopup &&
                        // <PopupCurrency currencies = {this.state.currencyArray} 
                        // okClick = {this.okHandler}
                        // cancelClick = {this.cancelHandler}
                        // >
                        // </PopupCurrency>


                        // <CustomModal visible={this.state.showCurrencyPopup}/>



                    <View style={{ marginTop: 0, flex:1 , justifyContent:"flex-start"}}>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.showCurrencyPopup}
                            onRequestClose={() => {
                                Alert.alert('Modal has been closed.');
                            }}>

                            {/* Add Top bar with screen title, upload and cancel buttons */}
                            <View style={{
                                height: 35, marginTop: 25,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                backgroundColor: 'white',
                                borderBottomWidth: 2,
                                marginBottom:10,
                                borderBottomColor: globals.colors.light_grey
                            }}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }}>
                                    <Button transparent onPress={() => this.cancelButtonClick()} >
                                        <View style={{ justifyContent: "flex-end", alignItems: 'flex-end' }} >
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: globals.colors.red, padding: 5 }}>Cancel</Text>
                                        </View>
                                    </Button>
                                </View>
                                <Text style={{
                                    color: '#000',
                                    fontWeight: 'bold', fontSize: 16, textAlign: "center", justifyContent: "center", alignSelf: "center"
                                }}>Select Currency</Text>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                }}>
                                    <Button transparent onPress={() => this.saveButtonClick()} style={{ justifyContent: 'center', alignSelf: 'flex-end' }}>
                                        <View style={{ justifyContent: "flex-end", alignItems: 'flex-end' }} >
                                            <Text style={{ fontWeight: 'bold', fontSize: 16, color: globals.colors.blue_default, padding: 5 }}>Save</Text>
                                        </View>
                                    </Button>
                                </View>
                            </View>
                            {this.state.loading &&
                                <View>
                                    <Spinner color='red' />
                                </View>
                            }

                       {this.state.loading === false &&

                            <View style={{ margin: 10, }}>
                                {/* <View >
                                    <FlatList
                                        style={{ marginBottom: 50, width: '100%', paddingLeft: 5, paddingRight: 3 }}
                                        keyExtractor={(currency, index) => index}
                                        data={this.state.currencyArray}
                                        renderItem={({ currency, index }) =>
                                            // Child View to display single element of list
                                            <View style={{ marginTop: 15 }}>

                                                <Text style={{
                                                    width: "100%", color: "black", backgroundColor: backgColor, padding: 10,
                                                    selfAlign: "center", textAlign: "center", textAlign: "center",
                                                    marginLeft: 2, marginRight: 2, marginBottom: 5, borderRadius: 20,
                                                    borderBottomWidth: 5, borderBottomColor: "yellow"
                                                }}
                                                    onPress={() => {
                                                        backgColor = globals.colors.color_primary
                                                        selectedCurrency = currency
                                                        this.setState({ clickedIndex: index })
                                                    }}
                                                >{currency.name + " - " + currency.symbol}</Text>

                                            </View>
                                        }
                                    />
                                </View> */}

                                             <ScrollView >
                                         return ({
                                            this.state.currencyArray.map((currency, index) => {
                                                console.log("index = " + index + " cleckedItm = " + this.state.clickedIndex)
                                                //return the list here
                                                if (this.state.clickedIndex != -1 && this.state.clickedIndex === index) {
                                                    backgColor = globals.colors.color_primary
                                                } else {
                                                    backgColor = globals.colors.white
                                                }

                                                return <View style={{borderRadius: 0,
                                                    borderWidth: 1, borderColor: globals.colors.light_grey, marginLeft: 2, marginRight: 2, marginBottom: 5}}>
                                                        <Text style={{
                                                    width: "100%", color: "black", backgroundColor: backgColor, padding: 10,
                                                    selfAlign: "center", alignText: "center", textAlign: "center",
                                                   
                                                }}
                                                    onPress={() => {
                                                        backgColor = globals.colors.color_primary
                                                        selectedCurrency = currency
                                                        this.setState({ clickedIndex: index })
                                                    }}
                                                >{currency.name + " - " + currency.symbol}</Text></View>
                                            })
                                        })
                            </ScrollView>
                                 
                            </View>
                       }
                        </Modal>
                    </View>




                        // <View style={{
                        //     backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center',
                        //     justifyContent: 'center'
                        // }} >
                        //     <Modal isVisible={this.state.showCurrencyPopup}>
                        //         <View style={{
                        //             backgroundColor: "grey", padding: 20, borderRadius: 5,
                        //             borderBottomWidth: 5, borderBottomColor: "yellow",
                        //             flex: 1, flexWrap: "wrap", justifyContent: "flex-start"
                        //         }}>
                        //             <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", marginBottom: 20 }}>Select Currency</Text>

                        //             <ScrollView >
                        //                 return ({
                        //                     this.state.currencyArray.map((currency, index) => {
                        //                         console.log("index = " + index + " cleckedItm = " + this.state.clickedIndex)
                        //                         //return the list here
                        //                         if (this.state.clickedIndex != -1 && this.state.clickedIndex === index) {
                        //                             backgColor = globals.colors.color_primary
                        //                         } else {
                        //                             backgColor = globals.colors.white
                        //                         }

                        //                         return <Text style={{
                        //                             width: "100%", color: "black", backgroundColor: backgColor, padding: 10,
                        //                             selfAlign: "center", alignText: "center", textAlign: "center",
                        //                             marginLeft: 2, marginRight: 2, marginBottom: 5, borderRadius: 20,
                        //                             borderBottomWidth: 5, borderBottomColor: "yellow"
                        //                         }}
                        //                             onPress={() => {
                        //                                 backgColor = globals.colors.color_primary
                        //                                 selectedCurrency = currency
                        //                                 this.setState({ clickedIndex: index })
                        //                             }}
                        //                         >{currency.name + " - " + currency.symbol}</Text>
                        //                     })
                        //                 })
                        //     </ScrollView>
                        //             <View style={{ flexDirection: "row", marginTop: 20, flexWrap: "wrap", justifyContent: "space-evenly" }}>

                        //                 <TouchableOpacity >
                        //                     <Button style={{ height: 35 }} onPress={() => this.cancelHandler()}><Text>Cancel</Text></Button>
                        //                 </TouchableOpacity>

                        //                 <TouchableOpacity >
                        //                     <Button style={{ height: 35 }} onPress={() => this.okHandler(selectedCurrency, this.state.clickedIndex)}><Text>Ok</Text></Button>
                        //                 </TouchableOpacity>
                        //             </View>
                        //         </View>
                        //     </Modal>
                        // </View>

                    }
                    //select currency
                    {this.state.loading === false &&

                    <Card>
                        <View style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10 }} >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }} >
                                <View style={{ flex: 1 }} >
                                    <Text style={{ color: 'black', fontSize: 16, margin: 0, padding: 0 }}>Currency</Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: 'row', marginTop: 5 }}>
                                <View style={{ flex: 1 }} >

                                    {/* <Text style={{color: 'grey', fontSize: 14}} >{Singapore Dollar}: $ </Text> */}
                                    <Text style={{ color: 'grey', fontSize: 14 }} >{this.state.value}</Text>

                                </View>
                                <TouchableOpacity 
                                onPress={
                                    this.showCurrencyList
                                }
                                // onPress = {()=>{this.setState({showCurrencyPopup:true})}}
                                >
                                    <Text style={{ marginRight: 10, fontSize: 14, color: '#0080FF', fontStyle: 'italic' }} >Change Currency</Text>
                                </TouchableOpacity>

                            </View>
                            </View>

                        </Card>
                    }

                    <Card>
                        <View style={{ alignItems: 'center', flexDirection: 'row', paddingLeft: 5, paddingRight: 5, paddingTop: 10, paddingBottom: 10 }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ color: 'black', fontSize: 16, margin: 0, padding: 0 }}>App Version:  {this.props.version + " " + ConnectedInstance}</Text>
                                {/* <Text style={{ color: 'grey', fontSize: 14, marginTop: 5, padding: 0 }}>{this.props.url}</Text> */}
                            </View>
                        </View>
                    </Card>

                </Content>
            </Container>

        );
    }



    /**
     * showCurrencyList : arrow function called on click of change currency text 
     */
    showCurrencyList = () => {
        this.setState({
            clickedIndex: -1
        })
        backgColor = globals.colors.white
        selectedCurrency = null
        //Here get the list of currencies from server
       this.getListOfCurrencies()
    

    }


    cancelHandler = () => {
        // alert("Cancel clicked")
        this.setState({ showCurrencyPopup: false })
        console.log("Cancel")
    }

    okHandler = (currency, index) => {
        //Save the selected currency on server and hide the modal
        if (currency == null) {
            alert("Please select currency to change.")
            return
        }
        this.showLoader()

        // alert("Selected Currency is: "+currency.name)
        // console.log("Ok")
        /**
         * 
         * http://161.202.21.7/internallaravel/genericAPI/public/api/updateusercurrency?
         * assigned_user_id=746c64c4-6656-a101-3a6e-55d72a3e1628
         * &module_name=UserPreferences
         * &token_id=lvum92qpecsdpg3cu1oos7c8j5
         * &fields=id,contents
         * &currency=e0f20181-2612-661f-c6a9-578346cd8986
         */
        let url = globals.home_url + "/updateusercurrency"
            + "?token_id=" + this.props.token +
        "&module_name=" + globals.userPreference +
            "&fields=id,contents" +
        "&currency=" + currency.id +
        "&assigned_user_id=" + this.props.assigned_user_id +
        "&url="+this.props.url
        console.log("updateUserCurrency: URL: " + url)

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
                console.log('updateUserCurrency: Response:');
                console.log(response);
                if (response.success === true) {
                    try {
                        if (response.data.result.number === 40) {
                            alert(response.data.result.description )

                            //just to test
                            // this.setState({ value: currency.name, 
                            //     showCurrencyPopup: false })
                            //     this.props.updateCurrency(currency)
                                
                            return
                        }
                    } catch (e) {
                        this.setState({ showCurrencyPopup: false })
                    }

                    try {
                        //save changes in redux state
                        // this.props.updateCurrency(currency)

                        //!Here save the changes in redux state once the selected currency is updated
                        this.setState({ value: currency.name, showCurrencyPopup: false,
                            changedCurrency: currency })

                            console.log("currency to be set: "+currency.name)
                            console.log("After setting currency, currency name: "+this.props.userCurrencyName)
                            console.log("After setting , token: "+this.props.token)

                            console.log("After setting , isLoggedIn: "+this.props.isLoggedIn)


                    } catch (error) {
                        this.setState({ showCurrencyPopup: false })
                    }

                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    // Alert.alert(
                    //     globals.app_messages.error_string,
                    //     globals.app_messages.token_expired,
                    //     [
                    //     { text: globals.login, onPress: () => this.props.logout() }
                    //                ],
                    //     { cancelable: false }
                    // )
                } else {
                    
                    Alert.alert('Error: ', response.data.description);
                }

                this.hideLoader()
            })

            .catch(err => {
                console.log(err);
                this.setState({ showCurrencyPopup: false })

                this.hideLoader()
            });


    }
    
    componentWillUnmount(){
        console.log("componentWillUnmount")
    }

    /**
     * getListOfCurrencies() : This fetches currencies from server
     */
    getListOfCurrencies() {
        //show loader meanwhile
        this.showLoader()
        /**
         * http://161.202.21.7/internallaravel/genericAPI/public/api/uindex?
         * module_name=Currencies&
         * token_id=60kp5f5i0u4f840n8muvlqvvr7&
         * fields=id,name,symbol,conversion_rate,status,iso4217&
         * next_offset=0&
         * search_fields=&
         * search_text=
         * 
         */

        /**
         * Currency =  {
                      "id": "8d7c4e3c-c6bd-421e-b87d-5bfbc4c46582",
                      "name": "usd",
                      "symbol": "$",
                      "conversion_rate": "60",
                      "status": "Active",
                      "iso4217": ""
                  }
         */
        let url = globals.home_url + "/uindex"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.currencies +
            "&fields=" + globals.CURRENCIES_FIELDS +
            "&next_offset=" + "0" +
            "&search_fields=" + "" +
            "&search_text=" + ""+
            "&url="+this.props.url

        console.log("getListOfCurrencies: URL: " + url)

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
                console.log('getListOfCurrencies: Response:');
                console.log(response);
                if (response.success === true) {
                    if (response.data.info.result_count > 0) {
                        const array = response.data.result;
                        array.forEach(element => {
                            this.state.currencyNameArray.push(element.name + " - " + element.symbol)
                        });
                        this.setState({
                            showCurrencyPopup: true,
                            currencyArray: [...array]
                        })
                        console.log("CURRENCY_ARRAY: " + this.state.currencyArray)

                        // this.showCurrencies()
                        this.hideLoader()

                    } else {
                        this.hideLoader()
                        this.setState({ showCurrencyPopup: false })
                    }
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    this.hideLoader()
                    this.setState({ showCurrencyPopup: false })

                    // Alert.alert(
                    //     globals.app_messages.error_string,
                    //     globals.app_messages.token_expired,
                    //     [
                    //     { text: globals.login, onPress: () => this.props.logout() }
                    //                ],
                    //     { cancelable: false }
                    // )
                } else {
                    this.hideLoader()
                    this.setState({ showCurrencyPopup: false })

                    Alert.alert('Error: ', response.data.description);
                }

            })

            .catch(err => {
                console.log(err);
                this.setState({ showCurrencyPopup: false })

                this.hideLoader()
            });
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

}

const mapStateToProps = (state, ownProps) => {
    return {
         isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
        token: state.auth.token,
        userCurrencyId: state.auth.currency_id,
        userCurrencyName: state.auth.user_currency_name,
        assigned_user_id: state.auth.assigned_user_id,
        username : state.auth.username,
        url: state.auth.url,
        loginTime: state.auth.loginTime,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateCurrency, logout }, dispatch)
};
export default Login = connect(mapStateToProps, mapDispatchToProps)(Settings);
