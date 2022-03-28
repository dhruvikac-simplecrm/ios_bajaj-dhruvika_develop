import React, { Component } from 'react';
import { View, Alert,ActionSheetIOS, AlertIOS, Text, Dimensions, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import globals from '../../globals';
import { connect } from 'react-redux';
import { login } from '../../actions/auth';
import { logout , updateToken} from '../../actions/auth';
import { ListItem, Header, Item, Input, Icon, Button, Body, Card, Container, Content } from 'native-base';
import TextCommon from '../override/text';
import styles from './style';
import { bindActionCreators } from 'redux';
import { SearchBar } from 'react-native-elements';
const deviceHeight = Dimensions.get('window').height;
import { Navigation } from 'react-native-navigation';
import apiCallForToken from '../../controller/ApiCallForToken';
const LIMIT = 20
//this file is the list view of accounts
class Accounts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            serverData: [],
            fetching_from_server: false,
            id: '',
            name: '',
            query: '',
            isEmpty: true,
            showSearch: false,
            check: false,
            isShowLoadMore:false,

            nextOffset:0,
            totalRecords:0,
        }

        this.timer = -1;

        
        this.page = 0;//current page 
        this.next_offset = 0;//how many element you want to load
        this._handleResults = this._handleResults.bind(this);// this is the serach method

        this.props.navigator.setButtons({
            rightButtons: [
                
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
                    screen: 'app.CreateAccount',
                    title: 'Create Account',
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

    

    //go to the detail view from the list
    goDetail(id) {
        this.props.navigator.push({
            screen: 'app.AccountDetails',
            title: 'Client',
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: { account_id: id, from_list: false }, // Object that will be passed as props to the pushed screen (optional)
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
    
    componentDidMount() {
        this.getAccounts();
    }

    //get all the account list from the CRM
    getAccounts() {
        console.log(this.props.token);
        this.setState({loading:true})
        this.next_offset = this.state.nextOffset//this.page * LIMIT;

        let url = globals.home_url + "/uindex" + "?token_id=" + this.props.token + "&module_name=" + globals.accounts +
            "&next_offset=" + this.next_offset 
            + "&search_text=" + '' 
            + "&search_fields=" + globals.ACCOUNT_SEARCH_FIELDS 
            + "&fields=" + globals.ACCOUNTS_FIELDS
            + "&order_by=date_entered"
            + "&url="+this.props.url;
        console.log(url);

        fetch(url, {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        }
        )
            .then((response) => response.json())
            .then((response) => {
                if (response.success === true) {
                    console.log('data loaded: ', response);
                
                    this.setState({
                        isEmpty: false, totalRecords: response.data.info.total_count, nextOffset:response.data.info.next_offset,
                    });
                    this.setLoadMoreFooterVisibility(response)

                    this.setState({ serverData: [...this.state.serverData, ...response.data.result], loading: false });
                } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                   
                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.setState({ loading: false, isShowLoadMore: false });
                            return;
                        }
                        //get more recent items, after session generated
                        this.getAccounts()
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({ loading: false, isShowLoadMore: false });
                    })


                } else {
                   
                    this.setState({ loading: false,  isShowLoadMore:false });
                    this.setState({
                        isEmpty: true
                    });
                }

            })
            .catch((error) => {
                console.error(error);
                this.setState({ loading: false,  isShowLoadMore:false });
            });
    }

  /**
     * 
     * @param {*} response this contains the result of list
     */
    setLoadMoreFooterVisibility(response){
        console.log("loadMoreData: length = "+response.data.result.length)
        // const isMoreAvailable = response.data.result.length === LIMIT;
        console.log("error while parsing: parseInt(this.state.totalRecords) = "+ parseInt(this.state.totalRecords))

        let intValueTotalRec = this.state.totalRecords
        try {
            intValueTotalRec = parseInt(this.state.totalRecords)
        }catch(err){
            console.log("error while parsing: err = "+err)
        }

        const isMoreAvailable = response.data.result.length < intValueTotalRec; //this.state.totalRecords;//LIMIT;

        this.setState({ isShowLoadMore: isMoreAvailable })
    }

    //this function will load more accounts if you click on the button load more which is at the bottom of the list
    loadMoreData = () => {
        this.page = this.page + 1;//add one every time user clicks the load more button
        this.next_offset = this.state.nextOffset//this.page * LIMIT; // initially it loads 10 records, then click load more and it adds 1 in the page variable and multiply it by 10 to load another 10 records and so on
        console.log('page: ',this.page);
        console.log('next offset: ', this.next_offset);
        console.log('query: ', this.state.query);
        this.setState({ fetching_from_server: true }, () => {
            clearTimeout(this.timer);

            this.timer = -1;

            this.timer = setTimeout(() => {
                fetch(globals.home_url + "/uindex" + "?token_id=" + this.props.token +
                 "&module_name=" + globals.accounts +
                  "&next_offset=" + this.next_offset + 
                  "&fields=" + globals.ACCOUNTS_FIELDS +
                    "&search_text=" + this.state.query +
                     "&search_fields=" + globals.ACCOUNT_SEARCH_FIELDS
                     + "&order_by=date_entered"
                     + "&url="+this.props.url)

                    .then((response) => {
                        return response.json() // << This is the problem
                    }).then((response) => {
                        if (response.success === true) {
                          
                            this.setState({ totalRecords: response.data.info.total_count, nextOffset:response.data.info.next_offset,})

                            this.setLoadMoreFooterVisibility(response)
                            this.setState({ serverData: [...this.state.serverData, ...response.data.result], fetching_from_server: false });
                        } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                           
                            apiCallForToken.getToken(this.props).then(token => {
                                console.log("getToken: token = " + token)
                                if (token == null) {
                                    this.setState({ loading: false, isShowLoadMore: false });
                                    return;
                                }
                                //get more clients , after session generated
                                this.loadMoreData()
                            }).catch(error => {
                                console.log("getToken: error = " + error)
                                this.setState({ loading: false, isShowLoadMore: false });
                            })

                            
                        } 
                        else {
                            this.setState({
                                fetching_from_server: false,  isShowLoadMore: false,

                            })
                            this.page = 0;
                            this.next_offset = 0;
                        }

                    })
                    .then(() => {
                        this.setState({ loading: false });
                    })
                    .catch((error) => {
                        this.setState({fetching_from_server: false, loading: false,  isShowLoadMore:false });
                        console.error(error);
                    });
            }, 1500);
        });
    }

    //serach record function
    _handleResults(input) {
        console.log('This is search data');
        console.log(input);

        this.setState({loading:true})

        let url = globals.home_url + "/uindex" + "?token_id=" + this.props.token +
            "&module_name=" + globals.accounts + "&fields=" + globals.ACCOUNTS_FIELDS +
            "&next_offset=0"  + "&search_text=" + input + "&search_fields=" + globals.ACCOUNT_SEARCH_FIELDS
            + "&order_by=date_entered"
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

                console.log('accounts api response');
                console.log(response);
                proceed = true;
                if (response.success === true) {
                    console.log('here in search')

                    this.setLoadMoreFooterVisibility(response)

                    this.setState({isEmpty: false, serverData: response.data.result, loading: false });

                }else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                  
                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.setState({ loading: false, isShowLoadMore: false });
                            return;
                        }
                        //get more recent items, after session generated
                        this._handleResults(input)
                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setState({loading: false, isShowLoadMore: false });
                    })


                } else{
                    this.setState({loading: false,  isShowLoadMore:false });
                    AlertIOS.alert('Error', response.data.description === undefined? response.message : response.data.description);
                }


            })
            .catch(err => {
                this.setState({ loading: false,  isShowLoadMore:false });
                console.log(err);
            });
    }

    //clear the search box 
    clearSearchBox() {
        this.setState({ query: '', nextOffset: 0, serverData: [], }, () => {
            this.page = 0;
            this.next_offset = 0;
            this.getAccounts();
        })
    }

    showHideSearch() {
        this.setState(prevState => ({
            check: !prevState.check
        }));
    }

    delete(id) {
        this.setState({ loading: true });
        let url = globals.home_url + "/udestroy" + "?token_id=" + this.props.token
         + "&id=" + id + "&module_name=" + globals.accounts
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
                        } else{
                        this.getAccounts();
                        }
                    }
                }else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
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
                this.setState({ loading: false });
            })
            .catch(err => {
                console.log(err);
            });
    }

    showAlert(id, item){
        ActionSheetIOS.showActionSheetWithOptions({
            options: ['Cancel', 'Edit'],
            cancelButtonIndex: 0,
        },
            (buttonIndex) => {
                    if (buttonIndex === 1) {

                    //if you want to go to the edit record screen from the list view, you would have to 
                    //go to the details screen first, cause only the id field we take it to the detail screen
                    //and from there we send a complete object to edit screen
                    //so following the same pattern
                    //go to detail view and check if the value is coming from the list view and then navigate to the edti screen
                    this.props.navigator.push({
                        screen: 'app.AccountDetails',
                        title: 'Client',
                        subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                        passProps: { account_id: id, from_list: true }, // Object that will be passed as props to the pushed screen (optional)
                        animated: true, // does the push have transition animation or does it happen immediately (optional)
                        animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                        backButtonTitle: 'Back', // override the back button title (optional)
                        backButtonHidden: false, // hide the back button altogether (optional)
                    });

                }

            });
    }


    renderFooter() {
        if(this.state.isShowLoadMore){

        return (
            <View style={styles.footer}>
                <TouchableOpacity activeOpacity={0.9} onPress={this.loadMoreData} style={styles.loadMoreBtn}>
                    <Text style={styles.btnText}>Load More</Text>
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

    formatPhoneNumber = phoneS => 'X'.repeat(Math.min(phoneS.length/2, phoneS.length)) + phoneS.slice(phoneS.length/2);


    render() {
        return (
            <Container>
                <Content>

                    {this.state.loading &&
                        <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1, height: deviceHeight }}>
                            <ActivityIndicator color="red" size="large" />
                        </View>
                    }

                    {this.state.loading == false &&




                        <View style={styles.container}>
                            {
                                (this.state.isEmpty)
                                    ?
                                    (

                                        <View style={{ backgroundColor: '#f2f2f2', alignItems: 'center', height: deviceHeight, flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                                            <Text style={{ color: 'grey' }}>No Clients</Text>
                                        </View>

                                    )
                                    :
                                    (
                                        <View>

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
                                                                returnKeyLabel={"Search"}
                                                                onSubmitEditing={()=>{
                                                                  this._handleResults(this.state.query)
                                                                }}
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
                                                renderItem={({ item, index }) =>

                                                    <Card>
                                                        <ListItem style={styles.listItem}
                                                            onPress={() => this.goDetail(item.id)}
                                                            // onLongPress={() => this.showAlert(item.id, item) }
                                                            >
                                                            <Body style={{ paddingTop: 0, marginTop: 0, marginLeft: 3 }}>
                                                                <View >
                                                                    <View style={{ flex: 0.05 }}>
                                                                    </View>
                                                                    <View style={{ flex: 0.95 }}>

                                                                        <View ><TextCommon style={{ fontSize: 16, fontWeight: 'bold' }} textToDisplay={item.name} /></View>

                                                                        {item.phone_office != '' ?
                                                                            (<View ><TextCommon style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} textToDisplay={this.formatPhoneNumber(item.phone_office)} /></View>
                                                                            ) :
                                                                            (
                                                                                <View ><TextCommon style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} textToDisplay={globals.missing_texts.phone_missing} /></View>
                                                                            )

                                                                        }


                                                                        {item.email1 != '' ?
                                                                            (<View ><TextCommon style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} textToDisplay={this.formatPhoneNumber(item.email1)} /></View>
                                                                            ) :
                                                                            (
                                                                                <View ><TextCommon style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} textToDisplay={globals.missing_texts.email_missing} /></View>
                                                                            )
                                                                        }

                                                                    </View>
                                                                </View>
                                                            </Body>
                                                        </ListItem>
                                                    </Card>
                                                }
                                                ItemSeparatorComponent={() => <View />}
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
        username: state.auth.username,
        password: state.auth.password,
        token: state.auth.token,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logout , updateToken}, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Accounts);

