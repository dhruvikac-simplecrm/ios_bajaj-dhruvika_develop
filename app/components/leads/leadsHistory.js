import React, { Component } from 'react';
import {
    View,
    Alert,
    Image,
    TextInput,
    ScrollView,
    AlertIOS,
    ActivityIndicator,
    FlatList,
    ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Content,Card, ListItem, Body, Text } from 'native-base';
import { login , logout, updateToken} from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import globals from '../../globals';
import { Navigation } from 'react-native-navigation';
import apiCallForToken from '../../controller/ApiCallForToken';

class LeadHistory extends Component {


    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            id: '',
            name: '',
            fetching_from_server: false,
            loading: true,
            basic: true,
            datas: [],
            lead_data: '',
            parent_data: [],
        }
        this.state.lead_data = this.props.data;
    }

    componentDidMount = () =>{

        this.getHistory();
    };

    getHistory(){
        this.next_offset = this.page * 10;
        var data = [];
        var proceed = false;
        var total_count = 0;

        console.log('lead id: '+ this.state.lead_data.id);
        console.log('token: '+ this.props.token);

        let url = globals.home_url + "/uhaindex" + "?token_id=" + this.props.token +
        "&module_name=" + globals.leads + "&fields=" + globals.APPOINTMENTS_FIELDS +
        "&module_id=" + this.state.lead_data.id + "&status_array=" +globals.HISTORY_STATUS
        + "&url="+this.props.url;
    

        console.log('history url: '+url);

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

            console.log('history api response');
            console.log(response);
            proceed = true;
            if (response.success === true) {

                if (response.data.result) {
                    console.log('in result');
                    this.setState({parent_data: response.data.result});
                }

                if (typeof response.data.relationship_list !== 'undefined') {
                    // your code here
                    this.setState({ datas: [ ...this.state.datas, ...response.data.relationship_list ], loading: false });
                  }else{
                    this.setState({loading: false});
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

                apiCallForToken.getToken(this.props).then(token => {
                    console.log("getToken: token = " + token)
                    if (token == null) {
                        this.setState({loading: false});

                        return;
                    }
                    //Get Appointments History, after session generated
                    this.getHistory()

                }).catch(error => {
                    console.log("getToken: error = " + error)
                    this.setState({loading: false});

                })

            } else {
                this.setState({loading: false});

                AlertIOS.alert('Error', response.data.description);
                
            }

        })
        // .then(() => {

        //     this.setState({ loading: false });
        // })
        .catch(err => {
            this.setState({loading: false});

            console.log(err);
        });

    }

    goDetails (id, module){

        //AlertIOS.alert('SalesMobi', 'Back button pressed');
        if(module === 'Calls'){
            Navigation.startSingleScreenApp({
                screen: {
                    screen: 'app.CallDetailsLeads',
                    title: '',
                    animationType: 'slide-horizontal',
    
                },
                    passProps: {id: id,type: 'detail',module: module,lead_id: this.state.lead_data.id, parent_data: this.state.parent_data, from_list: false}, // simple serializable object that will pass as props to all top screens (optional)
                animationType: 'slide-horizontal'
            });
    
        }else if (module === 'Meetings'){
            Navigation.startSingleScreenApp({
                screen: {
                    screen: 'app.MeetingDetailsLeads',
                    title: '',
                    animationType: 'slide-horizontal',
    
                },
                    passProps: {id: id,type: 'detail',module: module,lead_id: this.state.lead_data.id, parent_data: this.state.parent_data, from_list: false}, // simple serializable object that will pass as props to all top screens (optional)
                animationType: 'slide-horizontal'
            });
    

        }else if(module === 'Tasks'){
            Navigation.startSingleScreenApp({
                screen: {
                    screen: 'app.TaskDetailsLeads',
                    title: '',
                    animationType: 'slide-horizontal',
    
                },
                    passProps: {id: id,type: 'detail',module: module,lead_id: this.state.lead_data.id, parent_data: this.state.parent_data, from_list: false}, // simple serializable object that will pass as props to all top screens (optional)
                animationType: 'slide-horizontal'
            });
    

        }
    

}

delete(id,module) {
    var module_name = "";
    if(module === "Calls"){
        module_name = "Calls";
    }else if(module === "Meetings"){
        module_name = "Meetings";
    }else if(module === "Tasks"){
        module_name = "Tasks";
    }

    //this.props.lead_id
    this.setState({ loading: true });
    let url = globals.home_url + "/udestroy" + "?token_id=" + this.props.token + "&id=" + id 
    + "&module_name=" + module_name
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
                        datas: []
                    })
                    this.getHistory();
                }
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

showAlert(id, module){
    var module_name = "";
    if(module === "Calls"){
        module_name = "Call";
    }else if(module === "Meetings"){
        module_name = "Meeting";
    }else if(module === "Tasks"){
        module_name = "Task";
    }
    ActionSheetIOS.showActionSheetWithOptions({
        options: ['Cancel', 'Edit'],

        // options: ['Cancel', 'Delete', 'Edit'],
        // destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
    },
        (buttonIndex) => {

            // if(buttonIndex === 1){
            //     Alert.alert(
            //         'Alert',
            //         'Are you sure you want to delete this '+ module_name+'?',
            //         [
            //             {
            //                 text: 'OK',
            //                 onPress: () => this.delete(id,module)
            //             },
            //             { text: 'Cancel', style: 'cancel' },
            //         ],
            //         { cancelable: false }
            //     )
            // }

            // if (buttonIndex === 2) {
                if (buttonIndex === 1) {

                //if you want to go to the edit record screen from the list view, you would have to 
                //go to the details screen first, cause only the id field we take it to the detail screen
                //and from there we send a complete object to edit screen
                //so following the same pattern
                //go to detail view and check if the value is coming from the list view and then navigate to the edti screen
                if(module === 'Calls'){
                    Navigation.startSingleScreenApp({
                        screen: {
                            screen: 'app.CallDetailsLeads',
                            title: '',
                            animationType: 'slide-horizontal',
            
                        },
                            passProps: {id: id,type: 'detail',module: module,lead_id: this.state.lead_data.id, parent_data: this.state.parent_data, from_list: true}, // simple serializable object that will pass as props to all top screens (optional)
                        animationType: 'slide-horizontal'
                    });
            
                }else if (module === 'Meetings'){
                    Navigation.startSingleScreenApp({
                        screen: {
                            screen: 'app.MeetingDetailsLeads',
                            title: '',
                            animationType: 'slide-horizontal',
            
                        },
                            passProps: {id: id,type: 'detail',module: module,lead_id: this.state.lead_data.id, parent_data: this.state.parent_data, from_list: true}, // simple serializable object that will pass as props to all top screens (optional)
                        animationType: 'slide-horizontal'
                    });
            
        
                }else if(module === 'Tasks'){
                    Navigation.startSingleScreenApp({
                        screen: {
                            screen: 'app.TaskDetailsLeads',
                            title: '',
                            animationType: 'slide-horizontal',
            
                        },
                            passProps: {id: id,type: 'detail',module: module,lead_id: this.state.lead_data.id, parent_data: this.state.parent_data, from_list: true }, // simple serializable object that will pass as props to all top screens (optional)
                        animationType: 'slide-horizontal'
                    });
            
        
                }

            }

        });
}

    render() {
        return (

            <Container style={{ backgroundColor: 'white', height: null }}>
            <Content scrollEnabled={false}>
            <View style={styles.container}>
                {
                    (this.state.loading)
                        ?
                        (<ActivityIndicator color="red" size="large" />)
                        :
                        ((this.state.datas.length === 0 ) ?
                        ( <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }} >
                             <Text style={{ color: 'grey' }} >No Data</Text>
                         </View>
                        ) :
                       (
                            <FlatList
                                style={{ width: '100%', paddingLeft: 5, paddingRight: 3, marginTop: 20 }}
                                keyExtractor={(item, index) => index}
                                data={this.state.datas}
                                renderItem={({ item, index }) =>

                                <Card>
                                    <ListItem
                                        style={styles.listItem}
                                        onPress={() => this.goDetails(item.id, item.module)}
                                        onLongPress={() => this.showAlert(item.id, item.module) } >

                                        <Body style={{ paddingTop: 0, marginTop: 0, marginLeft: 3 }}>
                                        <View>
                                                <View style={{ flex: 0.05 }}>
                                                </View>
                                                <View style={{ flex: 0.95 }}>
                                                {


                                                },

                                                    {(item.name != '',
                                                        <View >
                                                            <View style={{ flex: 1, flexDirection: 'row' }} >
                                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }} >{item.name}</Text>
                                                            </View>
                                                        </View>
                                                    )}
                                                    {item.status != '' ?
                                                        (<View >
                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>{item.status}</Text></View>
                                                        </View>
                                                        ) :
                                                        (
                                                            <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} >{globals.missing_texts.title_missing}</Text></View>
                                                        )

                                                    }
                                                    <View >

                                                        {item.date_entered != '' ?
                                                            (<View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} >{item.date_entered}</Text></View>
                                                            ) :
                                                            (
                                                                <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} >{globals.missing_texts.email_missing}</Text></View>
                                                            )
                                                        }



                                                        {item.module != '' ?
                                                            (<View style={{ flex: 1, flexDirection: 'row' }}><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} >{item.module}</Text></View>
                                                            ) :
                                                            (
                                                                <View ><Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>{globals.missing_texts.phone_missing}</Text></View>
                                                            )
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        </Body>

                                    </ListItem>
                                    </Card>
                                }
                                // ItemSeparatorComponent={() => <View />}
                                // ListFooterComponent={this.renderFooter.bind(this)}
                                // ListHeaderComponent={this.renderHeader.bind(this)}


                            />
                        )
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
        basicdata: ownProps,
        token: state.auth.token,
        username: state.auth.username,
        password: state.auth.password,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({login, logout, updateToken}, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(LeadHistory);