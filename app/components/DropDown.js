import React, {Component} from "react"
import {View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,TextInput, ActionSheetIOS, Keyboard} from "react-native"
const list = ['Cancel', 'Delete', 'Convert Lead']

let viewRef = null;
let textRef = null
let hiddentextRef = null

let selectedValue = "test"
let value = null;

const DropDown = (props)=>{
    value = props.name
    return <TouchableOpacity ref={ref => viewRef = ref} onPress = {()=> onClick(props)}><View style={{paddingBottom:5, paddingTop:5}}>
        <View style = {{paddingTob:5, paddingBottom:5,flexDirection:"row", justifyContent:"space-evenly", alignContent:"flex-start"}}>
             <Text ref={ref => {textRef = ref }}  style={{ fontSize:16, flex:0.95, color:"grey"}}>{props.component.state.name}</Text>
             <Text style={{flex:0.05, color:"grey", textAlign:"center", alignSelf:"flex-end"}}>▼</Text>
        </View>
        <View style = {{height:0.5, backgroundColor:"grey"}}></View>
        <TextInput ref={ref => hiddentextRef = ref} caretHidden={true} accessibilityElementsHidden={true}/>
    </View></TouchableOpacity>
}

const onClick = (props) => {
    // const title = props.name
    // const cancel = "Cancel"
    // const list = [cancel, title, ...props.data]
// const list = props.data
    // viewRef.focus()
       // alert("Clicked")

    //    Keyboard.dismiss()
    //    Keyboard.removeAllListeners("keyboardDidShow");
       hiddentextRef.focus()

        ActionSheetIOS.showActionSheetWithOptions({
            options: list,
            destructiveButtonIndex: 1,
            cancelButtonIndex: 0,

        },
            (buttonIndex) => {
                
                if(buttonIndex===0){
                    return
                }
                if(buttonIndex===1){
                    return
                }
                selectedValue = list[buttonIndex]
                console.log("selectedValue = "+selectedValue)
                textRef.value = selectedValue
                console.log("textRef.value = "+textRef.value)
                props.component.setState({
                    name:selectedValue
                })
                hiddentextRef.focus()
            });
}
export default DropDown

