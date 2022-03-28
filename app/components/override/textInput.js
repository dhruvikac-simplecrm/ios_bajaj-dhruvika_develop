import React, { Component, StyleSheet } from 'react';
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto'
    }
});

class TextInputCommon extends Component {

  render() {
    return (
        <TextInput {...this.props} style={[styles.text,this.props.style]} />
    );
  }
}

export default TextInputCommon;
