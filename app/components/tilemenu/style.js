const React = require("react-native");
import { PixelRatio, Platform } from 'react-native';

const { StyleSheet, Dimensions, StatusBar } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);

export default {
  
    item: {
        marginRight: 15
    },

    content: {
        flex: 1,
        justifyContent: 'center',
        minHeight: deviceHeight,
        backgroundColor: '#00000000'
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
            paddingTop: ( Platform.OS === 'ios' ) ? 0 : 0
    },
    text: {
        marginTop: 10,
        fontStyle: 'normal',
        fontSize: 14,
        color: 'white'
    },
    tileContainer1: {
        flex: 1,
        flexDirection: 'row',
        height: deviceHeight < 570 ? deviceHeight/4.7 : deviceHeight/4.6
    },
    tileContainer2: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: deviceHeight/2
    },
    //dashboard
    tile1: {
       // width: deviceWidth/3.33 , 
        flex: 0.633,
        height: containerHeight/4, 
        backgroundColor: '#04AEDA'//'#E604AEDA'//'#04AEDA'
    },

    //recent
    tile2: {
        //width: deviceWidth/3.33, 
        flex: 0.633,
        height: containerHeight/4, 
        backgroundColor: '#8E44AD'//'#E68E44AD'//'#8e44ad'
    },
    //leads
    tile3: {
        //width: deviceWidth/3.33, 
        flex: 0.633,
        height: containerHeight/4, 
        backgroundColor: '#74B512',//'#E674B512'//'#F2A115'
    },
    //accounts
    tile4: {
        // width: 130, 
        flex: 0.5,
        height: 130, 
        backgroundColor: '#F2A115' //'#E6F2A115'//'#CE4E4E'//'#74B512'
    },
    //contacts
    tile5: {
        flex: 0.5,
        // width: 130, 
        height: 130, 
        backgroundColor: '#ED3338'//'#74B512'//'#CE4E4E'
    },
    tile6: {
        // width: 130,
        flex: 0.675,
        height: deviceHeight/2,
        backgroundColor: '#fff'
    },

    
    //location
    tile7: {
        flex: 0.633,
        height: containerHeight/3, 
        backgroundColor: '#D04525' //'#E6D04525'//'#00A94F'//'#D04525'
    },
    //settings
    tile8: {
        flex: 0.633,
        height: containerHeight/3, 
        backgroundColor: '#7DC211',//'#E67DC211'//'#7DC211'
    },
    //opportunities
    tile9: {
        flex: 0.633,
        height: containerHeight/3, 
        backgroundColor: '#00A94F'//'#E600A94F'//'#D04525'//'#00A94F'
    },
    subContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon:{
        textAlign: 'center', 
        marginTop: 1, 
        fontSize: 40, 
        color: 'white'
    }



};
