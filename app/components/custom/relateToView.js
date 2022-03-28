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
import styles from '../leads/style';
import {
    TextField
} from 'react-native-material-textfield';// go to https://github.com/n4kz/react-native-material-textfield for more info
import globals from '../../globals';
import { Dropdown } from 'react-native-material-dropdown';//go to https://github.com/n4kz/react-native-material-dropdown#readme for more info

/**
 * 
 * @param {*} props It can be used to pass data from one component to other 
 * @returns it gives a basic and commonly used textfield with common ui and functionalty
 * createdBy @SonalWararkar
 */
const RelateToView = (props) => {
    // const isDisabled = props.isDisabled == undefined ? false : props.isDisabled
    openUsersSelector = () => {
        props.component.props.navigator.push({
            screen: 'app.CustomDropdown',
            title: (props.component.state.module_name == globals.accounts ? 'Clients' : props.component.state.module_name),
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: {
                moduleName: props.component.state.module_name, selectedId: props.component.state.parent_id, onSelected: (data) => {
                    console.log("Custom Callback Lead: onSelected: data = " + JSON.stringify(data))
                    props.component.setState({ parent_name: data.name, parent_id: data.id })

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

        {props.isRelateToDropdown &&
            <Dropdown
                label={globals.label_relate_to}
                data={globals.relateToItems}
                value={props.component.state.module_name}
                style={{ color: 'black', fontSize: 17, marginBottom: 0, paddingBottom: 0 }}
                //onChangeText={(value)=>{this.setState({parent_name:value})}}
                onChangeText={(value) => {
                    props.component.setState({
                        module_name: value, parent_name: '', parent_id: ''
                    })
                }}
            />
        }

        {(props.isRelateToDropdown == undefined || props.isRelateToDropdown == false) &&

            <TextField
                disabled={true}
                label={globals.label_relate_to}
                autoCapitalize='none'
                value={(props.component.state.module_name == globals.accounts ? 'Clients' : props.component.state.module_name)}
                style={{ color: 'black', fontSize: 17, }}
                textColor='#000'
                tintColor='grey'
                placeholderTextColor='#000'
            />
        }

        <TouchableOpacity style={{marginBottom:20}} onPress={() => {
            openUsersSelector()
        }}>
            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
                <View style={{ flex: 0.9 }}>
                    <TextField
                        disabled={true}
                        label={(props.component.state.module_name == globals.accounts ? 'Clients' : props.component.state.module_name)}
                        autoCapitalize='none'
                        value={props.component.state.parent_name}
                        style={{ color: 'black', fontSize: 17, }}
                        textColor='#000'
                        tintColor='grey'
                        placeholderTextColor='#000'
                    /></View>
                <Image source={require('../../../images/dropdown.png')}
                    style={{ width: 20, height: 20, alignContent: 'center', alignSelf: 'flex-end', flex: 0.1, paddingBottom: 5 }} />
            </View>
        </TouchableOpacity>
    </View>
};
export default RelateToView;



