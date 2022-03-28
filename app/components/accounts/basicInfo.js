import React, { Component } from 'react';
import {
    View,
    Alert,
    Image,
    TextInput,
    ScrollView,
    AlertIOS,
    TouchableHighlight,
    TouchableOpacity,
    Linking,
    NativeModules,
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Content, Separator, List, Tab, Tabs, ScrollableTab, ListItem, Footer, Label, Item, Thumbnail, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import globals from '../../globals';

//* this file a tab under the detail view screen of account
//* it contains the basic contact info and some other details related to the account

class BasicInfoAccount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            adata: ''
        }

        console.log('account basic data');
        this.state.adata = this.props.data;//this is the object which comes from the list view
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>::::::::::::::::::::::: "+JSON.stringify(this.props.data));
    }


    showSummaryReport() {
        // alert(this.props.url)
        if(this.props.url.startsWith("https://crm.bajajcapital.com/")){
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>::::::::::::::::::::::: "+this.props.data.rm_code);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>::::::::::::::::::::::: "+this.props.data.investor_code);
            //Production instance, dynamic rm code , investor code etc
            this.generateValuefyToken(this.props.data.rm_code, this.props.data.investor_code)
        }else {
            //UAT instance, hardcode the rm code value and investor code value
            this.generateValuefyToken('102785', '40900192001')
        }
    }

    generateValuefyToken(rm_code, investor_code){
        if(rm_code != undefined && rm_code != ''){
            // let url = 'http://uatmf.bajajcapital.com:80/api/ExternalSystemIntegration/generateToken'
            let url = 'https://wealth.bajajcapital.com/api/ExternalSystemIntegration/generateToken' //Production URL
            
            const data = new FormData();
            let jsonBody = {
                "RMCode": rm_code 
            }
            fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': 'Gdvb2QgZXhhbXBsZSBmbyBob',
                    'source': 'external-system',
                    'version': '1.0'
                },
                body: JSON.stringify(jsonBody)
            })
                .then(response => response.json())
                .then(response => {
                    console.log("generateValuefyToken: response = " + JSON.stringify(response))
                    if(response.authentication != undefined){
    
                    if(investor_code != undefined && investor_code != ''){
                       
                    let cCode = investor_code 
                   
                    Linking.openURL("https://wealth.bajajcapital.com/rm/login?clientCode=" + cCode + "&authentication=" + response.authentication)
                    
                    console.log("showSummary : url = " + "https://wealth.bajajcapital.com/rm/login?clientCode=" + cCode + "&authentication=" + response.authentication);
                    }else{
                        alert("Investor code is empty.")
                    }
                }else{
                    if(response.error != undefined && response.error.message != undefined){
                        alert(response.error.message)
                    }
                }
    
                })
                .catch(error => {
                    this.setState({ loading: false });
                    console.log("generateValuefyToken:  error", error);
    
                });
            } else{
                alert("RM code is empty.")
            }
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#ffffff', height: null }}>
                <Content scrollEnabled={false}>

                    <View style={{ padding: 5 }}>
                        {/* New Fields Added */}

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Office Phone</Label>

                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.phone_office}</Text>

                            </View>
                            {this.state.adata.phone_office &&
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    onPress={() => globals.makeAPhoneCall(this.state.adata.phone_office)} >

                                    <FontAwesome style={{
                                        color: 'grey',
                                        fontSize: 20,
                                        marginRight: 10,
                                    }} >
                                        {Icons.phone}
                                    </FontAwesome>

                                </TouchableHighlight>
                            }

                        </View>

                        <Item></Item>
                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Email</Label>

                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.email1}</Text>
                            </View>

                            {this.state.adata.email1 &&
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    onPress={() => globals.openMailClient(this.state.adata.email1)} >
                                    <FontAwesome style={{
                                        color: 'grey',
                                        fontSize: 20,
                                        marginRight: 10,
                                    }} >
                                        {Icons.envelope}
                                    </FontAwesome>
                                </TouchableHighlight>
                            }


                        </View>
                        <Item></Item>

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Status</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.status_c}</Text>
                        <Item />


                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Client Code</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.client_code_c}</Text>
                        <Item />

                        {/* <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Client Name*</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.name}</Text>
                        <Item/>

                         <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>First Name</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.client_fname_c}</Text>
                        <Item/>

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Last Name</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.client_lname_c}</Text>
                        <Item/> */}


                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Branch</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.scrm_branch_accounts_1_name}</Text>
                        <Item />

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Client Category</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.client_category_c}</Text>
                        <Item />

                        {/* <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Mobile</Label>
                        <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.phone_alternate}</Text>
                        <Item/> */}

                        {/* <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Mobile</Label>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.phone_alternate}</Text>
                            </View>
                            {this.state.adata.phone_alternate &&
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    onPress={() => globals.makeAPhoneCall(this.state.adata.phone_alternate)} >
                                    <FontAwesome style={{
                                        color: 'grey',
                                        fontSize: 20,
                                        marginRight: 10,
                                    }} >
                                        {Icons.phone}
                                    </FontAwesome>
                                </TouchableHighlight>
                            }
                        </View>
                        <Item></Item> */}


                        {/* Existing Fields */}
                        {/* <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Website</Label>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.adata.website}</Text>
                            </View>
                            {this.state.adata.website &&
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    onPress={() => globals.openURL("https://"+this.state.adata.website)} >

                                    <FontAwesome style={{
                                        color: 'grey',
                                        fontSize: 20,
                                        marginRight: 10,
                                    }} >
                                        {Icons.globe}
                                    </FontAwesome>
                                </TouchableHighlight>
                            }
                        </View>
                        <Item></Item> */}

                        <TouchableOpacity onPress={()=>this.showSummaryReport()}><View style={{borderWidth:1, borderColor:globals.colors.color_primary_dark, padding:10, width:'50%', alignSelf:'center', alignContent:'center',alignItems:'center', marginTop:10, backgroundColor:globals.colors.color_primary_dark}}><Text style={{color:globals.colors.white}}>Summary Report</Text></View></TouchableOpacity>



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
        basicdata: ownProps,
        rm_code: state.auth.rm_code,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(BasicInfoAccount);