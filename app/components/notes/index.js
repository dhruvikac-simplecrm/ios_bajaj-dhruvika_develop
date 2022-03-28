import React, { Component } from 'react';
import { View, ActionSheetIOS, Image, Text, TouchableOpacity, Dimensions, NetInfo, Alert, StyleSheet, FlatList, Platform, ActivityIndicator, AlertIOS } from 'react-native';
import globals from '../../globals';
import { connect } from 'react-redux';
import { logout , updateToken} from '../../actions/auth';
import { bindActionCreators } from 'redux';

import { Card, ListItem, Header, Item, Input, Icon, Button, Spinner, Body, Content, Container } from 'native-base';

import styles from './style';
import { SearchBar } from 'react-native-elements';
const deviceHeight = Dimensions.get('window').height;
import { Navigation } from 'react-native-navigation';
import apiCallForToken from '../../controller/ApiCallForToken';
const LIMIT = 20

class Notes extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
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
            note:'',
        }
        this._handleResults = this._handleResults.bind(this);

        this.timer = -1;

        this.page = 0;
        this.next_offset = 0;

        this.props.navigator.setButtons({
            rightButtons: [

                {
                    id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
                    disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    systemItem: 'add'
                },

                {
                    id: 'search', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
                    testID: 'e2e_search', // optional, used to locate this view in end-to-end tests
                    disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
                    disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
                    buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
                    buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
                    systemItem: 'search'
                },

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
            if (event.id == 'add') {
                this.props.navigator.push({
                    screen: 'app.CreateNote',
                    title: 'Create Note',
                    subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                    passProps: {}, // Object that will be passed as props to the pushed screen (optional)
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

            if (event.id == 'menu') {

                this.props.navigator.toggleDrawer({
                    side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
                    animated: true, // does the toggle have transition animation or does it happen immediately (optional)
                    to: 'missing' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
                });
            }

            if (event.id == 'search') {
                this.showHideSearch();
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

    goBack() {
        this.props.navigator.push({
            screen: 'app.Home',
            title: 'Home',
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: {}, // Object that will be passed as props to the pushed screen (optional)
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

    //!this code is not in use
    // delete = (id, index) => {

    //     this.setState({ loading: true });
    //     this.setState({ dataHasValue: false });
    //     var proceed = false;
    //     var data = [];

    //     fetch(globals.portal_url + "/leads/delete/" + id + "?token=" + this.state.token, {
    //         method: "POST",
    //         dataType: 'jsonp',
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Accept': 'application/json'
    //         }
    //     })
    //         .then((response) => {
    //             return response.json() // << This is the problem
    //         })
    //         .then((response) => {

    //         })
    //         .then(() => {
    //             // this._fetchTickets(this.state.token);
    //             console.log('index ' + index);
    //             data = this.state.datas;
    //             delete data[index];
    //             this.setState({ datas: data });
    //             console.log(data);
    //             this.setState({ dataHasValue: true });
    //             this.setState({ loading: false });
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // }

    //style the status element on the list view. Add colors according to the lead status

    _getRowStyle(status) {
        switch (status) {
            case 'New': return ({ backgroundColor: globals.lead_status_color.new, color: 'white', textAlign: 'center', borderRadius: 5, width: 45 }); break;
            case 'Assigned': return ({ backgroundColor: globals.lead_status_color.assigned, color: 'grey', textAlign: 'center', borderRadius: 5, width: 65 }); break;
            case 'In Process': return ({ backgroundColor: globals.lead_status_color.inprocess, color: 'white', textAlign: 'center', borderRadius: 5, width: 75 }); break;
            case 'Recycled': return ({ backgroundColor: globals.lead_status_color.recycled, color: 'white', textAlign: 'center', borderRadius: 5, width: 85 }); break;
            case 'Converted': return ({ backgroundColor: globals.lead_status_color.converted, color: 'white', textAlign: 'center', borderRadius: 5, width: 85 }); break;
            case 'Dead': return ({ backgroundColor: globals.lead_status_color.dead, color: 'white', textAlign: 'center', borderRadius: 5, width: 85 }); break;
            default: return ({ backgroundColor: globals.lead_status_color.new, color: 'white', textAlign: 'center', borderRadius: 5, width: 85 }); break;
        }

    }


    //go to the detail view from the list view by clicking on the list item, click event is 
    //given in the UI 
    goDetail(note) {
        this.props.navigator.push({
            screen: 'app.NoteDetails',
            title: 'Note',
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: { data: note, from_list: true , isEditable:false}, // Object that will be passed as props to the pushed screen (optional)
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

    gotoEditScreen(note) {
        this.props.navigator.push({
            screen: 'app.NoteDetails',
            title: 'Note',
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: { data: note, from_list: true , isEditable:true}, // Object that will be passed as props to the pushed screen (optional)
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


    //once the screen loads component is mounted and the methods inside this block will be called
    componentDidMount = () => {
        //check if the internet connection is there or not
        this.getNotes();
    }





    getNotes() {
        console.log('inside Notes api');

        this.next_offset = this.page * 10;
        let url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes + "&fields=" + globals.NOTES_FIELDS +
            "&next_offset=" + this.next_offset + "&search_text=" 
            + "&search_fields=" + globals.NOTES_SEARCH_FIELDS
            + "&order_by=date_entered"
            + "&url=" + this.props.url;
           
            console.log('GetNotes url = '+url);

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
                        isEmpty: false
                    });

                    this.setLoadMoreFooterVisibility(response)

                    this.setState({ serverData: [...this.state.serverData, ...response.data.result], loading: false });

                }  else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {

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
                            this.setState({ loading: false });

                            return;
                        }
                        //get notes, after session generated
                        this.getNotes()
    
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ loading: false });

                    })


                } else {
                  
                    this.setState({ loading: false, isShowLoadMore: false, });
                    this.setState({
                        isEmpty: true
                    });
                }

            })
            .catch((error) => {
                this.setState({ isShowLoadMore: false, })
                console.error(error);
            });

    }

    loadMoreData = () => {
        this.page = this.page + 1;
        this.next_offset = this.page * 10;
        this.setState({ fetching_from_server: true }, () => {
            clearTimeout(this.timer);

            this.timer = -1;

            this.timer = setTimeout(() => {
                const url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
                "&module_name=" + globals.notes + "&fields=" + globals.NOTES_FIELDS +
                "&next_offset=" + this.next_offset + "&search_text=" 
                + "&search_fields=" + globals.NOTES_SEARCH_FIELDS
                + "&order_by=date_entered"
                + "&url=" + this.props.url;
               
                fetch(url)
                    .then((response) => {
                        return response.json() // << This is the problem
                    })
                    .then((response) => {
                        if (response.success === true) {

                            this.setLoadMoreFooterVisibility(response)

                            this.setState({
                                serverData: [...this.state.serverData, ...response.data.result],
                                fetching_from_server: false,
                            });
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
                                    this.setState({
                                        fetching_from_server: false, isShowLoadMore: false,
                                    })
                                    this.page = 0;
                                    this.next_offset = 0;
                                        
                                    return;
                                }
                                //get more notes, after session generated
                                this.loadMoreData()
            
                            }).catch(error => {
                                console.log("getToken: error = " + error)
                                this.setState({
                                    fetching_from_server: false, isShowLoadMore: false,
                                })
                                this.page = 0;
                                this.next_offset = 0;
                                 
                            })

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
                        this.setState({ isShowLoadMore: false, })
                        console.error(error);
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
        const isMoreAvailable = response.data.result.length === LIMIT;
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

        //console.log('query: ', this.state.query);

            const url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes + "&fields=" + globals.NOTES_FIELDS +
            "&next_offset=0"  + "&search_text=" +input
            + "&search_fields=" + globals.NOTES_SEARCH_FIELDS
            + "&order_by=date_entered"
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

                console.log('note api response');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    console.log('here in search')

                    this.setLoadMoreFooterVisibility(response)

                    // this.setState({ datas: [...this.state.datas, ...response.data.result], loading: false });
                    this.setState({ serverData: response.data.result, loading: false });
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
                            this.setState({ isShowLoadMore: false, })

                            return;
                        }
                        //get search notes, after session generated
                        this._handleResults(input)
    
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ isShowLoadMore: false, })

                    })

                } else {
                    this.setState({ isShowLoadMore: false, })
                    AlertIOS.alert('Error', response.data.description === undefined ? response.message : response.data.description);
                }

            })
            .catch(err => {
                this.setState({ isShowLoadMore: false, })
                console.log(err);
            });
    }

    clearSearchBox() {
        this.setState({ query: '' });
        this.setState({
            serverData: []
        });
        this.page = 0;
        this.next_offset = 0;
        this.getNotes();
    }

    showHideSearch() {
        this.setState(prevState => ({
            check: !prevState.check
        }));
    }

    delete(id) {

        //this.props.lead_id
        this.setState({ loading: true });
        let url = globals.home_url + "/udestroy" + "?token_id=" + this.props.token + "&id=" + id
            + "&module_name=" + globals.notes
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
                        this.setState({
                            serverData: []
                        })
                        if(this.state.query != ''){
                            this.clearSearchBox()
                            this.showHideSearch()
                        }else{
                        this.getNotes();
                        }
                    }
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    this.setState({ loading: false });

                    Alert.alert(
                        globals.app_messages.error_string,
                        globals.app_messages.token_expired,
                        [
                        { text: globals.login, onPress: () => this.props.logout() }
                                   ],
                        { cancelable: false }
                    )
                } else {
                    this.setState({ loading: false });

                    Alert.alert('Error', response.data.description);
                }

            })
            
            .catch(err => {
                console.log(err);
            });
    }

    showAlert(id, item) {
        ActionSheetIOS.showActionSheetWithOptions({
            // options: ['Cancel', 'Delete', 'Edit'],
            options: ['Cancel', 'Edit'],

            // destructiveButtonIndex: 1,
            cancelButtonIndex: 0,
        },
            (buttonIndex) => {

                // if (buttonIndex === 1) {
                //     Alert.alert(
                //         'Delete',
                //         'Are you sure you want to delete this Note?',
                //         [
                //             {
                //                 text: 'OK',
                //                 onPress: () => this.delete(id)
                //             },
                //             { text: 'Cancel', style: 'cancel' },
                //         ],
                //         { cancelable: false }
                //     )
                // }

                if (buttonIndex === 1) {

                // if (buttonIndex === 2) {
                    this.gotoEditScreen(item)
                    //if you want to go to the edit record screen from the list view, you would have to 
                    //go to the details screen first, cause only the id field we take it to the detail screen
                    //and from there we send a complete object to edit screen
                    //so following the same pattern
                    //go to detail view and check if the value is coming from the list view and then navigate to the edti screen
                    
                    //create detailed view for note and call here
                    
                    // this.props.navigator.push({
                    //     screen: 'app.Details',
                    //     title: '',
                    //     subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                    //     passProps: { lead_id: id, from_list: true }, // Object that will be passed as props to the pushed screen (optional)
                    //     animated: true, // does the push have transition animation or does it happen immediately (optional)
                    //     animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                    //     backButtonTitle: 'Back', // override the back button title (optional)
                    // });

                }

            });
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
                                            <Text style={{ color: 'grey' }}>No Notes</Text>
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
                                            data={this.state.datas}
                                        /> */}

                                            {this.state.check &&

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

                                            }

                                            <FlatList
                                                style={{ width: '100%', paddingLeft: 5, paddingRight: 3 }}
                                                keyExtractor={(item, index) => index}
                                                data={this.state.serverData}
                                                scrollEnabled={false}
                                                renderItem={({ item, index }) =>{
                                                    // this.setState({note:item})
                                                   return <Card>
                                                        <ListItem style={styles.listItem}
                                                            onPress={() => this.goDetail(item)}
                                                            onLongPress={() => this.showAlert(item.id, item)} >
                                                            <Body style={{ paddingTop: 0, marginTop: 0, marginLeft: 3 }}>
                                                                <View style={{ flex: 1 , flexDirection: 'column'}} >
                                                                        <Text style={{ fontSize: 16, fontWeight: 'bold' }} >{item.name}</Text>
                                                                        <View style = {{flexDirection:'row'}}>
                                                                        <Text style={{ fontSize: 14 , fontWeight:'bold'}} >Last modified at: </Text>
                                                                        <Text style={{ fontSize: 14 }} >{globals.formatUtcDateAndTimeToLocal(item.date_modified)}</Text>

                                                                        </View>
                                                                </View>
                                                            </Body>

                                                        </ListItem>
                                                    </Card>
                                                }
                                                }

                                                ItemSeparatorComponent={() => <View style={styles.separator} />}

                                                ListFooterComponent={this.renderFooter.bind(this)}
                                            // ListHeaderComponent = { this.renderHeader.bind( this ) }
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
        username: state.auth.username,
        password: state.auth.password,
        token: state.auth.token,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Notes);

