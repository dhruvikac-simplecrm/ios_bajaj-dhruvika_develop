import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    Switch,
    AlertIOS, TouchableOpacity, ActionSheetIOS, ScrollView
} from 'react-native';

import { Container, Spinner, Header, Title, Content, Card, CardItem, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Row } from 'native-base';

import { connect } from 'react-redux';
import { login, logout , updateCurrency} from '../../actions/auth';
import { bindActionCreators } from 'redux';
import { Navigation } from 'react-native-navigation';
import globals from '../../globals';
import PopupCurrency from './popupCurrency';

import Modal from "react-native-modal"

const Loader = (props)=>{
    return
        <View style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center',
                justifyContent: 'center'
            }} >
                <Modal isVisible={props.isShow}>
                    <View style={{
                        backgroundColor: "grey", padding: 20, borderRadius: 5,
                        borderBottomWidth: 5, borderBottomColor: "yellow",
                        flex: 1, flexWrap: "wrap", justifyContent: "flex-start"
                    }}>
                       {/* {this.state.loading && */}
                                <View>
                                    <Spinner color='red' />
                                </View>
                        {/* } */}

                    </View>
                </Modal>
            </View>
}

export default Loader