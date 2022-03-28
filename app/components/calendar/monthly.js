import React, { Component } from 'react';
import { 
    View,
    Alert,
    TextInput,
    ScrollView,
    AlertIOS
 } from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import {Calendar} from 'react-native-calendars';
import styles from './style';

class Monthly extends  Component{


	constructor(props){
        super(props);

        this.state = {};
    this.onDayPress = this.onDayPress.bind(this);
    }

    onDayPress(day) {
        this.setState({
          selected: day.dateString
        });
      }

   


    render() {
        return (
            <Container style={{ backgroundColor: 'white', justifyContent: 'center', height: null}} >
            <ScrollView style={styles.calendarContainer}>


<Calendar
          style={styles.calendar}
          current={'2019-01-08'}
        //   minDate={'2019-01-01'}
        //   maxDate={'2019-01-29'}
          firstDay={1}
          markedDates={{
            '2012-05-23': {selected: true, marked: true},
            '2012-05-24': {selected: true, marked: true, dotColor: 'green'},
            '2012-05-25': {marked: true, dotColor: 'red'},
            '2012-05-26': {marked: true},
            '2012-05-27': {disabled: true, activeOpacity: 0}
          }}
          // disabledByDefault={true}

        />
</ScrollView>
            </Container>

                 
        );
    }
   
}

const mapStateToProps = (state, ownProps) => {
    return {
         isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({login}, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(Monthly);