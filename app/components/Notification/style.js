const React = require("react-native");
import { PixelRatio, Platform } from "react-native";

const { StyleSheet, Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  imageView: {
    alignItems: "center",
    width: deviceWidth,
    height: deviceHeight / 7,
    justifyContent: "center",
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

    footer:
    {
    paddingBottom: 5,
    paddingTop: 5,
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
    
  renderView: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: "white",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    margin: 10,
    paddingStart: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  renderImage: {
    height: 20,
    width: 20,
    tintColor: "red",
    marginStart: 20,
    tintColor:"orange"
  },
  descStyles: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
  },
  dateStyles: {
    fontSize: 14,
    fontWeight: "500",
    color: "darkgray",
  },
  leadStyle: {
    fontSize: 14,
    fontWeight: "500",
    color: "orange",
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
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#fff",
    position: "relative",
    top: 20,
  },
  loaderBackground: {
    position: "absolute",
    /*left: 0,*/
    // right: deviceWidth/4,
    alignSelf: "center",
    top: 0,
    borderRadius: 10,
    bottom: 0,
    width: deviceWidth / 2,
    height: deviceHeight / 6,
    /*flex: 1,*/
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    alignItems: "center",
    justifyContent: "center",
  },
};
