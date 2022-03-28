import React from "react"
import { View, Image } from 'react-native'
import { Container, Header, Title, Spinner, Content, Form, Item, Picker, Input, Label, Button, Left, Right, Body, Icon, Text } from 'native-base';
import globals from '../../globals'

const PickerDropdown = (props) =>
    <View style = {{flex:1}}>
        <Text style={{ fontSize: 12, color: globals.colors.grey, marginBottom: -5, marginTop: 10, marginBottom:3 }}>{props.label === undefined || props.label === '' ? props.title : props.label}</Text>
        <Picker
            mode="dropdown"
            iosHeader={props.title}
            textStyle={{ marginLeft: -10 }}
            iosIcon={<Image source={require('../../../images/dropdown.png')}
                style={{ width: 27, height: 27, tintColor: globals.colors.grey }} />}
            placeholderStyle={{ color: "grey" }}
            style={{ width: '100%', borderWidth: 0.5, borderColor: 'grey' }}
            selectedValue={props.selectedValue}
            onValueChange={(value, index) => {
                console.log("value = " + value + " index = " + index)
                props.onValueChange(value)
            }}
        >
            {props.data.map((item, index) => {
                return <Picker.Item label={item.label} value={item.value} />
            })}
        </Picker>
    </View>

export default PickerDropdown;
