const React = require("react-native");
import { PixelRatio, Platform } from 'react-native';

const { StyleSheet, Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
    imageView: {
        alignItems: 'center', 
        width: deviceWidth, 
        height: deviceHeight/7, 
        justifyContent: 'center'        
    },
    item: {
        marginRight: 15,
        paddingLeft: 5,
    },
    passwordView: {
        marginRight: 17,
        marginLeft: 17,
        marginBottom: 0,
        paddingBottom: 0,
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    loadingText: {
        color: '#fff',
        position: 'relative',
        top: 20
      },
      loaderBackground: {
        position: 'absolute',
        /*left: 0,*/
        // right: deviceWidth/4,
        alignSelf: 'center',
        top: 0,
        borderRadius: 10,
        bottom: 0,
        width: deviceWidth/2,
        height: deviceHeight/6,
        /*flex: 1,*/
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
      }
};
