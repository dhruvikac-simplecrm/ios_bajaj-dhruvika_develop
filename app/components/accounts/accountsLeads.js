import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity,NetInfo, Alert, StyleSheet, FlatList, Platform, ActivityIndicator, AlertIOS 
} from 'react-native';
import { connect } from 'react-redux';

import { Card, ListItem, Body, Content, Container } from 'native-base';
import { login } from '../../actions/auth';
import { logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { SearchBar } from 'react-native-elements';
import TextCommon from '../override/text';
import globals from '../../globals';
import { Navigation } from 'react-native-navigation';


//* This file will show a list of all the leads which are related to a specific account.
class AccountsLeads extends Component {

    constructor(props) {
        super(props);

        this.state =
            {
                loading: true,
                serverData: [],
                fetching_from_server: false,
                id: '',
                name: '',
                url: '',
                showSearch: false,
                p: this.props
            }

            console.log('Account Data');

        this.timer = -1;

        this.page = 0;
        this.next_offset = 0;

    }

    componentDidMount = () => {
        //check if the internet connection is there or not

        this.getLeads();
    }


    //* Get all the leads which are related to a specific account with this API

    getLeads(){
        console.log('inside leads api');

        this.next_offset = this.page * 10;
        let url = globals.home_url + "/getRelationships" + "?token_id=" + this.props.token +
            "&module_name=" + globals.accounts + "&module_id="+ this.props.data.id + "&link_field_name=leads"+
            "&related_module_query=" + "&related_fields="+ globals.LEADS_FIELDS + "&related_module_link_name_to_fields_array=" +
            "&deleted=0"+ "&order_by=name,date_entered" + "&offset=0" + "&limit=10"
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
                if (response.success === true) {
                    console.log(response);
                    if(response.data.info.result_count ===  0){
                        this.setState({loading: false});
                    }else{
                        //* reponse is saved in an array state variable serverData
                    this.setState({ serverData: [...this.state.serverData, ...response.data.result], loading: false });
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
                    Alert.alert(
                        globals.app_messages.error_string,
                        response.data.description,
                        [
                            { text: 'Ok', onPress: () => '' },

                        ],
                        { cancelable: false }
                    );
                }


            })
            .catch((error) => {
                console.error(error);
            });

    }

    //* this method will take user to the detail view of a lead if the user clicks on any record
     //* in the list
    goDetail = (id) =>{
        console.log('Account Data');
        Navigation.startSingleScreenApp({
            screen: {
                screen: 'app.Details',
                title: 'Lead',
                animationType: 'slide-horizontal',
            },
                passProps: {lead_id: id}, // simple serializable object that will pass as props to all top screens (optional)
            animationType: 'slide-horizontal'
        });
       
    }


    render() {
        return (
            <Container>
                <Content>

                
                    <View style={styles.container}>
                    
                        {

                            //* shows loader before the list is shown this.state.loading is true when the loader is shown
                            
                            (this.state.loading)
                                ?
                                (
                                    
                                    <View style={{flex: 1}}>
                                        <ActivityIndicator color="red" size="large" />
                                    </View>
                                
                                )
                                :
                                (
                                    (this.state.serverData.length === 0 ) ?
                        ( <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }} >
                             <Text style={{ color: 'grey' }} >No Data</Text>
                         </View>
                        ) :
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

                                            <FlatList
                                                style={{ width: '100%', paddingLeft: 5, paddingRight: 3, marginTop: 20 }}
                                                keyExtractor={(item, index) => index}
                                                data={this.state.serverData}
                                                scrollEnabled={false}
                                                renderItem={({ item, index }) =>

                                                    <Card>
                                                        <ListItem style={styles.listItem}
                                                            onPress={() => this.goDetail(item.id)}>


                                                            <Body style={{ paddingTop: 0, marginTop: 0, marginLeft: 3 }}>
                                                                <View>
                                                                    <View style={{ flex: 0.05 }}>
                                                                    </View>
                                                                    <View style={{ flex: 0.95 }}>

                                                                        <View >
                                                                            <View>
                                                                                <TextCommon style={{ fontSize: 16, fontWeight: 'bold' }} textToDisplay={item.name} />
                                                                            </View>
                                                                        </View>
                                                                        {item.title &&
                                                                            <View >
                                                                                <View><TextCommon style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} textToDisplay={item.title} /></View>
                                                                            </View>
                                                                        }

                                                                        {item.email &&
                                                                            <View>
                                                                                <View ><TextCommon style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} textToDisplay={item.email} /></View>
                                                                            </View>
                                                                        }
                                                                        {item.phone_mobile &&
                                                                            <View>
                                                                                <View style={{ flex: 1, flexDirection: 'row' }}><TextCommon style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }} textToDisplay={item.phone_mobile} /></View>
                                                                            </View>
                                                                        }
                                                                    </View>
                                                                </View>
                                                            </Body>

                                                        </ListItem>
                                                    </Card>
                                                }
                                                ItemSeparatorComponent={() => <View style={styles.separator} />}
                                            />


                                    </View>
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
        username: state.auth.username,
        token: state.auth.token,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ logout }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(AccountsLeads);