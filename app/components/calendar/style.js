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
    detailViewHeader: {
      color: '#fff',
      fontSize: 18,
  },
  detailViewHeaderText: {
      fontSize: 15,
      color: '#fff'
  },
    mainContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#FF495F',
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
    content: {
      flex: 1,
      justifyContent: 'center',
      minHeight: deviceHeight,
      backgroundColor: '#00000000'
    },

    dateIitem: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        marginBottom: 10
      },
      emptyDate: {
        height: 15,
        flex:1,
        paddingTop: 30
      },

    secondContainer: {
        width: deviceWidth, 
        height: 50, 
    },

    calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
      },
      calendarContainer: {
        flex: 1,
        backgroundColor: 'gray'
      }
};
