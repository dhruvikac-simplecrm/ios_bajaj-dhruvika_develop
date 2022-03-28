import React, {
    Component,
    // useState 
} from 'react';
import {
    View,
    Alert,
    TextInput,
    Dimensions,
    StatusBar,
    Image,
    AlertIOS,
    TouchableHighlight,
    Keyboard,
    ActionSheetIOS,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Collapse, CollapseHeader, CollapseBody, AccordionList } from 'accordion-collapse-react-native';
import { Container, Header, Title, Spinner, Content, Form, Item, Picker, Input, Label, Button, Left, Right, Body, Icon, Text, Separator } from 'native-base';
import styles from './style';
import {
    TextField
} from 'react-native-material-textfield';// go to https://github.com/n4kz/react-native-material-textfield for more info

/**
 * 
 * @param {*} props It can be used to pass data from one component to other 
 * @returns it gives a basic and commonly used textfield with common ui and functionalty
 * createdBy @SonalWararkar
 */
const ExpandableView = (props) => {
    const isDisabled = props.isDisabled == undefined ? false : props.isDisabled
    openUsersSelector = () => {
        props.component.props.navigator.push({
            screen: 'app.CustomDropdown',
            title: 'Campaigns',
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: {
                moduleName: 'Campaigns', selectedId: props.component.state.campaign_id, onSelected: (data) => {
                    console.log("Custom Callback Lead: onSelected: data = " + JSON.stringify(data))
                    // this.setState({ users_leads_2_name: data.name, users_leads_2users_ida: data.id }); //This line causing problem

                    props.component.setState({campaign_name: data.name, campaign_id: data.id })

                }
            }, // Object that will be passed as props to the pushed screen (optional)
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
    return <View style={{}}>

        <View style={{ ...styles.collExpSeperator, }}>
            <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                props.component.setState({ campaignVisibility: !props.component.state.campaignVisibility })
            }}>
                <Text style={styles.collExpButton}>{"CAMPAIGN DETAILS"}</Text>
            </TouchableOpacity>
        </View>
        {props.component.state.campaignVisibility &&
            <View style={{ flex: 1, marginRight: 10, marginLeft: 15 }}>
                
            <TouchableOpacity onPress={() => {
                if(props.disableCampaign == undefined || props.disableCampaign == false ){
                    openUsersSelector()
                }
                
                }}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                    <View style={{ flex: 0.9 }}>
                        <TextField
                            disabled={true}
                            label={'Campaign'}
                            autoCapitalize='none'
                            value={props.component.state.campaign_name}
                            style={{ color: 'black', fontSize: 17, }}
                            textColor='#000'
                            tintColor='grey'
                            placeholderTextColor='#000'
                        /></View>
                    <Image source={require('../../../images/dropdown.png')}
                        style={{ width: 30, height: 30, alignContent: 'center', alignSelf: 'flex-end', flex: 0.1, paddingBottom: 5 }} />
                </View>
            </TouchableOpacity>

                <TextField
                    label='Organisation'
                    autoCapitalize='none'
                    value={props.component.state.organization_c}
                    style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                    onChangeText={(text) => {
                        props.component.setState({organization_c: text})
                    }}
                    textColor='#000'
                    multiline={true}
                    // maxLength={150}
                    // characterRestriction={150}
                    tintColor='red'
                    blurOnSubmit={true}
                    placeholderTextColor='#000'
                />
            </View>
        }
    </View>
};
export default ExpandableView;



