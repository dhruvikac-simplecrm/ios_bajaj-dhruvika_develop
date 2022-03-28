import React, {
    Component,
    // useState 
} from 'react';
import {
    View,
    Alert,
    TextInput,
    Dimensions,
    StatusBar,
    Image,
    AlertIOS,
    TouchableHighlight,
    Keyboard,
    ActionSheetIOS,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import { Container, Header, Title, Spinner, Content, Form, Item, Picker, Input, Label, Button, Left, Right, Body, Icon, Text, Separator } from 'native-base';
import styles from './style';
import {
    TextField
} from 'react-native-material-textfield';// go to https://github.com/n4kz/react-native-material-textfield for more info
import { Dropdown } from 'react-native-material-dropdown';//go to https://github.com/n4kz/react-native-material-dropdown#readme for more info

import DatePicker from 'react-native-datepicker'
import consts from '../../consts';
import globals from '../../globals';

/**
 * 
 * @param {*} props It can be used to pass data from one component to other 
 * @returns it gives a basic and commonly used textfield with common ui and functionalty
 * createdBy @SonalWararkar
 */
const ExpandableViewRmAllocation = (props) => {

    return <View style={{}}>
        <View style={{ ...styles.collExpSeperator, }}>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                props.component.setState({ rmAllocationVisibility: !props.component.state.rmAllocationVisibility })
            }}>
                <Text style={styles.collExpButton}>{"RM ALLOCATION"}</Text>
            </TouchableOpacity>
        </View>

        {props.component.state.rmAllocationVisibility &&
            <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }}>

                <Dropdown
                    label='Disposition Category*'
                    data={props.component.state.disposition_category_cList}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(value, index) => {
                        props.component.setState({ disposition_category_c: value })
                        console.log("Disposition Category: json = " + JSON.stringify(props.component.state.disposition_category_cList[index]));
                        props.component.setState({
                            dispositions_cList: props.component.state.disposition_category_cList[index].dispositions_c, dispositions_c: ''
                            , appointment_date_time_date: '', prefered_date_time_date: ''
                        })
                    }}
                    value={props.component.state.disposition_category_c}
                />

                {props.component.state.disposition_category_c == 'Follow up' &&
                    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
                        <View style={{ flex: 0.9 }} >
                            <TextField
                                label='Prefered Date Time'
                                autoCapitalize='none'
                                value={props.component.state.prefered_date_time_date}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                textColor='#000'
                                tintColor='red'
                                placeholderTextColor='#000'
                            />
                        </View>
                        <View style={{ flex: 0.1, flexDirection: 'column', justifyContent: 'center' }}>
                            <DatePicker
                                style={{ width: 20 }}
                                date={props.component.state.prefered_date_time_date}
                                mode="datetime"
                                placeholder="select date"
                                format={globals.DEFAULT_FORMAT}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => { props.component.setState({ prefered_date_time_date: date }) }}
                            />
                        </View>
                    </View>
                }

                {props.component.state.disposition_category_c == 'Appointment' &&
                    <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'row', }}>
                        <View style={{ flex: 0.9 }} >
                            <TextField
                                label='Appointment Date Time'
                                autoCapitalize='none'
                                value={props.component.state.appointment_date_time_date}
                                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                                textColor='#000'
                                tintColor='red'
                                placeholderTextColor='#000'
                            />
                        </View>
                        <View style={{ flex: 0.1, flexDirection: 'column', justifyContent: 'center' }}>
                            <DatePicker
                                style={{ width: 20 }}
                                date={props.component.state.appointment_date_time_date}
                                mode="datetime"
                                placeholder="select date"
                                format={globals.DEFAULT_FORMAT}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => { props.component.setState({ appointment_date_time_date: date }) }}
                            />
                        </View>
                    </View>

                }

                <Dropdown
                    label='Dispositions*'
                    data={props.component.state.dispositions_cList}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(value) => { props.component.setState({ dispositions_c: value, meeting_done_c: '', lost_reason_c: '' }) }}
                    value={props.component.state.dispositions_c}
                />

                <Dropdown
                    label='Client Category'
                    data={consts.dropdown.client_category}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(value) => { props.component.setState({ client_category_c: value }) }}
                    value={props.component.state.client_category_c}
                />

                <Dropdown
                    label='Meeting Done'
                    disabled={props.component.state.disposition_category_c != 'Appointment' && props.component.state.dispositions_c != 'Appointment Updated'}
                    data={consts.dropdown.meeting_done_c}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(value) => { props.component.setState({ meeting_done_c: value, who_cancelled_c: '' }) }}
                    value={props.component.state.meeting_done_c}
                />

                <Dropdown
                    label='Who Cancelled'
                    disabled={props.component.state.disposition_category_c != 'Appointment' && props.component.state.dispositions_c != 'Appointment Updated' && props.component.state.meeting_done_c != 'No'}
                    data={consts.dropdown.who_cancelled_c}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(value) => { props.component.setState({ who_cancelled_c: value }) }}
                    value={props.component.state.who_cancelled_c}
                />

                <Dropdown
                    label='Lost Reason'
                    disabled={props.component.state.disposition_category_c != 'Lost' && props.component.state.dispositions_c != 'Lost'}
                    data={consts.dropdown.lost_reason_c}
                    style={{ color: 'black', fontSize: 17, paddingBottom: 0, }}
                    onChangeText={(value) => { props.component.setState({ lost_reason_c: value }) }}
                    value={props.component.state.lost_reason_c}
                />

                <TextField
                    label='Remarks'
                    autoCapitalize='none'
                    value={props.component.state.remarks_c}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(text) => props.component.setState({ remarks_c: text })}
                    textColor='#000'
                    multiline={true}
                    // maxLength={150}
                    // characterRestriction={150}
                    tintColor='red'
                    blurOnSubmit={true}
                    placeholderTextColor='#000'
                />
                <View style={{ height: 60, width: '100%' }} />
            </View>
        }
    </View>
};
export default ExpandableViewRmAllocation;



