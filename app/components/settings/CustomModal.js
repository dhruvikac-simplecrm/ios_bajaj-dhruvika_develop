import React, { Component } from "react"
import {
    View,
    Alert,
    TextInput,
    Modal,
    Switch, FlatList,
    AlertIOS, TouchableOpacity, ActionSheetIOS, ScrollView
} from 'react-native';

import { Container, Spinner, Header, Title, Content, Card, CardItem, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Row } from 'native-base';

import { connect } from 'react-redux';
import { login, logout, updateCurrency } from '../../actions/auth';
import { bindActionCreators } from 'redux';

import styles from './style';
import { Navigation } from 'react-native-navigation';
import globals from '../../globals';
import PopupCurrency from './popupCurrency';
// import {Modal as Popup} from "react-native-modal"

export class CustomModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            currencyArray: [],
            currencyNameArray: [],
            showCurrencyPopup: false,
            clickedIndex: -1,
            userCurrencyId: this.props.userCurrencyId,
            value: this.props.userCurrencyName,
            isActionDispatched: false,
            changedCurrency: null,
            isModalVisible: this.props.visible,
        }
    }
    componentDidMount() {
        this.getListOfCurrencies()
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
            "&search_text=" + "" +
            "&url=" + this.props.url

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
                    //         { text: globals.login, onPress: () => this.props.logout() }
                    //     ],
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


    cancelButtonClick(){
        this.setState({isModalVisible:false})
    }

    saveButtonClick(){
        alert("Save button clicked.")
    }

    render() {
        return (
            <Container>
                <Content padder>

                    <View style={{ marginTop: 0 }}>
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.isModalVisible}
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
                                borderBottomWidth: 1,
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
                                    fontWeight: 'bold', fontSize: 16, alignText: "center", justifyContent: "center", alignSelf: "center"
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
                            <View style={{ margin: 10, padding: 10 }}>
                                <View >
                                    {/* FlatList to show all selected/captured images */}
                                    <FlatList
                                        style={{ marginBottom: 50, width: '100%', paddingLeft: 5, paddingRight: 3 }}
                                        keyExtractor={(item, index) => index}
                                        data={this.state.currencyArray}
                                        renderItem={({ currency, index }) =>
                                            // Child View to display single element of list
                                            <View style={{ marginTop: 15 }}>

                                                <Text style={{
                                                    width: "100%", color: "black", backgroundColor: backgColor, padding: 10,
                                                    selfAlign: "center", alignText: "center", textAlign: "center",
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
                                </View>
                            </View>

                        </Modal>
                    </View>
                </Content>
            </Container>

        )
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
        username: state.auth.username,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateCurrency, logout }, dispatch)
};
export default Login = connect(mapStateToProps, mapDispatchToProps)(CustomModal);
