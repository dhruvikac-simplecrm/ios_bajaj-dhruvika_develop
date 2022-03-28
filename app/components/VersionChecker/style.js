const React = require("react-native");
import { PixelRatio, Platform ,Dimensions} from "react-native";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoImage:{
      height:40,
      width:40,
      alignSelf:"center"
  },
  downarrowImg:{
      height:20,
      width:20,
      alignSelf:"center",
      marginTop:20,
      marginStart:10,
      tintColor:"darkgray"
  },
  newVersionText:{
      fontSize:16,
      fontWeight:"bold",
      textAlign:"left",
      alignSelf:'flex-start',
      color:"black"
  },
  textstyle:{
      fontSize:16,
      textAlign:"left",
      alignSelf:'flex-start',
      color:"black"
  },
  descriptionText:{
    fontSize:16,
    fontWeight:"bold",
    textAlign:"left",
    alignSelf:'flex-start',
    color:"gray",
    marginTop:20
},
updateText:{
    fontSize:16,
    fontWeight:"bold",
    alignSelf:'center',
    color:"white",
},
whatsnewText:{
  fontSize:16,
    fontWeight:"700",
    alignSelf:'center',
    color:"darkgray",
    alignSelf:'flex-end',
    marginTop:20,
    marginStart:140
},

updateBtn:{
  backgroundColor:'red',
  width:100,
  height:50,
  borderRadius:5,
  alignSelf:'flex-end',
  justifyContent:'center',
  marginTop:10
}
};
