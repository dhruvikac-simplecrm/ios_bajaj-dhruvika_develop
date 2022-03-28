import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    NetInfo,
    Alert,
    StyleSheet,
    FlatList,
    Platform,
    ActivityIndicator,
    AlertIOS
} from 'react-native';
import { connect } from 'react-redux';
import { Card, ListItem, Body, Content, Container } from 'native-base';
import { login } from '../../actions/auth';
import { logout, updateToken } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import TextCommon from '../override/text';
import styles from './style';
import { SearchBar } from 'react-native-elements';
import globals from '../../globals';
import { Navigation } from 'react-native-navigation';
import apiCallForToken from '../../controller/ApiCallForToken';
const LIMIT = 20
class Recent extends Component {


    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            serverData: [],
            fetching_from_server: false,
            id: '',
            name: '',
            url: '',
            showSearch: false, 
            isShowLoadMore: false,
        }

        this._handleResults = this._handleResults.bind(this);

        this.timer = -1;

        this.page = 0;
        this.next_offset = 0;


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
        this.props.navigator.setDrawerEnabled({
            side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
            enabled: true // should the drawer be enabled or disabled (locked closed)
        });


    }

    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
        if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
           
            if (event.id == 'menu') {

                this.props.navigator.toggleDrawer({
                    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
                    animated: true, // does the toggle have transition animation or does it happen immediately (optional)
                    to: 'missing' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
                });
            }

            if(event.id == 'home'){

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



    componentDidMount() {
        this.getRecentItems();
    }

    getRecentItems() {

        this.next_offset = this.page * 10;
        let url = globals.home_url + "/recent" + "?token_id=" + this.props.token +
            "&module_name=" + globals.recent_modules +
            "&url="+this.props.url;
            
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
                if (response.success === true) {
                    console.log('data loaded: ', response);
                    this.setLoadMoreFooterVisibility(response)
                    this.setState({ serverData: [...this.state.serverData, ...response.data.result], loading: false });

                } 
                else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                //    this.setState({loading:false, isShowLoadMore:false})
                //     Alert.alert(
                //         globals.app_messages.error_string,
                //         globals.app_messages.token_expired,
                //         [
                //         { text: globals.login, onPress: () => this.props.logout() }
                //                    ],
                //         { cancelable: false }
                //     )

                apiCallForToken.getToken(this.props).then(token => {
                    console.log("getToken: token = " + token)
                    if (token == null) {
                        this.setState({ loading: false, isShowLoadMore: false });
                        return;
                    }
                    //get the recent items, after session generated
                    this.getRecentItems()
                }).catch(error => {
                    console.log("getToken: error = " + error)
                    this.setState({ loading: false, isShowLoadMore: false });
                })

                } else {
                    this.setState({ loading: false, isShowLoadMore: false });

                    Alert.alert(
                        globals.app_messages.error_string,
                       response.message
                    );
                }


            })
            .catch((error) => {
                this.setState({ loading: false, isShowLoadMore: false });

                console.error(error);
            });

    }

    goDetail(id, module_name) {

        if(module_name === globals.leads){

            //AlertIOS.alert('SalesMobi', 'Leads Item');
            this.props.navigator.push({
            screen: 'app.Details',
            title: 'Lead',
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: { lead_id: id }, // Object that will be passed as props to the pushed screen (optional)
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

        }else if(module_name === globals.contacts){
            this.props.navigator.push({
                screen: 'app.ContactDetails',
                title: '',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { contact_id: id }, // Object that will be passed as props to the pushed screen (optional)
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

        else if(module_name === globals.accounts){
            this.props.navigator.push({
                screen: 'app.AccountDetails',
                title: 'Client',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { account_id: id }, // Object that will be passed as props to the pushed screen (optional)
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

        else if(module_name === globals.opportunity){
            this.props.navigator.push({
                screen: 'app.OpportunityDetails',
                title: '',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { opportunity_id: id }, // Object that will be passed as props to the pushed screen (optional)
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

        else if(module_name === globals.calls){
            this.props.navigator.push({
                screen: 'app.CallDetailsCalendar',
                title: '',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { id: id, module: 'Calls' }, // Object that will be passed as props to the pushed screen (optional)
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

        else if(module_name === globals.meetings){
            
            this.props.navigator.push({
                screen: 'app.MeetingDetailsCalendar',
                title: '',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { id: id, module: 'Meetings' }, // Object that will be passed as props to the pushed screen (optional)
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

        else if(module_name === globals.tasks){
            this.props.navigator.push({
                screen: 'app.TaskDetailsCalendar',
                title: '',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: { id: id, module: 'Tasks' }, // Object that will be passed as props to the pushed screen (optional)
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

      /**
       * 
       * @param {*} response this contains the result of list
       */
      setLoadMoreFooterVisibility(response) {
        console.log("loadMoreData: length = " + response.data.result.length)
        const isMoreAvailable = response.data.result.length === LIMIT;
        this.setState({ isShowLoadMore: isMoreAvailable })
    }


    loadMoreData = () => {
        this.page = this.page + 1;
        this.next_offset = this.page * 10;
        let url= globals.home_url + "/recent" + "?token_id=" + this.props.token +
        "&module_name=" + globals.recent_modules +
        "&url="+this.props.url;
        this.setState({ fetching_from_server: true }, () => {
            clearTimeout(this.timer);

            this.timer = -1;

            this.timer = setTimeout(() => {
                fetch(url,
                    {
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
                        if (response.success === true) {
                            this.setLoadMoreFooterVisibility(response)
                            this.setState({ serverData: [...this.state.serverData, ...response.data.result], fetching_from_server: false });
                        } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                        //   this.setState({loading:false, isShowLoadMore:false})
                        //     Alert.alert(
                        //         globals.app_messages.error_string,
                        //         globals.app_messages.token_expired,
                        //         [
                        //         { text: globals.login, onPress: () => this.props.logout() }
                        //                    ],
                        //         { cancelable: false }
                        //     )
                        apiCallForToken.getToken(this.props).then(token => {
                            console.log("getToken: token = " + token)
                            if (token == null) {
                                this.setState({ loading: false, isShowLoadMore: false });
                                return;
                            }
                            //get more recent items, after session generated
                            this.loadMoreData()
                        }).catch(error => {
                            console.log("getToken: error = " + error)
                            this.setState({ loading: false, isShowLoadMore: false });
                        })

                        } else {
                            this.setState({ loading: false, isShowLoadMore: false });
                            Alert.alert(
                                globals.app_messages.error_string,
                               response.message
                            );
                        }

                    })
                    .catch((error) => {
                        this.setState({ loading: false, isShowLoadMore: false });

                        console.error(error);
                    });
            }, 1500);
        });
    }

    clearSearch = () => {
        this.setState({ query: '' });
    }


    renderFooter() {
        return (
            <View style={styles.footer}>
                <TouchableOpacity activeOpacity={0.9} onPress={this.loadMoreData} style={styles.loadMoreBtn}>
                    <Text style={styles.btnText}>{globals.load_more}</Text>
                    {
                        (this.state.fetching_from_server)
                            ?
                            <ActivityIndicator color="white" style={{ marginLeft: 8 }} />
                            :
                            null
                    }
                </TouchableOpacity>
            </View>
        )
    }

    _handleResults(input) {
        console.log('This is search data');
        console.log(input);
        this.setState({ input });

        let url = globals.home_url + "/recent" + "?token_id=" + this.props.token +
            "&module_name=" + globals.recent_modules + "&fields=id,name,module_name,date_modified,monitor_id" +
            "&next_offset=" + this.next_offset + "&search_text=" + input + "&search_fields=name"+
            "&url="+this.props.url;

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

                console.log('recent api response');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    console.log('here in search')
                    this.setLoadMoreFooterVisibility(response)

                    // this.setState({ datas: [...this.state.datas, ...response.data.result], loading: false });
                    this.setState({ serverData: response.data.result, loading: false });

                } else {
                    this.setState({ loading: false, isShowLoadMore: false });

                    Alert.alert('Error', response.data.description);
                }

            })
            .catch(err => {
                this.setState({ loading: false, isShowLoadMore: false });

                console.log(err);
            });
    }




    formatPhoneNumber = phoneS => 'X'.repeat(Math.min(phoneS.length/2, phoneS.length)) + phoneS.slice(phoneS.length/2);


    render() {
        return (

            <Container>
                <Content>

                    <View style={styles.container}>

                        {
                            (this.state.loading)
                                ?
                                (

                                    <View style={{ flex: 1 }}>
                                        <ActivityIndicator color="red" size="large"/>
                                    </View>

                                )
                                :
                                (

                                    <View>

                                        {/* <SearchBar
                                            ref={search => this.search = search}
                                            lightTheme
                                            showLoading
                                            platform="ios"
                                            cancelButtonTitle="Cancel"
                                            placeholder='Search'
                                            round
                                            icon={{ type: 'font-awesome', name: 'search' }}
                                            onChangeText={this._handleResults}
                                            data={this.state.serverData}
                                        /> */}

                                        <FlatList
                                            style={{ width: '100%', paddingLeft: 5, paddingRight: 3 }}
                                            keyExtractor={(item, index) => index}
                                            data={this.state.serverData}
                                            scrollEnabled={false}
                                            renderItem={({ item, index }) =>

                                                <Card>
                                                    <ListItem style={styles.listItem}
                                                        onPress={() =>  this.goDetail(item.id, item.module_name)}>

                                                        <Body style={{ paddingTop: 0, marginTop: 0, marginLeft: 3 }}>
                                                            <View>
                                                                <View style={{ flex: 0.05 }}>
                                                                </View>
                                                                <View style={{ flex: 0.95 }}>

                                                                    <View>
                                                                        <View>
                                                                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
                                                                        </View>
                                                                    </View>
                                                                    {item.module_name != '' ? (
                                                                        <View >
                                                                            <View><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} >{item.module_name == globals.accounts ? 'Clients' : item.module_name}</Text></View>
                                                                        </View>
                                                                    ) :
                                                                        (
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} >Module Name is missing</Text> </View>
                                                                        )

                                                                    }


                                                            {item.module_name == globals.accounts || item.module_name == globals.leads ? (item.email != undefined && item.email != '' ? (
                                                                        <View>
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>{this.formatPhoneNumber(item.email)}</Text> </View>
                                                                        </View>
                                                                    ) :
                                                                        (
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>Email is missing</Text> </View>  
                                                                    ) ) : null

                                                            }
                                                            {item.module_name == globals.accounts || item.module_name == globals.leads ? (item.phone_number != undefined && item.phone_number != '' ? (
                                                                        <View>
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>{this.formatPhoneNumber(item.phone_number)}</Text> </View>
                                                                        </View>
                                                                    ) :
                                                                        (
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>Phone number is missing</Text> </View>  
                                                                    )) : null
                                                            }


                                                            {item.module_name == globals.calls || item.module_name == globals.meetings || item.module_name == globals.tasks ? (item.startDate != undefined && item.startDate != '' ? (
                                                                        <View>
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>{globals.formatUtcDateAndTimeToLocal(item.startDate)}</Text> </View>
                                                                        </View>
                                                                    ) :
                                                                        (
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>Start Date is missing</Text> </View>  
                                                                    ) ) : null

                                                            }
                                                            {item.module_name == globals.calls || item.module_name == globals.meetings || item.module_name == globals.tasks ? (item.relateToRecord != undefined && item.relateToRecord != '' ? (
                                                                        <View>
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>{(item.relateToModule == globals.accounts ? 'Clients' : item.relateToModule) + " : " + item.relateToRecord}</Text> </View>
                                                                        </View>
                                                                    ) :
                                                                        (
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>Relate to is missing</Text> </View>  
                                                                    )) : null
                                                            } 



                                                                    {/* {item.date_modified != '' ? (
                                                                        <View>
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>{globals.formatUtcDateAndTimeToLocal(item.date_modified)}</Text> </View>
                                                                        </View>
                                                                    ) :
                                                                        (
                                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>Date is missing</Text> </View>  
                                                                    )
                                                                    } */}

                                                                </View>
                                                            </View>
                                                        </Body>

                                                    </ListItem>
                                                </Card>
                                            }
                                            // ItemSeparatorComponent={() => <View style={styles.separator} />}
                                            // ListFooterComponent={this.renderFooter.bind(this)}
                                        // ListHeaderComponent = { this.renderHeader.bind( this ) }
                                        />


                                    </View>

                                )
                        }

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
        username: state.auth.username,
        password: state.auth.password,
        token: state.auth.token,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Recent);