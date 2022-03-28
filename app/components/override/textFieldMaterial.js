import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
    TextField
} from 'react-native-material-textfield';

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto'
    }
});

class textFieldMaterialCommon extends Component {

  render() {
    return (
        <TextField {...this.props} style={[styles.text,this.props.style]} />
    );
  }
}

export default textFieldMaterialCommon;
