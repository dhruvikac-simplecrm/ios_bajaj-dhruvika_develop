import React, {Component} from "react"
import {View, Text,TouchableOpacity, Image, StyleSheet} from "react-native"
import globals from "../../../globals";
let array = [];
let date;
export default class Item extends Component{
  
    constructor(props){
      super(props)
      //Convert the date fromat to MMM dd, yyyy
      array = this.props.item.date_entered.split(" ");
      date =  globals.formatDate(array[0])
    }
  
    render(){
      return(
        <TouchableOpacity
           onPress={ () => this.props.onClick(this.props.item, this.props.index)}
           style={styles.item}>
              <View style={{flexDirection:"column"}}>
                  <Text style={styles.title}>{this.props.item.name}</Text>
                  <View style={{flexDirection:"row",  padding:5}}>
                      <Image source={require("../../../../images/attachments.png")} style = {styles.icon}/>
                      <Text style={styles.underlinedText}>{this.props.item.filename}</Text>
                  </View>
                  <Text style={styles.date}>{date}</Text>
              </View>
        </TouchableOpacity>
      )
    }
  }

  //We can create separate js file to store these styles
const styles = StyleSheet.create({
    item:{
        marginLeft:10,
        marginRight:10,
        marginTop:10,
        fontSize:20,
        backgroundColor: '#F5FCFF',
        padding: 10,
        borderColor: globals.colors.color_primary_dark,
        borderWidth:1,
        borderRadius:5
    },

    icon:{
      width:15, 
      height:15, 
      alignContent:"flex-end", 
      justifyContent: 'center', 
      alignSelf: 'center'
    },

    title:{
      fontSize:16, 
      fontWeight:"bold", 
      color:"black"
    },

    underlinedText:{ 
      textAlign:"center", 
      color:"black", 
      fontSize:14, 
      textDecorationLine:"underline", 
      marginLeft:10
    },

    date: {
      textAlign:"left", 
      color:"black", 
      marginLeft:30, 
      fontSize:14
    },

  });