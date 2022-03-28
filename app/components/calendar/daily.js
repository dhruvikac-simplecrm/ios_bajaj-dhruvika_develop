import React, { Component } from 'react';
import {
  View,
  Alert,
  TextInput,
  AlertIOS,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActionSheetIOS
} from 'react-native';
import { connect } from 'react-redux';

import { Text, Spinner, Container, Content } from 'native-base';
import { login, logout, updateToken } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { Agenda } from 'react-native-calendars';
import styles from './style';
import globals from '../../globals';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get("window").height;
const containerHeight = deviceHeight - (60 + StatusBar.currentHeight);
import { Navigation } from 'react-native-navigation';
import apiCallForToken from '../../controller/ApiCallForToken';
const today = new Date();
let date = today.getFullYear() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getDate();


//* this file shows a list of all the calls, meetings and tasks which are planned 
class Daily extends Component {

  constructor(props) {
    super(props);

    this.agendaRef = null;

    this.state = {
      items: {},
      fetching_from_server: false,
      loading: true,
      basic: true,
      total_count: 0,
      datas: []
    };

    this.props.navigator.setButtons({
      rightButtons: [
        {
          id: 'add', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
          testID: 'e2e_rules', // optional, used to locate this view in end-to-end tests
          disabled: false, // optional, used to disable the button (appears faded and doesn't interact)
          disableIconTint: true, // optional, by default the image colors are overridden and tinted to navBarButtonColor, set to true to keep the original image colors
          buttonColor: 'blue', // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontSize: 14, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
          buttonFontWeight: '600', // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
          systemItem: 'add'
        },

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

    this.props.navigator.setDrawerEnabled({
      side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
      enabled: true // should the drawer be enabled or disabled (locked closed)
    });
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'search') { // this is the same id field from the static navigatorButtons definition
        AlertIOS.alert('SalesMobi', 'You pressed search button');
      }

      if (event.id == 'menu') {

        this.props.navigator.toggleDrawer({
          side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
          animated: true, // does the toggle have transition animation or does it happen immediately (optional)
          to: 'missing' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
        });
      }
      if (event.id == 'add') {

        ActionSheetIOS.showActionSheetWithOptions({
          options: ['Cancel', 'Log Call', 'Schedule Meeting', 'Create Task'],
          //destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
          (buttonIndex) => {
            if (buttonIndex === 1) {
              //AlertIOS.alert('SalesMobi', 'You have to create a call');  
              this.props.navigator.push({
                screen: 'app.CreateCallCalendar',
                title: 'Log Call',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: {}, // Object that will be passed as props to the pushed screen (optional)
                animated: true, // does the push have transition animation or does it happen immediately (optional)
                animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                backButtonTitle: 'Back', // override the back button title (optional)
                backButtonHidden: false, // hide the back button altogether (optional)
                navigatorStyle: { navBarTextColor: 'black' }, // override the navigator style for the pushed screen (optional)
                navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
                // enable peek and pop - commited screen will have `isPreview` prop set as true.
                previewView: undefined, // react ref or node id (optional)
                previewHeight: undefined, // set preview height, defaults to full height (optional)
                previewCommit: true, // commit to push preview controller to the navigation stack (optional)
                previewActions: [{ // action presses can be detected with the `PreviewActionPress` event on the commited screen.
                  id: '', // action id (required)
                  title: '', // action title (required)
                  style: undefined, // 'selected' or 'destructive' (optional)
                  actions: [], // list of sub-actions
                }],
              });
            }

            if (buttonIndex === 2) {
              this.props.navigator.push({
                screen: 'app.CreateMeetingCalendar',
                title: 'Schedule Meeting',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: {}, // Object that will be passed as props to the pushed screen (optional)
                animated: true, // does the push have transition animation or does it happen immediately (optional)
                animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                backButtonTitle: 'Back', // override the back button title (optional)
                backButtonHidden: false, // hide the back button altogether (optional)
                navigatorStyle: { navBarTextColor: 'black' }, // override the navigator style for the pushed screen (optional)
                navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
                // enable peek and pop - commited screen will have `isPreview` prop set as true.
                previewView: undefined, // react ref or node id (optional)
                previewHeight: undefined, // set preview height, defaults to full height (optional)
                previewCommit: true, // commit to push preview controller to the navigation stack (optional)
                previewActions: [{ // action presses can be detected with the `PreviewActionPress` event on the commited screen.
                  id: '', // action id (required)
                  title: '', // action title (required)
                  style: undefined, // 'selected' or 'destructive' (optional)
                  actions: [], // list of sub-actions
                }],
              });
            }

            if (buttonIndex === 3) {
              this.props.navigator.push({
                screen: 'app.CreateTaskCalendar',
                title: 'Create Task',
                subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
                passProps: {}, // Object that will be passed as props to the pushed screen (optional)
                animated: true, // does the push have transition animation or does it happen immediately (optional)
                animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
                backButtonTitle: 'Back', // override the back button title (optional)
                backButtonHidden: false, // hide the back button altogether (optional)
                navigatorStyle: { navBarTextColor: 'black' }, // override the navigator style for the pushed screen (optional)
                navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
                // enable peek and pop - commited screen will have `isPreview` prop set as true.
                previewView: undefined, // react ref or node id (optional)
                previewHeight: undefined, // set preview height, defaults to full height (optional)
                previewCommit: true, // commit to push preview controller to the navigation stack (optional)
                previewActions: [{ // action presses can be detected with the `PreviewActionPress` event on the commited screen.
                  id: '', // action id (required)
                  title: '', // action title (required)
                  style: undefined, // 'selected' or 'destructive' (optional)
                  actions: [], // list of sub-actions
                }],
              });
            }
          });


      }

      if (event.id == 'home') {

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

  componentDidMount = () => {
    this.getPlannedActivities();
  };




  getPlannedActivities() {
    var data = [];
    var proceed = false;
    var total_count = 0;


    //! old url
    // let url = globals.home_url + "/uhaindex"  + "?module_name=" + globals.users + "&" +
    // globals.token_id + "=" + this.props.token + "&fields=id,name,date_entered" + "&module_id=" + this.props.assigned_user_id +
    // "&status_array=Planned,In Progress,Not Started";

    let url = globals.home_url + "/calendar" +
      "?module_name=Calls,Meetings,Tasks" +
      "&token_id=" + this.props.token +
      "&fields=id,name,date_entered,date_modified,parent_type,parent_id,status,assigned_user_id,date_start,date_end" +
      "&assigned_user_id=" + this.props.assigned_user_id +
      "&status_array=Planned,In Progress,Not Started"
      + "&url=" + this.props.url;

    console.log('planned acitivities url: ', url);

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

        console.log('planned activities api response');
        console.log(response);
        proceed = true;
        if (response.success === true) {
          total_count = response.data.info.Calls.total_count + response.data.info.Meetings.total_count + response.data.info.Tasks.total_count;
          if (total_count === 0) {

            Alert.alert('Error', 'There are no planned activities');

          } else {

            if (typeof response.data.result !== 'undefined') {
              this.setState({ datas: [...this.state.datas, ...response.data.result], loading: false });

              total_count = this.state.datas.length;

              //console.log('total count: ' + total_count);
              this.setState({ total_count: total_count });

              for (var i = 0; i < total_count; i++) {
                data.push({
                  "id": this.state.datas[i].id,
                  "module": this.state.datas[i].module,
                  "date_start": this.state.datas[i].date_start,
                  "date_due": this.state.datas[i].date_due,
                  "summary": this.state.datas[i].name,

                });
              }
              //console.log('final object: ', data);
              this.setState({ datas: data });
            }

          }
          this.setState({ dataHasValue: true });
          this.setState({ loading: false });
        } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
          // Alert.alert(
          //   globals.app_messages.error_string,
          //   globals.app_messages.token_expired,
          //   [
          //     { text: globals.login, onPress: () => this.props.logout() }
          //   ],
          //   { cancelable: false }
          // )

          apiCallForToken.getToken(this.props).then(token => {
            console.log("getToken: token = " + token)
            if (token == null) {
                this.setState({ loading: false, disable: false });
                this.setState({ dataHasValue: true });
                return;
            }
            //get the call details, after session generated
            this.getPlannedActivities()
        }).catch(error => {
            console.log("getToken: error = " + error)
            this.setState({ loading: false, disable: false });
            this.setState({ dataHasValue: true });
        })


        } else {
          this.setState({ dataHasValue: true });
          this.setState({ loading: false });
          Alert.alert('Error', response.message);
          // Alert.alert(
          //   globals.app_messages.error_string,
          //   // response.data.description

          //   ////currently hide this, as token expiration functionality is not proper
          //   globals.app_messages.token_expired,
          //   [
          //     { text: 'Login', onPress: () => this.props.logout() },

          //   ],
          //   { cancelable: false }
          // );
        }

      })
      .catch(err => {
        console.log(err);
        this.setState({ dataHasValue: true });
        this.setState({ loading: false });
      });

  }




  render() {
    const agendaHeight = deviceHeight - 100
    return (
      <Container>

        <Content>
          {this.state.loading &&
            <View style={[styles.content, { marginTop: containerHeight / 3 }]}>
              <Spinner color='red' />
            </View>
          }

          {this.state.loading === false &&
            <View>
              <Agenda
                ref={refs => this.agendaRef = refs}
                style={{ height: agendaHeight, flex: 0.9 }}
                items={this.state.items}
                loadItemsForMonth={this.loadItems.bind(this)}
                //selected={this.timeToString(date)}
                renderItem={this.renderItem.bind(this)}
                renderEmptyDate={this.renderEmptyDate.bind(this)}
                renderEmptyData={this.renderEmptyDate.bind(this)}
                rowHasChanged={this.rowHasChanged.bind(this)}
                //onDayPress={(day)=>{console.log(day)}}
                // markingType={'period'}
                // markedDates={{
                //    '2017-05-08': {textColor: '#666'},
                //    '2017-05-09': {textColor: '#666'},
                //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
                //    '2017-05-21': {startingDay: true, color: 'blue'},
                //    '2017-05-22': {endingDay: true, color: 'gray'},
                //    '2017-05-24': {startingDay: true, color: 'gray'},
                //    '2017-05-25': {color: 'gray'},
                //    '2017-05-26': {endingDay: true, color: 'gray'}}}
                // monthFormat={'yyyy'}
                // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
                //renderDay={(day, item) => (<Text>{day ? day.day: 'item'}</Text>)}
                theme={{
                  agendaKnobColor: globals.colors.blue_default
                }}
                hideKnob={true}

              />
              <TouchableOpacity
                style={{
                  width: 100, alignContent: 'center', alignSelf: "center", alignItems: "center", marginTop: 2.5,
                  padding: 10, borderWidth: 0.5, borderRadius: 5, borderColor: globals.colors.blue_default
                }}
                onPress={() => this.adjustCalendar()}
              >
                <View style={{ width: 30, height: 10, alignSelf: 'center', backgroundColor: globals.colors.blue_default, borderRadius: 10 }}></View>
              </TouchableOpacity>
            </View>
          }

        </Content>


      </Container>





    );
  }

  adjustCalendar = () => {
    // alert("adjustCalendar: KNOB button clicked")
    console.log("adjustCalendar: this.agendaRef = " + this.agendaRef)
    console.log("adjustCalendar: this.agendaRef.scrollY json= " + JSON.stringify(this.agendaRef.state.scrollY))
    
    if (JSON.stringify(this.agendaRef.state.scrollY) == 0) {
      //Calendar already opened, collapse it.
      console.log("adjustCalendar: Scroll is 0 ")
      this.agendaRef.chooseDay(this.agendaRef.state.selectedDay);
    } else {
      //Expand the Calendar
      console.log("adjustCalendar: Scroll is at: 364 or more")
      this.agendaRef.setScrollPadPosition(0, true);
      this.agendaRef.enableCalendarScrolling();
    }
  }

  loadItems(day) {
    this.state.items = [];
    //console.log(this.state.total_count);
    //  setTimeout(() => {

    //here the loop is consist of the dates on which the activity is planned.
    //we need all the planned activities in the daily view on the exact same date as there due or start date
    //1. to achieve it we need to loop through all the elements and get the date from the item
    //2. after getting the date from the item just set the items data to that particular date

    // this.state.items[currDate] = [];

    for (let i = 0; i < this.state.total_count; i++) {
      const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      //console.log('str time before: ', time);

      const strTime = this.timeToString(time);
      var startDateToSplit = this.state.datas[i].date_start;
      var dueDateToSplit = this.state.datas[i].date_due;
      //console.log('due date before: ',startDateToSplit);
      //console.log('due date after: ', globals.stringSeparator(startDateToSplit));

      if (startDateToSplit) {
        //console.log(startDateToSplit);
        const currDate = this.timeToString(globals.stringSeparator(startDateToSplit));
        //console.log('due date: ', currDate);
        if (!this.state.items[currDate]) {
          //if(this.state.items[currDate])
          this.state.items[currDate] = [];
        } else {

        }
        this.state.items[currDate].push({
          name: this.state.datas[i].summary,
          date: this.state.datas[i].date_start,
          module: this.state.datas[i].module,
          id: this.state.datas[i].id,
          height: 70

          //Math.max(50, Math.floor(Math.random() * 150))
        });

      }

      if (dueDateToSplit) {
        const currDate = this.timeToString(globals.stringSeparator(dueDateToSplit));
        //console.log('due date: ', currDate);
        if (!this.state.items[currDate]) {
          //if(this.state.items[currDate])
          this.state.items[currDate] = [];
        }
        this.state.items[currDate].push({
          name: this.state.datas[i].summary,
          date: this.state.datas[i].date_due,
          module: this.state.datas[i].module,
          id: this.state.datas[i].id,
          height: 70

          //Math.max(50, Math.floor(Math.random() * 150))
        });
      }


    }

    //console.log(this.state.items);

    if (this.state.items) {

      const newItems = {};
      Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });
      this.setState({
        items: newItems
      });
    }



    // console.log(newItems);
    //console.log('date items: ', this.state.items);
    //}, 1000);
    // console.log(`Load Items for ${day.year}-${day.month}`);

  }

  removeDup() {
    const names = ['John', 'Paul', 'George', 'Ringo', 'John'];

    let unique = {};
    names.forEach(function (i) {
      if (!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }






  onPressButton(id, module) {
    //console.log('clicked item: ', module);
    if (module === 'Calls') {
      this.props.navigator.push({
        screen: 'app.CallDetailsCalendar',
        title: '',
        subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
        passProps: { id: id, module: module }, // Object that will be passed as props to the pushed screen (optional)
        animated: true, // does the push have transition animation or does it happen immediately (optional)
        animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        backButtonTitle: 'Back', // override the back button title (optional)
        backButtonHidden: false, // hide the back button altogether (optional)
        navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
        navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
        // enable peek and pop - commited screen will have `isPreview` prop set as true.
        previewView: undefined, // react ref or node id (optional)
        previewHeight: undefined, // set preview height, defaults to full height (optional)
        previewCommit: true, // commit to push preview controller to the navigation stack (optional)
        previewActions: [{ // action presses can be detected with the `PreviewActionPress` event on the commited screen.
          id: '', // action id (required)
          title: '', // action title (required)
          style: undefined, // 'selected' or 'destructive' (optional)
          actions: [], // list of sub-actions
        }],
      })
    }

    if (module === 'Meetings') {
      this.props.navigator.push({
        screen: 'app.MeetingDetailsCalendar',
        title: '',
        subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
        passProps: { id: id, module: module }, // Object that will be passed as props to the pushed screen (optional)
        animated: true, // does the push have transition animation or does it happen immediately (optional)
        animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        backButtonTitle: 'Back', // override the back button title (optional)
        backButtonHidden: false, // hide the back button altogether (optional)
        navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
        navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
        // enable peek and pop - commited screen will have `isPreview` prop set as true.
        previewView: undefined, // react ref or node id (optional)
        previewHeight: undefined, // set preview height, defaults to full height (optional)
        previewCommit: true, // commit to push preview controller to the navigation stack (optional)
        previewActions: [{ // action presses can be detected with the `PreviewActionPress` event on the commited screen.
          id: '', // action id (required)
          title: '', // action title (required)
          style: undefined, // 'selected' or 'destructive' (optional)
          actions: [], // list of sub-actions
        }],
      })
    }

    if (module === 'Tasks') {
      this.props.navigator.push({
        screen: 'app.TaskDetailsCalendar',
        title: '',
        subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
        passProps: { id: id, module: module }, // Object that will be passed as props to the pushed screen (optional)
        animated: true, // does the push have transition animation or does it happen immediately (optional)
        animationType: 'slide-horizontal', // 'fade' (for both) / 'slide-horizontal' (for android) does the push have different transition animation (optional)
        backButtonTitle: 'Back', // override the back button title (optional)
        backButtonHidden: false, // hide the back button altogether (optional)
        navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
        navigatorButtons: {}, // override the nav buttons for the pushed screen (optional)
        // enable peek and pop - commited screen will have `isPreview` prop set as true.
        previewView: undefined, // react ref or node id (optional)
        previewHeight: undefined, // set preview height, defaults to full height (optional)
        previewCommit: true, // commit to push preview controller to the navigation stack (optional)
        previewActions: [{ // action presses can be detected with the `PreviewActionPress` event on the commited screen.
          id: '', // action id (required)
          title: '', // action title (required)
          style: undefined, // 'selected' or 'destructive' (optional)
          actions: [], // list of sub-actions
        }],
      })
    }

  }

  renderItem(item) {
    return (

      <TouchableOpacity
        onPress={() => this.onPressButton(item.id, item.module)}
      >
        <View style={[styles.dateIitem, { height: null }]}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
          <Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic' }}>{globals.getFormatedTime(item.date)}</Text>
          <Text style={{ fontSize: 14, color: globals.colors.grey, fontStyle: 'italic', marginBottom: 0 }}>{item.module}</Text>
        </View>
      </TouchableOpacity>

    );
  }

  formatDate(dates) {
    console.log(dates);
    let date = new Date(dates)
    console.log(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    console.log(strTime);
    return strTime;
  }

  renderEmptyDate() {
    return (
      <View style={{
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 17,
        marginBottom: 20
      }}>
        <View style={{ height: 25 }}><Text style={{ color: 'grey' }} >Nothing Planned</Text></View>
      </View>

    );
  }

  rowHasChanged(r1, r2) {
    return r1.name !== r2.name;
  }

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
     isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
    username: state.auth.username,
    password: state.auth.password,
    assigned_user_id: state.auth.assigned_user_id,
    token: state.auth.token,
    url: state.auth.url,
  };
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ logout, updateToken }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Daily);