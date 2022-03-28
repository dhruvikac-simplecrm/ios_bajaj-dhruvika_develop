import React from "react"
import Item from "./Item"
import {FlatList, ScrollView} from "react-native"

// this returns the list view rendered by FlatList: Best Practice
const List = (props) => 
    // <FlatList
    // style={{
    //   flex: 1,marginBottom:40,height:'100%'
    // }}
    // contentContainerStyle={{
    //   paddingBottom: 40, marginBottom:40,height:'100%'
    // }}
    // keyExtractor={(item, index) => index}
    // // style = {{
    // //   flexWrap:'wrap', height:'100%'}}
    //    data = {props.data} 
    //    renderItem = { ({ item, index }) => {
    //                 return <Item item = {item} 
    //                              index = {index} 
    //                              onClick = { () => props.onClick(item, index)}/>
    //   }}
    //   ListFooterComponent={props.renderFooter}
    // /> 



    props.data.map((item, index)=>{
      //it should return the ui part to display the item on screen
      return(
        //This is just a component which has ui part
        <Item item = {item} index = {index}
        onClick = { () => props.onClick(item, index)}/>
     )})

export default List