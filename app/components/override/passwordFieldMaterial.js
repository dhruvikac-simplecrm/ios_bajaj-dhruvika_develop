import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PasswordInputText from 'react-native-hide-show-password-input';

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto',
        fontSize: 14
    }
});

class passwordFieldMaterialCommon extends Component {

  render() {
    return (
        <PasswordInputText {...this.props} style={[styles.text,this.props.style]} />
    );
  }
}

export default passwordFieldMaterialCommon;
