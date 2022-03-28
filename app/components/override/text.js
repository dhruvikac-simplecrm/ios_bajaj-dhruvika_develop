import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native';

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto'
    }
});

class TextCommon extends Component {

  render() {
    return (
        <Text {...this.props} style={[styles.text,this.props.style]}>{this.props.textToDisplay}</Text>
    );
  }
}

export default TextCommon;
