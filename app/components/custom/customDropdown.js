import React, { Component } from 'react';
import { TouchableHighlight, Modal, View, ActionSheetIOS, Image, TouchableOpacity, Dimensions, NetInfo, Alert, StyleSheet, FlatList, Platform, ActivityIndicator, AlertIOS } from 'react-native';
// import { Dropdown } from 'react-native-material-dropdown';
import {
    Container, Spinner, Header, Title, Content, Card, CardItem, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Row,
    ListItem, Item, Input
} from 'native-base';

var thisObj;
var deviceHeight = Dimensions.get("window").height;
import globals from "../../globals";

import { connect } from 'react-redux';
import { login, logout, updateCurrency } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import styles from '../leads/style';

const LIMIT = 20

//This will open new screen for the value selection
export class CustomDropdown extends Component {
    constructor(props) {
        super(props);
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
            isModalVisible: true,

            serverData: [],
            fetching_from_server: false,
            id: '',
            name: '',
            url: '',
            query: '',
            isSearchedItemPresent: false,
            isEmpty: true,
            showSearch: false,
            check: false,
            isShowLoadMore: false,

            nextOffset: 0,
            totalRecords: 0,
        }

        this._handleResults = this._handleResults.bind(this);

        this.timer = -1;

        this.page = 0;
        this.next_offset = 0;

    }

    componentDidMount() {
        this.getLeads()
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


    getLeads() {
        console.log('inside leads api');
        this.showLoader()
        this.next_offset = this.state.nextOffset//this.page * 20;

        let url;
        if (this.props.moduleName == globals.accounts) {
            url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
                "&module_name=" + this.props.moduleName +
                "&next_offset=" + this.next_offset
                + "&search_text=" + this.state.query
                + "&search_fields=name"
                + "&order_by=date_entered"
                + "&fields=id,name,date_entered,date_modified,customer_id_c"
                + "&max_results=" + globals.RECORD_LIMIT
                + "&url=" + this.props.url;
        } else {
            url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
                "&module_name=" + this.props.moduleName +
                "&next_offset=" + this.next_offset + "&search_text=" + this.state.query + "&search_fields=name"
                + "&order_by=date_entered" + "&fields=id,name,date_entered,date_modified"
                + "&max_results=" + globals.RECORD_LIMIT
                + "&url=" + this.props.url;
        }

        console.log('GetList:Module = ' + this.props.moduleName + ' url = ' + url);

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
                if (response.success === true) {
                    this.setState({
                        isEmpty: false, totalRecords: response.data.info.total_count, nextOffset: response.data.info.next_offset,
                    });

                    this.setLoadMoreFooterVisibility(response)

                    this.setState({ serverData: [...this.state.serverData, ...response.data.result], loading: false });

                } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    this.setState({ loading: false });

                    // Alert.alert(
                    //     globals.app_messages.error_string,
                    //     globals.app_messages.token_expired,
                    //     [
                    //         { text: globals.login, onPress: () => this.props.logout() }
                    //     ],
                    //     { cancelable: false }
                    // )
                } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_ACCESS_DENIED) {
                    this.setState({ loading: false });

                    Alert.alert(
                        response.data.name,
                        response.data.description,
                        [
                            {
                                text: 'Ok', onPress: () => {
                                    //goback
                                }
                            }
                        ],
                        { cancelable: false }
                    )
                } else {
                    this.setState({ loading: false, isShowLoadMore: false, });
                    this.setState({
                        isEmpty: true
                    });
                }

            })
            .catch((error) => {
                this.setState({ isShowLoadMore: false, })
                console.log(error);
            });

    }

    loadMoreData = () => {
        this.page = this.page + 1;
        this.next_offset = this.state.nextOffset//this.page * 10;
        this.setState({ fetching_from_server: true }, () => {
            clearTimeout(this.timer);

            this.timer = -1;

            this.timer = setTimeout(() => {
                let url;
                if (this.props.moduleName == globals.accounts) {
                    url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
                        "&module_name=" + this.props.moduleName +
                        "&next_offset=" + this.next_offset
                        + "&order_by=date_entered"
                        + "&fields=id,name,date_entered,date_modified,customer_id_c"
                        + "&max_results=" + globals.RECORD_LIMIT
                        + "&url=" + this.props.url;

                    if (this.state.query == '') {
                        url = url + "&search_text=" + this.state.query
                            + "&search_fields=name"
                    } else {
                        url = url + "&search_text=" + this.state.query
                            + "&search_fields=name"
                    }
                } else {
                    url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
                        "&module_name=" + this.props.moduleName +
                        "&next_offset=" + this.next_offset + "&search_text=" + this.state.query + "&search_fields=name"
                        + "&order_by=date_entered" + "&fields=id,name,date_entered,date_modified"
                        + "&max_results=" + globals.RECORD_LIMIT
                        + "&url=" + this.props.url;
                }
                console.log('loadMoreData:Module = ' + this.props.moduleName + ' url = ' + url);

                fetch(url)
                    .then((response) => {
                        return response.json() // << This is the problem
                    })
                    .then((response) => {
                        if (response.success === true) {
                            this.setState({ totalRecords: response.data.info.total_count, nextOffset: response.data.info.next_offset, })

                            this.setLoadMoreFooterVisibility(response)

                            this.setState({
                                serverData: [...this.state.serverData, ...response.data.result],
                                fetching_from_server: false,
                            });
                        } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                            // Alert.alert(
                            //     globals.app_messages.error_string,
                            //     globals.app_messages.token_expired,
                            //     [
                            //         { text: globals.login, onPress: () => this.props.logout() }
                            //     ],
                            //     { cancelable: false }
                            // )
                            this.setState({
                                fetching_from_server: false, isShowLoadMore: false,
                            })
                            this.page = 0;
                            this.next_offset = 0;
                        } else {
                            //Alert.alert('Error', 'No more data');
                            this.setState({
                                fetching_from_server: false, isShowLoadMore: false,
                            })
                            this.page = 0;
                            this.next_offset = 0;
                        }

                    })
                    .catch((error) => {
                        this.setState({ fetching_from_server: false, isShowLoadMore: false, })
                        console.log(error);
                    });
            }, 1500);
        });
    }

    /**
     * 
     * @param {*} response this contains the result of list
     */
    setLoadMoreFooterVisibility(response) {
        console.log("loadMoreData: length = " + response.data.result.length)
        let intValueTotalRec = this.state.totalRecords
        try {
            intValueTotalRec = parseInt(this.state.totalRecords)
        } catch (err) {
            console.log("error while parsing: err = " + err)
        }


        // const isMoreAvailable = response.data.result.length === LIMIT;
        const isMoreAvailable = response.data.result.length < intValueTotalRec; //this.state.totalRecords;//LIMIT;
        this.setState({ isShowLoadMore: isMoreAvailable })
    }

    renderFooter() {
        if (this.state.isShowLoadMore) {
            return (
                <View style={styles.footer}>
                    <TouchableOpacity activeOpacity={0.9} onPress={this.loadMoreData} style={styles.loadMoreBtn}>
                        <Text style={styles.btnText}>{globals.load_more}</Text>
                        {
                            (this.state.fetching_from_server)
                                ?
                                <ActivityIndicator color="red" style={{ marginLeft: 8 }} />
                                :
                                null
                        }
                    </TouchableOpacity>
                </View>
            )
        } else return null
    }

    _handleResults(input) {
        console.log('This is search data');
        console.log(input);
        this.showLoader()
        let url;
        if (this.props.moduleName == globals.accounts) {
            url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
                "&module_name=" + this.props.moduleName +
                "&next_offset=0" + "&search_text=" + input
                + "&search_fields=name"
                + "&order_by=date_entered"
                + "&fields=id,name,date_entered,date_modified,customer_id_c"
                + "&max_results=" + globals.RECORD_LIMIT
                + "&url=" + this.props.url;
        } else {
            url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
                "&module_name=" + this.props.moduleName +
                "&next_offset=0" + "&search_text=" + input + "&search_fields=name"
                + "&order_by=date_entered" + "&fields=id,name,date_entered,date_modified"
                + "&max_results=" + globals.RECORD_LIMIT
                + "&url=" + this.props.url;
        }

        console.log('_handleResults Search:Module = ' + this.props.moduleName + ' url = ' + url);

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

                console.log('lead api response');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    console.log('here in search')

                    this.setLoadMoreFooterVisibility(response)

                    // this.setState({ datas: [...this.state.datas, ...response.data.result], loading: false });
                    this.setState({isEmpty: false, serverData: response.data.result, loading: false });
                } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    this.setState({ loading: false, isShowLoadMore: false, })
                    // Alert.alert(
                    //     globals.app_messages.error_string,
                    //     globals.app_messages.token_expired,
                    //     [
                    //         { text: globals.login, onPress: () => this.props.logout() }
                    //     ],
                    //     { cancelable: false }
                    // )
                } else {
                    this.setState({loading: false, isShowLoadMore: false, })
                    AlertIOS.alert('Error', response.data.description === undefined ? response.message : response.data.description);
                }

            })
            .catch(err => {
                this.setState({ loading: false, isShowLoadMore: false, })
                console.log(err);
            });
    }

    clearSearchBox() {
        this.setState({ query: '', nextOffset: 0, serverData: [], }, () => {
            this.page = 0;
            this.next_offset = 0;
            this.getLeads();
        })
    }

    showHideSearch() {
        this.setState(prevState => ({
            check: !prevState.check
        }));
    }

    selectedItem(item) {
        const parentName = this.props.moduleName
        const name = item.name
        const id = item.id
        const existingLead = { parentName, name, id }
        // this.props.component.setState({existingLead: existingLead})
        //Callback
        this.props.navigator.pop(this.props.screen)
        this.props.onSelected(existingLead)
    }


    render() {
        return (
            <Container>
                <Content>

                    {this.state.loading &&
                        <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, height: deviceHeight }}>
                            <Spinner color='red' />
                        </View>
                    }

                    {this.state.loading == false &&

                        <View style={styles.container}>

                            {
                                (this.state.isEmpty)
                                    ?
                                    (

                                        <View style={{ backgroundColor: '#f2f2f2', alignItems: 'center', height: deviceHeight, flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                                            <Text style={{ color: 'grey' }}>No Data</Text>
                                        </View>

                                    )
                                    :
                                    (

                                        <View>

                                            <View style={{ backgroundColor: '#fff' }} >

                                                <Header
                                                    searchBar
                                                    rounded
                                                    transparent
                                                    style={{ paddingTop: 5 }} >
                                                    <Item>
                                                        <Icon name="ios-search" />
                                                        <Input placeholder="Search"
                                                            value={this.state.query}
                                                            onChangeText={(text) => this.setState({ query: text })}
                                                        />
                                                        {this.state.query.length > 0 &&
                                                            <Icon name="ios-close" onPress={() => this.clearSearchBox()} />
                                                        }

                                                    </Item>
                                                    <Button transparent onPress={() => this._handleResults(this.state.query)} >
                                                        <Text style={{ color: globals.colors.blue_default }} >Search</Text>
                                                    </Button>
                                                </Header>

                                            </View>

                                            <FlatList
                                                style={{ width: '100%', paddingLeft: 5, paddingRight: 3 }}
                                                keyExtractor={(item, index) => index}
                                                data={this.state.serverData}
                                                scrollEnabled={false}
                                                renderItem={({ item, index }) => {
                                                    let listStyle = {
                                                        backgroundColor: '#fff',
                                                        paddingLeft: 0,
                                                        paddingTop: 5,
                                                        paddingBottom: 5,
                                                        paddingLeft: 5,
                                                        marginBottom: 0,
                                                        marginLeft: 0
                                                    };

                                                    return <Card>
                                                        <ListItem style={listStyle}
                                                            onPress={() => this.selectedItem(item)} >
                                                            <Body style={{ paddingTop: 0, marginTop: 0, marginLeft: 3 }}>
                                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                                    <View style={{ flex: 0.9 }} >
                                                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }} >{item.customer_id_c != undefined && item.customer_id_c != '' ? item.name + " (" + item.customer_id_c + ")" : item.name}</Text>
                                                                        {item.date_entered != '' &&
                                                                            <View><Text style={{
                                                                                fontSize: 14,
                                                                                marginTop: 1, color: globals.colors.grey, fontStyle: 'italic'
                                                                            }}>{globals.formatUtcDateAndTimeToLocal(item.date_entered)}</Text></View>
                                                                        }

                                                                    </View>
                                                                    {item.id == this.props.selectedId &&
                                                                        <Image source={require('../../../images/right.png')}
                                                                            style={{ width: 30, height: 30, alignContent: 'center', alignSelf: 'flex-end', flex: 0.1, }} />
                                                                    }
                                                                </View>
                                                            </Body>

                                                        </ListItem>
                                                    </Card>
                                                }
                                                }
                                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                                ListFooterComponent={this.renderFooter.bind(this)}
                                            />


                                        </View>

                                    )
                            }
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
        userCurrencyId: state.auth.currency_id,
        userCurrencyName: state.auth.user_currency_name,
        assigned_user_id: state.auth.assigned_user_id,
        username: state.auth.username,
        department: state.auth.department,
        sbu_code: state.auth.sbu_code,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ updateCurrency, logout }, dispatch)
};
export default Login = connect(mapStateToProps, mapDispatchToProps)(CustomDropdown);