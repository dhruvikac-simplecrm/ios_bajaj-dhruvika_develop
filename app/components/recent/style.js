const React = require("react-native");
import { PixelRatio, Platform } from 'react-native';

const { StyleSheet, Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default {
    listItem: {

        backgroundColor: '#fff',
        paddingLeft:0, 
        paddingTop:5,
        paddingBottom:5,
        paddingLeft: 5, 
        marginBottom:0, 
        borderColor:'#0db289',
        borderLeftWidth:3, 
        borderBottomWidth:0, 
        marginLeft:0 
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        minHeight: deviceHeight
      },
    container:{
        backgroundColor: '#f2f2f2'
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
        backgroundColor: '#fff',
        marginTop: 40,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
    mtdContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#795548',
        marginTop: 40,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
    },
    detailViewHeader: {
        color: '#fff',
        fontSize: 18,
    },
    detailViewHeaderText: {
        fontSize: 15,
        color: '#fff'
    },

    ytdContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9c27b0',
        marginTop: 40,
        marginLeft: 5,
        marginRight: 5,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0
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

    detailViewHeader: {
        color: '#fff',
        fontSize: 18,
    },
    detailViewHeaderText: {
        fontSize: 15,
        color: '#fff',
        marginTop: 10
    },
    tabContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#3F51B5'

    },
    footer:
    {
    paddingBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    },
     
    loadMoreBtn:
    {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
    },
    
    btnText:
    {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
    },
    gridView: {
        marginTop: 10,
        flex: 1,
      },
      itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 10,
        height: 150,
      },
      itemContainerInside: {
        justifyContent: 'flex-end',
        borderRadius: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: 30,
        padding: 5
      },
      itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
      },
      itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
      },
};
