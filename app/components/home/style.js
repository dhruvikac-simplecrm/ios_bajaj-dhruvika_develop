const React = require("react-native");
import { PixelRatio, Platform } from 'react-native';
import globals from '../../globals';

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
    stylecamera:{
        position: 'absolute',
        backgroundColor: globals.colors.blue_default,
        top: 100,
        left:100,
        width:40,
        height:40,
        textAlign: 'center',
        borderRadius:40/2
      },
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
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
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
    },
    card: {
        flex:1,
        justifyContent:'flex-start', 
        alignItems:'flex-start',
        marginLeft: 10,
        marginTop: 5,
        height: 35,
        width: 35
    }, 

    menuTextItem: {
        marginTop: 5, 
        marginLeft: 15, 
        fontSize: 18, 
    },

    leadBox:{
        backgroundColor:'#74B512',//'#F2A115',//#4E9ACF
        width:30,
        height: 30,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        paddingTop:1,
        paddingBottom:2,
        paddingLeft:2,
        paddingRight:2, 
        borderRadius:2
    }, 

    homeBox:{
        backgroundColor:'#795548',
        width:30,
        height: 30,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        paddingTop:1,
        paddingBottom:2,
        paddingLeft:2,
        paddingRight:2, 
        borderRadius:2
    },

    accountBox:{
        backgroundColor:'#F2A115',//'#CE4E4E',//'#74B512',//#ffc000
        width:30,
        height: 30,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        paddingTop:1,
        paddingBottom:2,
        paddingLeft:2,
        paddingRight:2, 
        borderRadius:2
    },

    contactBox:{
        backgroundColor:'#CE4E4E',//#6D17E5
        width:30,
        height: 30,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        paddingTop:1,
        paddingBottom:2,
        paddingLeft:2,
        paddingRight:2, 
        borderRadius:2
    },

    dealBox:{
        backgroundColor:'#74B512',//'#00A94F',//#6A800D
        width:30,
        height: 30,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        paddingTop:1,
        paddingBottom:2,
        paddingLeft:2,
        paddingRight:2, 
        borderRadius:2
    },

    locationBox:{
        backgroundColor:'#D04525',//'#00A94F',//'#D04525',//#ff0000
        width:30,
        height: 30,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        paddingTop:1,
        paddingBottom:2,
        paddingLeft:2,
        paddingRight:2, 
        borderRadius:2
    },

    settingsBox:{
        backgroundColor:'#7DC211',//'#7DC211',//#7A0B44
        width:30,
        height: 30,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        paddingTop:1,
        paddingBottom:2,
        paddingLeft:2,
        paddingRight:2, 
        borderRadius:2
    },

    signOutBox:{
        backgroundColor:'#00A94F',//'#EC5152',
        width:30,
        height: 30,
        marginLeft: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        paddingTop:1,
        paddingBottom:2,
        paddingLeft:2,
        paddingRight:2, 
        borderRadius:2
    },

    divider:{

        borderBottomColor: '#F4F4F4',
        borderBottomWidth: 1,
        marginTop: 20

    }





};
