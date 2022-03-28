import React, {Component}from 'react';
import {View, Text, StyleSheet, FlatList, TouchableHighlight, Dimensions} from 'react-native';
var thisObj;
var deviceHeight = Dimensions.get("window").height;
import globals from "../../globals";
class MyListItem extends Component {

    render() {
        return (
            <View style={{flex: 1}}>
                <TouchableHighlight
                 onPress={this.props.onPress.bind(this)} 
                 underlayColor={globals.colors.blue_default}>
                    <Text style={this.props.style}>{this.props.item.label}</Text>
                </TouchableHighlight>
            </View>
            );
    }
}

export default class MultiSelectBox extends Component {
    
    constructor(props) {
      super(props);
       array = []

      var selectedItemsObj = {};
      if(this.props.selectedItems) {
          var items = this.props.selectedItems.split(',');
          items.forEach(function(item) {
            selectedItemsObj[item] = true;
          });   
      }

      this.state = {
        selectedItems: selectedItemsObj
      };
    }

    clearSelection(){
        this.setState({
            selectedItems: {}
        })
        array = []
    }
    onItemPressed(item) {
       if(this.props.disabled){
           return
       }
        var oldSelectedItems = this.state.selectedItems;
        var itemState = oldSelectedItems[item.value];
        if(!itemState) {
            oldSelectedItems[item.value] = true;
        }
        else {
            var newState = itemState? false: true;
            oldSelectedItems[item.value] = newState;
        }
        this.setState({
            selectedItems: oldSelectedItems,
        });
        
        var arrayOfSelectedItems = [];
        var joinedItems = Object.keys(oldSelectedItems); //fetches keys from all selected and joins it
        joinedItems.forEach(function(value, index) {
            if(oldSelectedItems[value]){
                arrayOfSelectedItems.push(value);//this returns the only selected values
                if(value=== item.value)
                     array.push(item) //this returns the array of selected objects
            }else{
                if(value=== item.value){
                    const indexToRemove = array.indexOf(item)
                    if (indexToRemove !== -1) {
                      array.splice(indexToRemove, 1);
                    }
                }
            }
        });

        let selectedItem = ''
        if(arrayOfSelectedItems.length > 0)
            selectedItem = arrayOfSelectedItems.join();
        this.props.onValueChange(selectedItem, array);
       
        console.log("selectedItems: "+selectedItem)
    }

    componentWillMount() {
        thisObj = this;
    }

    getStyle(item) {
        if(this.props.selectedItems) {
            var items = this.props.selectedItems.split(',');
            if(items.length > 0){
                let isSelected = false;
                items.forEach(element => {
                    if(element === item.value){
                        isSelected = true
                    }
                });
                return isSelected? styles.itemTextSelected : styles.itemText;
            }
        }else{
        
        try {
            // console.log("value = "+thisObj.state.selectedItems[item.value]);
            return thisObj.state.selectedItems[item.value]? styles.itemTextSelected : styles.itemText;
        } catch(e) {
            return styles.itemText;
        }
    }
    }

    _renderItem = ({item}) => {
        return (<MyListItem style={this.getStyle(item)} onPress={this.onItemPressed.bind(this, item)} item={item} />);
    }

    render() {
        return (
            <View style={styles.rootView}>
              {/* <Text style={styles.title}>{this.props.title}</Text> */}
                <FlatList style={styles.list}
                    // initialNumToRender={10}
                    extraData={this.state}
                    data={this.props.data}
                    renderItem={this._renderItem.bind(this)}
                    />
            </View>
            );
    }
}

const styles = StyleSheet.create({
    rootView : {
      borderBottomColor:'grey',
      borderWidth:0.5,
      // borderRadius:10,
        height: 142
    },
    itemText: {
      marginLeft:5,
      marginRight:5,
        padding: 8,
        color: "#000",
        backgroundColor: '#ffffff',
        marginBottom:1,
        marginTop:1,
    },
    itemTextSelected: {
        marginLeft:5,
        marginRight:5,
        padding: 8,
        color: "#fff",
        backgroundColor: globals.colors.blue_default,//'#757575'
        marginBottom:1,
        marginTop:1,
    },
    list: {
        flex: 1,
    },
    title:{
      fontSize: 16,

    },
});