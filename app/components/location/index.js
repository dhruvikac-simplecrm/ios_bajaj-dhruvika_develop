import React, { Component } from 'react';
import {
  View,
  Alert,
  TextInput,
  StyleSheet,
  AlertIOS,
  TouchableOpacity,TouchableHighlight,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux';

import { Spinner, Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Fab, Card } from 'native-base';
import { login } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Navigation } from 'react-native-navigation';
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion, Animated, Callout } from 'react-native-maps';
import globals from '../../globals';
let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;
import Geocoder from 'react-native-geocoding';
// Initialize the module (needs to be done only once)
Geocoder.init("AIzaSyDm1vpuJH7G3cbs_6rCJj2XP904WNTGExI"); // use a valid API key
const google_api_key = "AIzaSyC0z6lLx4Bm-95qMx1NhyqLZ25wwSNxAXY";
class Location extends Component {

  //map = null;

  constructor(props) {
    super(props);
this.mapRef = null
    this.state = {
      username: '',
      password: '',
      mapRegion: null,
      lastLat: null,
      lastLong: null,
      // markers: [],
      markers: [],

      region: new AnimatedRegion(
        {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }
      ),
      loading : false,
    }



    this.onMapPress = this.onMapPress.bind(this);

    this.props.navigator.setButtons({
      rightButtons: [
      //   {
      //     id: 'search', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
      //     testID: 'e2e_search', // optional, used to locate this view in end-to-end tests
      //     disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
      //     disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
      //     buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
      //     buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
      //     buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
      //     systemItem: 'search'
      // },
        {
          id: 'home', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
          disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
          buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
          icon: require('../../../images/icon_home24.png'), // for icon button, provide the local image asset name
        },
      ], // see "Adding buttons to the navigator" below for format (optional)
      leftButtons: [
        {
          icon: require('../../../images/hamburger_small.png'), // for icon button, provide the local image asset name
          id: 'menu', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        },

      ],


      animated: true // does the change have transition animation or does it happen immediately (optional)
    });

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }



  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses

      if (event.id === 'menu') {

        this.props.navigator.toggleDrawer({
          side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
          animated: true, // does the toggle have transition animation or does it happen immediately (optional)
          to: 'missing' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
        });
      }

      if(event.id === 'search'){
          //Search button clicked. show near by leads & contacts
          this.setState({loading:true})
          // this.onMapPress 
          
      }

      if (event.id === 'home') {

        Navigation.startSingleScreenApp({

          screen: {
            screen: 'app.TileMenu', // unique ID registered with Navigation.registerScreen
            title: 'Home', // title of the screen as appears in the nav bar (optional)
            navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
          },

          drawer: {
            // optional, add this if you want a side menu drawer in your app
            left: {
              // optional, define if you want a drawer from the left
              screen: 'app.Menu', // unique ID registered with Navigation.registerScreen
              passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
              disableOpenGesture: false, // can the drawer be opened with a swipe instead of button (optional, Android only)
              fixedWidth: 500 // a fixed width you want your left drawer to have (optional)
            },
            style: {
              // ( iOS only )
              drawerShadow: false, // optional, add this if you want a side menu drawer shadow
              contentOverlayColor: 'rgba(0,0,0,0.25)', // optional, add this if you want a overlay color when drawer is open
              leftDrawerWidth: 70, // optional, add this if you want a define left drawer width (50=percent)
              rightDrawerWidth: 50 // optional, add this if you want a define right drawer width (50=percent)
            },
            type: 'TheSideBar', // optional, iOS only, types: 'TheSideBar', 'MMDrawer' default: 'MMDrawer'
            animationType: 'slide-and-scale', //optional, iOS only, for MMDrawer: 'door', 'parallax', 'slide', 'slide-and-scale'
            // for TheSideBar: 'airbnb', 'facebook', 'luvocracy','wunder-list'
            disableOpenGesture: false // optional, can the drawer, both right and left, be opened with a swipe instead of button
          },
          passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
          animationType: 'slide-left'
        });

      }
    }
  }

  //Function to covert address to Latitude and Longitude
  getLocation(address) {
    // var geocoder = new google.maps.Geocoder();
    // geocoder.geocode( { 'address': address}, function(results, status) {

    // if (status == google.maps.GeocoderStatus.OK) {
    //     var latitude = results[0].geometry.location.lat();
    //     var longitude = results[0].geometry.location.lng();
    //     console.log(latitude, longitude);
    //     } 
    // }); 
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address
     + '&key=' + google_api_key;

    fetch(url,
      {
        method: "GET",
        dataType: 'jsonp',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },

    })
      .then((response) => response.json())

      .then((responseJson) => {

        console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
        console.log('Lat ',responseJson.results[0].geometry.location.lat);
        console.log('Lng',responseJson.results[0].geometry.location.lng);
      })
  }


  componentDidMount() {
    //this.getLocation("Gayatri Nagar, IT Park, Nagpur 440022");

    // Geocoder.from("Nagpur")
    //   .then(json => {
    //     var location = json.results[0].geometry.location;
    //     console.log('Nagpur ', location);
    //   })
    //   .catch(error => console.warn(error));

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });

        //After getting user's current location, show leads on map as markers
        this.fetchNearByModules()
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );

    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });

         //After getting user's current location, show leads on map as markers
         this.fetchNearByModules()
      }
    );
  
  
  
  
    //! this is newly added code
    // const myLocMarker = {
    //   coordinate: {
    //     latitude: this.state.latitude + (0.001 * i),
    //     longitude: this.state.longitude + (0.001 * i),
    //   },
    //   key: 'MyCurrentLocation',
    // };

    // this.mapRef.fitToSuppliedMarkers(
    //   myLocMarker,
    //   false, // not animated
    // );

  }

  generateMarkers(dataArr) {
    const result = [];
    for (let i = 0; i < dataArr.length; i++) {
      let data = dataArr[i]
      let latitude  = parseFloat(data.jjwg_maps_lat_c);
      let longitude = parseFloat(data.jjwg_maps_lng_c)
      console.log("generateMarkers: lat = "+latitude+" long = "+longitude);

      const newMarker = {
        coordinate: {
          latitude: latitude,
          longitude: longitude,
        },
        key: data.id,
        title: data.first_name + " "+data.last_name,
        description: 'Lead'
      };
      result.push(newMarker);
    }
    return result;
  }

  onMapPress(e) {
    console.log("onMapPress: e = "+e)
    // this.setState({
    //   markers: [
    //     ...this.state.markers,
    //     ...this.generateMarkers(e.nativeEvent.coordinate),
    //   ],
    // });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  goDetails(marker) {
    // alert('SalesMobi', 'You click the marker');
    Navigation.startSingleScreenApp({
      screen: {
          screen: 'app.Details',
          title: 'Lead',
          animationType: 'slide-horizontal',
      },
          passProps: {lead_id: marker.key}, // simple serializable object that will pass as props to all top screens (optional)
      animationType: 'slide-horizontal'
  });
  }

  setZoom(){
    // his.mapRef.maxZoomLevel(20)
  }

  fetchNearByModules(){
    //Fetch near by leads
    /**
     * https://demo.simplecrmdemo.com/index.php?
     * entryPoint=mobilecrm
     * &method=locations
     * &username=admin
     * &password=Ye%2690%23W%40%21
     * &latitude=21.1210024
     * &longitude=79.04877979999999
     * &module=Leads
     * &lat_field=jjwg_maps_lat_c
     * &long_field=jjwg_maps_lng_c
     * &display_fields=id,first_name,last_name,jjwg_maps_lat_c,jjwg_maps_lng_c
     * &limit_start=0
     * &limit_end=50
     * &distance=10
     */
    
    console.log('fetchNearByModules: inside');

    // let url = globals.demo_instance 
    let url =  this.props.url + "/index.php"
        + "?entryPoint=" + "mobilecrm" 
        + "&module="+globals.leads
        + "&method=" + globals.locations 
        + "&username=" + this.props.username
        + "&password=" + this.props.password 
        + "&latitude=" + this.state.region.latitude 
        +"&longitude=" + this.state.region.longitude
        +"&lat_field=" + globals.latKey
        +"&long_field=" + globals.longKey
        + "&display_fields=" + globals.LOCATION_FIELDS
        + "&limit_start=" + "0"
        + "&limit_end=" + "50"
        + "&distance=" + globals.LOCATION_DISTANCE;
       
        console.log('fetchNearByModules: url = '+url);

    fetch(url, {
        method: "GET",
        dataType: 'jsonp',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },

    })
        .then((response) => {
            return response.json() // << This is the problem
        })
        .then((response) => {
            console.log(response);
            if (response.success == true) {
               //Display the leads on map as markers
               console.log("fetchNearByModules: success true");
             let leadMarkers = this.generateMarkers(response.data)
             this.setState({markers: leadMarkers})

            }  else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                this.setState({ loading: false });

                // Alert.alert(
                //     globals.app_messages.error_string,
                //     globals.app_messages.token_expired,
                //     [
                //     { text: globals.login, onPress: () => this.props.logout() }
                //                ],
                //     { cancelable: false }
                // )
            } else {
                this.setState({ loading: false, isShowLoadMore: false, });
                this.setState({
                    isEmpty: true
                });
            }

        })
        .catch((error) => {
            this.setState({ isShowLoadMore: false, })
            console.error(error);
        });
  }

  render() {
    return (

      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true}
          // followUserLocation={true}
          region={this.state.region}
          maxZoomLevel={20}
          zoomTapEnabled ={true}
          zoomControlEnabled={true}
          // onRegionChange={region => this.setState({ region })}
          showsMyLocationButton
          ref = {refr => this.mapRef = refr}
          // onPress={this.onMapPress}
          onRegionChangeComplete={region => this.setState({ region })}>

          <MapView.Marker
            coordinate={this.state.region}
            title='You'
            style={{textAlign:"center"}}
            description='Your current location.'
          />

          {this.state.markers.map(marker => (
            <MapView.Marker
              title={marker.title}
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor='violet'
              // icon= {require('../../../images/icon_home24.png')} //we can add marker icon like this
              // onPress={() => this.setZoom()}
              >
                 <MapView.Callout tooltip style={{backgroundColor:'white'}} onPress={()=>this.goDetails(marker)}>
                       <TouchableHighlight underlayColor='#dddddd'>
                         <Card>
                            <View style={{ padding:5,}}>
                                  <Text style={{fontSize:16, }}>{marker.title}</Text>
                                  <Text style={{fontSize:12, color:globals.colors.grey }}>{marker.description}</Text>
                            </View>
                          </Card>
                         </TouchableHighlight>
                  </MapView.Callout>
              </MapView.Marker>
          ))}



        </MapView>

        {/* <View>
          <Fab
            style={{ backgroundColor: globals.colors.blue_default }}
            position="bottomRight"
            onPress={() => this.getLocation("Gayatri Nagar, IT Park, Nagpur 440022")}>
            <Icon name="ios-search" />
          </Fab>
        </View> */}


        { this.state.loading &&
        // <View style = {styles.transparantBackground}>
          <View style={styles.background}>
              <Spinner style={styles.loading} color='white' onTouchCancel={false}/>
              <Text style={styles.loadingText}>Fetching near by leads and contacts!</Text>
          </View>
          // </View>
        }
      </View>

    );
  }


}



{/* <View>
              <Text style={{color: '#000'}}>
                { this.state.lastLong } / { this.state.lastLat }
              </Text>
            </View> */}

const mapStateToProps = (state, ownProps) => {
  return {
     isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
    username: state.auth.username,
    password: state.auth.password,
    url: state.auth.url,
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ login }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Location);


// red (default)
// tomato
// orange
// yellow
// gold
// wheat
// tan
// linen
// green
// blue / navy
// aqua / teal / turquoise
// violet / purple / plum
// indigo