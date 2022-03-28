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
import LeadPhotos from './leadPhotos';
import LeadFiles from './leadFiles';

class LeadsDocuments extends Component {


    constructor(props) {
        super(props);

        this.state = {
            images_data: this.props.images,
            module_id: this.props.module_id
        }

        console.log("module_id is: "+this.state.module_id)
        console.log(this.state.images_data);

    }

    render() {
        return (
            <Container style={{ backgroundColor: '#ffffff', height: null }}>
                <Content scrollEnabled={false}>
                    <View style={{ padding: 5 }}>
                        <Tabs locked= {true} >
                            <Tab heading={<TabHeading><Icon name="ios-camera" /><Text>Photos</Text></TabHeading>}>
                                <LeadPhotos data={this.state.images_data} module_id={this.state.module_id} />
                            </Tab>
                            <Tab heading={<TabHeading><Icon name="ios-document" /><Text>Documents</Text></TabHeading>}>
                                <LeadFiles module_id={this.state.module_id}/>
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

export default Login = connect(mapStateToProps, mapDispatchToProps)(LeadsDocuments);