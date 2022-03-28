import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Input } from "native-base";

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto'
    }
});

class InputNativeBaseCommon extends Component {

  render() {
    return (
        <Input {...this.props} style={[styles.text,this.props.style]} />
    );
  }
}

export default InputNativeBaseCommon;
