import React, { Component } from 'react';
import { 
    View,
    Alert,
    TextInput
 } from 'react-native';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Tab, Tabs, TabHeading, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import Daily from './daily';
import Monthly from './monthly';

class Calendar extends  Component{


	constructor(props){
        super(props);

        this.state = {
            username: '',
            password: ''
        }

        // this.props.navigator.setDrawerEnabled({
        //     side: 'left', // the side of the drawer since you can have two, 'left' / 'right'
        //     enabled: true // should the drawer be enabled or disabled (locked closed)
        //   });


    }

    
    render() {
        return (
            <Container style={{ backgroundColor: '#ffffff', height: null }}>
            <Content scrollEnabled={false}>
                <View style={{ padding: 5 }}>
                    <Tabs locked= {true} >
                        <Tab heading={<TabHeading><Text>Daily</Text></TabHeading>}>
                            <Daily/>
                        </Tab>
                        <Tab heading={<TabHeading><Text>Monthly</Text></TabHeading>}>
                            <Monthly/>
                        </Tab>
                    </Tabs>


                </View>



            </Content>
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

export default Login = connect(mapStateToProps, mapDispatchToProps)(Calendar);