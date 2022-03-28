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
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 0,
        backgroundColor: 'transparent',
      },
      bubble: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
      },
      button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
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

    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },

      map: {
        ...StyleSheet.absoluteFillObject,
      },
   

    text: {
        marginTop: 10,
        fontStyle: 'normal',
        fontSize: 16
    },

    secondContainer: {
        width: deviceWidth, 
        height: 50, 
    },

    background: { position: 'absolute',
  /*left: 0,*/
  // right: deviceWidth/4,
  alignSelf: 'center',
  top: deviceHeight/4,
  borderRadius: 10,
  bottom: 0,
  width: deviceWidth * 3/4,
  height: deviceHeight/5,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  alignItems: 'center',
  justifyContent: 'center', marginTop:30},

  transparantBackground: { position: 'absolute',
  /*left: 0,*/
  // right: deviceWidth/4,
  alignSelf: 'center',
  top: deviceHeight,
  bottom: 0,
  width: deviceWidth,
  height: deviceHeight,
  backgroundColor: 'transparant',
  alignItems: 'center',
  justifyContent: 'center'},

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
    top: 20,
    padding:10,
  },
};
