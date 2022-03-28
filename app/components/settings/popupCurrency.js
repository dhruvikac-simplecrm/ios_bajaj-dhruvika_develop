import React from "react"
import { View, Text, ScrollView, Button,TouchableOpacity, Dimensions } from "react-native";
import { colors } from "react-native-elements";
import Modal from "react-native-modal"
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const PopupCurrency = (props) => 
    //return the UI
    <View style = {{  backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center',
        justifyContent: 'center'}}>
        <Modal isVisible={true}
        onSwipeCancel = {true}>

        <Text style={{color:"white", fontSize:18, fontWeight:"bold", padding:20}}>Select Currency</Text>

            <View>
            return ({
                props.currencies.map((currency, index)=>
                    //return the list here
                    // console.log("currency name = "+currency.name+" index = "+index)
                    <Text style={{width:"100%",color:"white", flex:1, backgroundColor:"red", padding:10, textAlign:"center", marginLeft:2, marginRight:2, marginBottom:2, borderRadius:20, borderBottomWidth:5, borderBottomColor:"yellow"}}>{currency.name}</Text>
                )
            })
            </View>
        <View>

            <TouchableOpacity onPress = {()=> 
        console.log("cancl")}>
                <Button title="Cancel" />
            </TouchableOpacity>

            <TouchableOpacity onPress = {()=> props.okClick()}>
                <Button title="Ok" />
            </TouchableOpacity>
        </View>
        </Modal>
    </View>

export default PopupCurrency