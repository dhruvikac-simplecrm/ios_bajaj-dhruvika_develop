import React, { Component } from 'react';
import {
    View,
    Alert,
    Image,
    TextInput,
    AlertIOS,
    Switch,
    Modal,
    TouchableHighlight,
    ActionSheetIOS, 
    Dimensions
} from 'react-native';

import { connect } from 'react-redux';

import { Container, Header, Title, Content, Separator, List, Tab, Tabs, ScrollableTab, ListItem, Footer, Thumbnail, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { Navigation } from 'react-native-navigation';

import globals from '../../globals';
const deviceWidth = Dimensions.get('window').width

class ConvertLead extends Component{

    constructor(props){
        super(props);

        this.state = {
            loading: false,
        }

        this.props.navigator.setButtons({
            rightButtons: [
               
                {
                    id: 'save',
                    testID: 'e2e_action',
                    disableIconTint: true,
                    buttonFontSize: 14,
                    buttonFontWeight: '600',
                    systemItem: 'save'
                }
            ], // see "Adding buttons to the navigator" below for format (optional)


            animated: true // does the change have transition animation or does it happen immediately (optional)
        });

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    }
    onNavigatorEvent(event) { // this is the onPress handler for the two buttons together

        if (event.type == 'NavBarButtonPress') {
            if (event.id == 'edit') {

            }

            if (event.id == 'action') {

            }
        }

    }

    render(){
        return(

            <Container style={{ backgroundColor: '#ffffff' }} >
            <Content>
            <Tabs
            tabBarUnderlineStyle={{ backgroundColor: '#ffbc00' }} 
            renderTabBar={() => <ScrollableTab />
            }>
                        <Tab style={{ backgroundColor: 'white' }} 
                        activeTabStyle={{ backgroundColor: 'white', borderColor: '#fff' }} 
                        activeTextStyle={{ fontSize: 14, color: '#000' }} 
                        tabStyle={{ backgroundColor: 'white' }} 
                        textStyle={{ fontSize: 14, color: 'grey' }} 
                        heading="Contact">
                        
                        </Tab>
                        <Tab style={{ backgroundColor: 'white' }} 
                        activeTabStyle={{ backgroundColor: 'white', borderColor: '#fff' }} 
                        activeTextStyle={{ fontSize: 14, color: '#000' }} 
                        tabStyle={{ backgroundColor: 'white' }} 
                        textStyle={{ fontSize: 14, color: 'grey' }} 
                        heading="Account">

                        </Tab>
                        <Tab style={{ backgroundColor: 'white' }} 
                        activeTabStyle={{ backgroundColor: 'white', 
                        borderColor: '#fff' }} 
                        activeTextStyle={{ fontSize: 14, color: '#000' }} 
                        tabStyle={{ backgroundColor: 'white' }} 
                        textStyle={{ fontSize: 14, color: 'grey' }} 
                        heading="Opportunity">

                        </Tab>

                    </Tabs>

            </Content>



            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
         isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
        token: state.auth.token
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(ConvertLead);