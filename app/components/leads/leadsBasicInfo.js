import React, { Component } from 'react';
import {
    View,
    Alert,
    Image,
    TextInput,
    ScrollView,
    AlertIOS,
    TouchableHighlight,
    Linking
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Content, Separator, List, Tab, Tabs, ScrollableTab, ListItem, Footer, Label, Item, Thumbnail, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import globals from '../../globals';

class LeadsBasicInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            ldata: this.props.data,
            formatedDateString: globals.formatUtcDateAndTimeToLocal(this.props.data.date_modified),
        }
        console.log('lead basic data');
        // this.state.ldata = this.props.data;
        console.log(this.props.ldata);

    }


    removeCaps(values){
        let str = ''
        if(values !=undefined){
          str =  values.split('^').join("")
        }
        return str
    }


    _getRowStyle(status) {
        switch (status) {
            case 'Open': return ({ backgroundColor: globals.lead_status_color.new, color: 'white', textAlign: 'center', borderRadius: 5, width: 120, marginBottom:3}); break;
            case 'Duplicate Lead': return ({ backgroundColor: globals.lead_status_color.assigned, color: 'grey', textAlign: 'center', borderRadius: 5, width: 120, marginBottom:3 }); break;
            case 'Existing Client': return ({ backgroundColor: globals.lead_status_color.inprocess, color: 'white', textAlign: 'center', borderRadius: 5, width: 120, marginBottom:3 }); break;
            case 'CSO Allocated': return ({ backgroundColor: globals.lead_status_color.recycled, color: 'white', textAlign: 'center', borderRadius: 5, width: 120 , marginBottom:3}); break;
            case 'RM Allocated': return ({ backgroundColor: globals.lead_status_color.rm_allocated, color: 'white', textAlign: 'center', borderRadius: 5, width: 120 , marginBottom:3}); break;
            case 'Converted': return ({ backgroundColor: globals.lead_status_color.converted, color: 'white', textAlign: 'center', borderRadius: 5, width: 120, marginBottom:3 }); break;
            case 'Lost': return ({ backgroundColor: globals.lead_status_color.dead, color: 'white', textAlign: 'center', borderRadius: 5, width: 120 , marginBottom:3}); break;
            case 'Appointment': return ({ backgroundColor: globals.lead_status_color.appointed, color: 'white', textAlign: 'center', borderRadius: 5, width: 120 , marginBottom:3}); break;
            case 'Follow Up': return ({ backgroundColor: globals.lead_status_color.follow_up, color: 'white', textAlign: 'center', borderRadius: 5, width: 120, marginBottom:3 }); break;
            case 'Cross Sell': return ({ backgroundColor: globals.lead_status_color.cross_sell, color: 'white', textAlign: 'center', borderRadius: 5, width: 120, marginBottom:3 }); break;

            default: return ({ backgroundColor: globals.lead_status_color.new, color: 'white', textAlign: 'center', borderRadius: 5, width: 120 , marginBottom:3}); break;
       }
    }

    render() {
        return (
            <Container style={{ backgroundColor: '#fafafa', height: null }}>
                <Content scrollEnabled={false}>

                    <View style={{ padding: 5 }}>

                        <View>

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Email</Label>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.email1}</Text>
                            </View>
                            {this.state.ldata.email1 &&
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    onPress={() => globals.openMailClient(this.state.ldata.email1)} >
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


                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Phone Number*</Label>
                                <View style={{ flex: 1, flexDirection: 'row' }} >
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.phone_mobile}</Text>
                                    </View>
                                    {this.state.ldata.phone_mobile &&
                                        <TouchableHighlight
                                            underlayColor='transparent'
                                            onPress={() => globals.makeAPhoneCall(this.state.ldata.phone_mobile)} >
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

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Alternate Mobile No</Label>
                                <View style={{ flex: 1, flexDirection: 'row' }} >
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.phone_other}</Text>
                                    </View>
                                    {this.state.ldata.phone_other &&
                                        <TouchableHighlight
                                            underlayColor='transparent'
                                            onPress={() => globals.makeAPhoneCall(this.state.ldata.phone_other)} >
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

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Land Line Number</Label>
                                <View style={{ flex: 1, flexDirection: 'row' }} >
                                    <View style={{ flex: 1 }} >
                                        <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.phone_home}</Text>
                                    </View>
                                    {this.state.ldata.phone_home &&
                                        <TouchableHighlight
                                            underlayColor='transparent'
                                            onPress={() => globals.makeAPhoneCall(this.state.ldata.phone_home)} >
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

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Lead Status</Label>
\                                <Text style={this._getRowStyle(
                                    this.state.ldata.status
                                    )}>{this.state.ldata.status}</Text>
                                <Item></Item>


                                </View>


                            <View style={{ marginTop: 0, marginTop: 10,  }} >

                            <Collapse>
                                <CollapseHeader>
                                    <Separator bordered style={styles.collExpSeperator}>
                                        <Text style={styles.collExpButton}>{"LEAD INFORMATION"}</Text>
                                    </Separator>
                                </CollapseHeader>
                                <CollapseBody>
                                    <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }}>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Salutation</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.salutation}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>First Name</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.first_name}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Middle Name</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.middle_name_c}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Last Name*</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.last_name}</Text>
                                <Item></Item>


                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Lead Source</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.lead_source}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Interested Product*</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.interested_product_c}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Product Sub Category</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{
                                this.removeCaps(this.state.ldata.product_sub_category_c)
                                }</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Designation</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.designation_c}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Mode of Lead</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.mode_of_lead}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Lead Type</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.lead_type_c}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Occupation Type</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.occupation_type_c}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Service Type</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.service_type_c}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Age in Number</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.age_in_number_c}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Webinar Starttime</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.z_webinar_starttime_c}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Retirement Date</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.retirement_date_c}</Text>
                                <Item></Item>


                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Assigned RM</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.users_leads_2_name}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Lead Owner</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.assigned_user_name
                                
                                 }</Text>
                                <Item></Item>

                                </View>
                                </CollapseBody>
                            </Collapse>



                            <Collapse>
                                <CollapseHeader>
                                    <Separator bordered style={styles.collExpSeperator}>
                                        <Text style={styles.collExpButton}>{"ADDRESS INFORMATION"}</Text>
                                    </Separator>
                                </CollapseHeader>
                                <CollapseBody>
                                    <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }}>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Address 1</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.address_1__c}</Text>
                                        <Item></Item>


                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Address 2</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.address_2__c}</Text>
                                        <Item></Item>


                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>State*</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.state_c}</Text>
                                        <Item></Item>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>City*</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.city_c}</Text>
                                        <Item></Item>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Postal Code</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.postal_code_c}</Text>
                                        <Item></Item>

                                    </View>
                                </CollapseBody>
                            </Collapse>

                            <Collapse>
                                <CollapseHeader>
                                    <Separator bordered style={styles.collExpSeperator}>
                                        <Text style={styles.collExpButton}>{"CAMPAIGN DETAILS"}</Text>
                                    </Separator>
                                </CollapseHeader>
                                <CollapseBody>
                                    <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }}>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Campaign</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.campaign_name}</Text>
                                        <Item></Item>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Organisation</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.organization_c}</Text>
                                        <Item></Item>

                                    </View>
                                </CollapseBody>
                            </Collapse>


                            <Collapse>
                                <CollapseHeader>
                                    <Separator bordered style={styles.collExpSeperator}>
                                        <Text style={styles.collExpButton}>{"RM ALLOCATION"}</Text>
                                    </Separator>
                                </CollapseHeader>
                                <CollapseBody>
                                    <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }}>


                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Disposition Category*</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.disposition_category_c}</Text>
                                        <Item></Item>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Dispositions*</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.dispositions_c}</Text>
                                        <Item></Item>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Client Category</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.client_category_c}</Text>
                                        <Item></Item>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Prefered Date Time</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.prefered_date_time_date}</Text>
                                        <Item></Item>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Appointment Date Time</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.appointment_date_time_date}</Text>
                                        <Item></Item>


                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Remarks</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.remarks_c}</Text>
                                        <Item></Item>


                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Meeting Done</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.meeting_done_c}</Text>
                                        <Item></Item>

                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Who Cancelled</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.who_cancelled_c}</Text>
                                        <Item></Item>


                                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Lost Reason</Label>
                                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.lost_reason_c}</Text>
                                        <Item></Item>

                                    </View>
                                </CollapseBody>
                            </Collapse>

                        </View>



                        {/* <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Mobile Phone</Label>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.phone_mobile}</Text>
                            </View>
                            {this.state.ldata.phone_mobile &&
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    onPress={() => globals.makeAPhoneCall(this.state.ldata.phone_mobile)} >
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

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Office Phone</Label>
                        <View style={{ flex: 1, flexDirection: 'row' }} >
                            <View style={{ flex: 1 }} >
                                <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.phone_work}</Text>
                            </View>
                            {this.state.ldata.phone_work &&
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    onPress={() => globals.makeAPhoneCall(this.state.ldata.phone_work)} >
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
                                <Text style={{ fontSize: 15, color: '#0db289', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.email1}</Text>
                            </View>
                            {this.state.ldata.email1 &&
                                <TouchableHighlight
                                    underlayColor='transparent'
                                    onPress={() => globals.openMailClient(this.state.ldata.email1)} >
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
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.status}</Text>
                        <Item></Item>

                        <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Details</Label>
                        <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.description}</Text>

                        <Collapse>
                            <CollapseHeader>
                                <Separator bordered style={styles.collExpSeperator}>
                                    <Text style={styles.collExpButton}> More Information </Text>
                                </Separator>
                            </CollapseHeader>
                            <CollapseBody>
                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Company Name</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.account_name}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Lead Source</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.lead_source}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Date Created</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.formatedDateString}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Assigned To</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.assigned_user_name}</Text>

                            </CollapseBody>
                        </Collapse>
                        <Collapse collapsedHeight={600}>
                            <CollapseHeader>

                                <Separator bordered style={styles.collExpSeperator}>
                                    <Text style={styles.collExpButton}> Address </Text>
                                </Separator>

                            </CollapseHeader>
                            <CollapseBody collapsedHeight={600}>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Street</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.primary_address_street}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>City</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.primary_address_city}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>State</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.primary_address_state}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Postal Code</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.primary_address_postalcode}</Text>
                                <Item></Item>

                                <Label style={{ fontSize: 12.5, color: 'grey', padding: 10, backgroundColor: '#fafafa' }}>Country</Label>
                                <Text style={{ fontSize: 15, color: 'black', paddingTop: 0, paddingLeft: 10, paddingBottom: 10, backgroundColor: '#fafafa' }}>{this.state.ldata.primary_address_country}</Text>
                            </CollapseBody>
                        </Collapse>
                         */}


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
        username: state.auth.username,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login }, dispatch)
};

export default LeadsBasicInfo = connect(mapStateToProps, mapDispatchToProps)(LeadsBasicInfo);