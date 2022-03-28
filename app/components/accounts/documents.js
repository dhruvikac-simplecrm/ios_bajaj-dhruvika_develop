import React, { Component } from 'react';
import {
    View,
    Alert,
    Image,
    TextInput,
    ScrollView,
    AlertIOS
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Content, Separator, List, Tab, Tabs, TabHeading, ScrollableTab, ListItem, Footer, Label, Item, Thumbnail, Button, Left, Right, Body, Icon, Text } from 'native-base';
import { login } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import Photos from './accountPhotos';
import Files from './accountFiles';


//this file contains two tabs Photos and Documents. Photos tab will contain photos attached and created in the CRM
//and documents will have documents other than photos
class DocumentsAccount extends Component {


    constructor(props) {
        super(props);

        this.state = {
            images_data: this.props.images,
            module_id: this.props.module_id
        }

        console.log(this.state.images_data);


    }

    render() {
        return (
            <Container style={{ backgroundColor: '#ffffff', height: null }}>
                <Content scrollEnabled={false}>
                    <View style={{ padding: 5 }}>
                        <Tabs locked= {true} >
                            <Tab heading={<TabHeading><Icon name="ios-camera" /><Text>Photos</Text></TabHeading>}>
                                <Photos data={this.state.images_data} module_id={this.state.module_id}/>
                            </Tab>
                            <Tab heading={<TabHeading><Icon name="ios-document" /><Text>Documents</Text></TabHeading>}>
                                <Files module_id={this.state.module_id}/>
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
    return bindActionCreators({ login }, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(DocumentsAccount);