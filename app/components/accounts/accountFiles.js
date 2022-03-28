import React, { Component } from 'react';
import { 
    View,
    Alert,
    TextInput,
    AlertIOS
 } from 'react-native';
import { connect } from 'react-redux';

import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';

//* This file contains the list of all the documents attached through the Document Picker
//* Here the list of Documents API should be integrated and the documents can be shown in a list or a grid view

class Files extends  Component{


	constructor(props){
        super(props);

        this.state = {
            username: '',
            password: ''
        }
    }

   



    render() {
        return (
            <Container style={{ backgroundColor: 'white', justifyContent: 'center', height: null}} >


                    <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 40}} >

                        <Text style={{color: 'grey'}} >No Files</Text>

                    </View>

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

export default Login = connect(mapStateToProps, mapDispatchToProps)(Files);