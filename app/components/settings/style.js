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
    mtdContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#795548',
        marginTop: 40,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
},
ytdContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9c27b0',
    marginTop: 40,
    marginLeft: 5,
    marginRight: 5,
    paddingTop: ( Platform.OS === 'ios' ) ? 20 : 0
},
    text: {
        marginTop: 10,
        fontStyle: 'normal',
        fontSize: 16
    },

    secondContainer: {
        width: deviceWidth, 
        height: 50, 
    }
};
