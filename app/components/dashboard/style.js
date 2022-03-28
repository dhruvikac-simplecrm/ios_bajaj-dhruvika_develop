const React = require("react-native");
import { PixelRatio, Platform } from 'react-native';

const { StyleSheet, Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
  
    item: {
        marginRight: 15
    },
    buttonView: {
        marginRight: 17,
        marginLeft: 17,
        marginTop: 15,
        marginBottom: 0,
        paddingBottom: 0,
    },
    container: {
        flex: 1,
      },
    mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#3D4FFF',
            marginTop: 40,
            marginLeft: 5,
            marginRight: 5,
            paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
    },

    tabContainer: {
        marginBottom: 30, 
        height: deviceHeight/1.21
    },
    text: {
        fontWeight: 'bold', 
        marginTop: 10
    },

    secondContainer: {
        width: deviceWidth, 
        height: 50, 
    },

    pie:{
        marginTop: 10
    }


};
