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
import globals from '../../globals';

/**
 * 
 * @param {*} props It can be used to pass data from one component to other 
 * @returns it gives a basic and commonly used textfield with common ui and functionalty
 * createdBy @SonalWararkar
 */
const ExpandableViewAddress = (props) => {

    return <View style={{}}>
        <View style={{ ...styles.collExpSeperator, }}>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                props.component.setState({ addressVisibility: !props.component.state.addressVisibility })
            }}>
                <Text style={styles.collExpButton}>{"ADDRESS INFORMATION"}</Text>
            </TouchableOpacity>
        </View>

        {props.component.state.addressVisibility &&
            <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }}>
                <TextField
                    label='Address 1'
                    autoCapitalize='none'
                    value={props.component.state.address_1__c}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(text) => {
                        props.component.setState({ address_1__c: text })
                    }
                    }
                    textColor='#000'
                    multiline={true}
                    // maxLength={150}
                    // characterRestriction={150}
                    tintColor='red'
                    blurOnSubmit={true}
                    placeholderTextColor='#000'
                />
                <TextField
                    label='Address 2'
                    autoCapitalize='none'
                    value={props.component.state.address_2__c}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(text) => props.component.setState({ address_2__c: text })}
                    textColor='#000'
                    multiline={true}
                    // maxLength={150}
                    // characterRestriction={150}
                    tintColor='red'
                    blurOnSubmit={true}
                    placeholderTextColor='#000'
                />

                <Dropdown
                    label='State*'
                    data={props.component.state.statesList}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(value, index) => {
                        props.component.setState({ state_c: value })
                        console.log("States: value = " + value + " index = " + index);
                        console.log("States: json = " + JSON.stringify(props.component.state.statesList[index]));
                        props.component.setState({ city_cList: props.component.state.statesList[index].city, city_c:'',postal_code_cList:[], postal_code_c:'' })
                    }}
                    value={props.component.state.state_c}
                />

                <Dropdown
                    label='City*'
                    data={props.component.state.city_cList}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(value, index) => {
                    props.component.setState({ city_c: value })
                    
                    console.log("City: value = " + value + " index = " + index);
                    console.log("City: json = " + JSON.stringify(props.component.state.city_cList[index]));
                    props.component.setState({ postal_code_cList: props.component.state.city_cList[index].pincode, postal_code_c:'' })
                }}

                    value={props.component.state.city_c}
                />

                <Dropdown
                    label='Postal Code'
                    data={props.component.state.postal_code_cList}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(value) => { props.component.setState({ postal_code_c: value }) }}
                    value={props.component.state.postal_code_c}
                />

            </View>
        }
    </View>
};
export default ExpandableViewAddress;



