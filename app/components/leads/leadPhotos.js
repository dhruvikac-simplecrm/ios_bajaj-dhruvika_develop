import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    FlatList,
    Image,
    ImageBackground,
    AlertIOS,ScrollView,
    Dimensions, Modal, Linking, Platform, TouchableOpacity, ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';

import { Container, Card, Text, Spinner, Content, Button } from 'native-base';
import { login , logout, updateToken} from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { FlatGrid } from 'react-native-super-grid';
import globals from '../../globals';
import { Navigation } from 'react-native-navigation';

import List from "./attachments/List"
import OpenFile from 'react-native-doc-viewer';
import apiCallForToken from '../../controller/ApiCallForToken';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LIMIT = 50;
class LeadPhotos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            username: '',
            password: '',
            module_id: this.props.module_id,
            offset: 0,
            fetching_from_server: false,
            noteArray: [],
            attachmentArray: [],
            isModalVisible: false,
            imageClicked: false,
            clickedIndex: 0,

            fullScreenLoader: false,
            base64StringOfFile: ""
        }
        console.log("PHOTOS: module_id = " + this.state.module_id);

    }


    //This getRelationshipRecords() method gets the recent 10 records at a time, in this we get note ids
    getRelationshipRecords(isShowLoader) {
        //show loader meanwhile
        if(isShowLoader){
              this.showLoader()
        }
       
        let url = globals.home_url + "/getRelationships"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.leads +
            "&module_id=" + this.state.module_id +
            "&link_field_name=" + "notes" +
            "&related_fields=" + globals.LEADS_NOTE_RELATED_FIELDS +
            "&deleted=" + "0" +
            "&order_by=" + "date_entered" +
            "&offset=" + this.state.offset +
            "&limit=" + LIMIT
            + "&url="+this.props.url;

        console.log("getRelationshipRecords: URL: " + url)

        fetch(url, {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
        })
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                console.log('RelationshipRecords: Response:');
                console.log(response);
                if (response.success === true) {
                    if (response.data.info.result_count > 0) {
                        const array = response.data.result;
                        this.setState({
                            fetching_from_server:false,
                            noteArray: [...this.state.noteArray, ...array]
                        })
                        console.log("NOTE_ARRAY: " + this.state.noteArray)
                        //Make a call to get images from all the note ids
                        //   for (let i = 0; i < array.length; i++) {
                        //       const element = array[i];
                        //       this.getAttachedPhotos(element, i);
                        //   }

                        //Display the list of all attachements 
                        if(isShowLoader){
                            this.hideLoader()
                        }

                    } else {
                        this.setFetchingFromServer(false)
                        if(isShowLoader){
                        this.hideLoader()
                        }
                    }
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                   
                    // Alert.alert(
                    //     globals.app_messages.error_string,
                    //     globals.app_messages.token_expired,
                    //     [
                    //     { text: globals.login, onPress: () => this.props.logout() }
                    //                ],
                    //     { cancelable: false }
                    // )


                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.setFetchingFromServer(false)
                            if(isShowLoader){
                            this.hideLoader()
                            }
                            return;
                        }
                        //Get Relationship records, after session generated
                        this.getRelationshipRecords(isShowLoader)

                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.setFetchingFromServer(false)
                    if(isShowLoader){
                    this.hideLoader()
                    }
                    })

                } else {
                    this.setFetchingFromServer(false)
                    if(isShowLoader){
                    this.hideLoader()
                    }
                    Alert.alert('Error', response.data.description);
                }

            })

            .catch(err => {
                console.log(err);
                this.setFetchingFromServer(false)
                if(isShowLoader){
                this.hideLoader()
                }
            });
    }

    hideLoader() {
        this.setState({
            loading: false
        })
    }
    showLoader() {
        this.setState({
            loading: true
        })

    }



    // getAttachedPhotos(element, index){
    //     this.showLoader()
    //     let url = globals.home_url + "/getAttachment"
    //         + "?token_id=" + this.props.token +
    //         "&module_name=" + globals.notes +
    //         "&id=" + element.id ;

    //     console.log("getAttachedPhotos: URL: "+url)

    //     fetch(url, {
    //         method: "GET",
    //         dataType: 'jsonp',
    //         headers: {
    //             'Content-Type': 'application/x-www-form-urlencoded',
    //             'Accept': 'application/json'
    //         },

    //     })
    //         .then((response) => {
    //             return response.json()
    //         })
    //         .then((response) => {

    //             console.log('Note: Attachments Response:');
    //             console.log(response);
    //             const jsonObj = "{\"name\":\""+element.name+"\",\"image\":\""+response.data.result.note_attachment.file+"\"}"
    //             this.state.attachmentArray.push(jsonObj)

    //             if (response.success === true) {
    //                this.setState({
    //                })

    //                if(index == this.state.attachmentArray.length - 1 ){
    //                 this.hideLoader()
    //                }
    //                 console.log("AttachedArray: "+this.state.attachmentArray)
    //             } else {
    //                 this.hideLoader()
    //                 Alert.alert('Error', response.message);
    //             }

    //         })
    //         .catch(err => {
    //             this.hideLoader()
    //             console.log(err);
    //         });
    // }


    setFetchingFromServer = (isFetchingFromServer)=>{
        this.setState({
            fetching_from_server: isFetchingFromServer
        })
    }

    // shouldComponentUpdate(nextProps, nextStates){
    //     console.log("shouldComponentUpdate")
    // }

    componentDidMount() {
        this.getRelationshipRecords(true)
    }

    loadMoreData = () => {
        this.setState({ fetching_from_server: true }, () => {
            clearTimeout(this.timer);

            this.timer = -1;

            this.timer = setTimeout(() => {
                this.setState({
                    //Change the offset here
                    offset : (this.state.noteArray.length)
                })
                //Get data from server
                this.getRelationshipRecords(false)
                
            }, 1500);
        });
    }

    renderFooter() {
        return (
            <View style={styles.footer}>
                <TouchableOpacity activeOpacity={0.9} onPress={this.loadMoreData} style={styles.loadMoreBtn}>
                    <Text style={styles.btnText}>{globals.load_more}</Text>
                    {
                        (this.state.fetching_from_server)
                           ?
                            <ActivityIndicator color="red" style={{ marginLeft: 8 }} />
                            :
                            null
                    }
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        return (
            <View>
            {/* <Container style={{ backgroundColor: 'white', justifyContent: 'center', height: null }} >
                <Content scrollEnabled={false}> */}


                    {this.state.loading &&
                        <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                            <Spinner color='red' />
                        </View>
                    }

                    {this.state.fullScreenLoader == false && this.state.loading == false && this.state.noteArray.length > 0 &&

                        // <ScrollView style={{flex:1}}>
                        //     {/* We have a separate arrow function that is <List> which contains a FlatList */}
                            <List data={this.state.noteArray} onClick={this.onItemClick} renderFooter = {this.renderFooter.bind(this)}/>
                       
                       
                       
                            // </ScrollView>


                        // <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: 10 }} >
                        //      <FlatGrid
                        //         scrollEnabled={false}
                        //         itemDimension={130}
                        //         items={this.state.noteArray}
                        //         style={styles.gridView}
                        //         staticDimension={350}
                        //         // fixed ={ true}
                        //         // spacing={10}

                        //         renderItem={({ item, index }) => (
                        //             <Card>

                        //                 <ImageBackground
                        //                     style={styles.itemContainer}
                        //                     source={{uri:"data:image/png;base64,"+JSON.parse(item).image}}
                        //                 >
                        //                     <View style={styles.itemContainerInside}>
                        //                         <Text style={styles.itemName}>{JSON.parse(item).name}</Text>
                        //                     </View>
                        //                 </ImageBackground>

                        //                 <Text >{item.name}</Text>
                        //                 <Text >{item.filename}</Text>
                        //                 {/* <Image style = {{height:50, width:50}} source = {require('./images/icon_left30.png')}/> */}
                        //             </Card>
                        //         )}
                        //     /> 
                        // </View>

                    }

                    {this.state.loading == false && this.state.noteArray.length == 0 &&
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 40 }} >
                            <Text style={{ color: 'grey' }} >No Data</Text>
                        </View>
                    }

                    {this.state.fullScreenLoader &&
                        //Full screen loading

                        <View style={{
                            width: deviceWidth,
                            // height: deviceHeight, backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center',
                            height: deviceHeight, backgroundColor: 'white', alignItems: 'center',
                            justifyContent: 'center'
                        }}>

                            <View style={{
                                position: 'absolute',
                                /*left: 0,*/
                                // right: deviceWidth/4,
                                alignSelf: 'center',
                                top: 0,
                                borderRadius: 10,
                                bottom: 0,
                                width: deviceWidth / 2,
                                height: deviceHeight / 6,
                                /*flex: 1,*/
                                // backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Spinner style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: 0,
                                    bottom: 0,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }} color='red' />
                                <Text style={{
                                    color: '#fff',
                                    position: 'relative',
                                    top: 20
                                }}>Loading</Text>
                            </View>
                        </View>
                    }
                {/* </Content>

            </Container> */}
            </View>

        );
    }

    /**
     * onItemClick(item, index) : this is used when user clicks on any attachment from the list
     * @param {*} item : Note object
     * @param {*} index : index of 'this.state.noteArray'
     */
    onItemClick = (item, index) => {
        this.setState({
            clickedIndex: index
        })
        // this.showImageViewModal (true)

        //open new screen to show 
        //   this.startNewScreen(item)
        this.getAttachedPhoto(item)
    }

    getAttachedPhoto(note) {
        this.showFullScreenLoader()

        let url = globals.home_url + "/getAttachment"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&id=" + note.id
            + "&url="+this.props.url;

        console.log("getAttachedPhoto: URL: " + url)

        fetch(url, {
            method: "GET",
            dataType: 'jsonp',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },

        })
            .then((response) => {
                return response.json()
            })
            .then((response) => {
                console.log('Note: Attachments Response:');
                console.log(response);

                if (response.success === true) {

                    this.setState({ base64StringOfFile: response.data.result.note_attachment.file })

                    console.log("After updating base64StringOfFile: " + this.state.base64StringOfFile)
                    this.handlePressb64(note)

                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    // Alert.alert(
                    //     globals.app_messages.error_string,
                    //     globals.app_messages.token_expired,
                    //     [
                    //     { text: globals.login, onPress: () => this.props.logout() }
                    //                ],
                    //     { cancelable: false }
                    // )

                    
                    apiCallForToken.getToken(this.props).then(token => {
                        console.log("getToken: token = " + token)
                        if (token == null) {
                            this.hideFullScreenLoader()

                            return;
                        }
                        //Get attached photo, after session generated
                        this.getAttachedPhoto(note)

                    }).catch(error => {
                        console.log("getToken: error = " + error)
                        this.hideFullScreenLoader()

                    })

                } else {
                    Alert.alert('Error', response.data.description);
                    this.hideFullScreenLoader()

                }

            })
            .catch(err => {
                console.log(err);
                this.hideFullScreenLoader()
            });
    }


    handlePressb64 = (note) => {
        //Doc-Viewer supports these formats: pdf, png, jpg, xls, doc, ppt, xlsx, docx, pptx etc
        // const fileFormat = this.props.data.filename.split()
        const [filename, fileExtension] = note.filename.split(/\.(?=[^\.]+$)/);
        console.log("FileName = " + filename + "FileExtention = " + fileExtension);

        if (Platform.OS === 'ios') {
            //To open any supported document we used 'react-native-doc-viewer' library
            OpenFile.openDocb64([{
                base64: this.state.base64StringOfFile,
                fileName: note.filename,
                fileType: fileExtension
            }], (error, url) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(url)
                }
            })

        } else {
            //Android
            OpenFile.openDocb64([{
                base64: this.state.base64StringOfFile,
                fileName: note.filename,
                fileType: fileExtension,
                cache: true /*Use Cache Folder Android*/
            }], (error, url) => {
                if (error) {
                    console.error(error);
                } else {
                    console.log(url)
                }
            })
        }

    }

    hideFullScreenLoader() {
        this.setState({
            fullScreenLoader: false
        })
    }
    showFullScreenLoader() {
        this.setState({
            fullScreenLoader: true
        })

    }


    startNewScreen(item) {
        this.props.navigator.push({
            screen: 'app.AttachmentDetails',
            title: item.filename,
            subtitle: undefined, // navigation bar subtitle of the pushed screen (optional)
            passProps: { data: item, screen: "app.AttachmentDetails" }, // Object that will be passed as props to the pushed screen (optional)
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
            }]
        });
    }

    showImageViewModal = (isVisible) => {
        this.setState({
            imageClicked: isVisible,
            isModalVisible: isVisible,
        })

        //  alert("Cancel: Show Image: "+isVisible)
    }

}


const mapStateToProps = (state, ownProps) => {
    return {
         isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
        token: state.auth.token,
        username: state.auth.username,
        password: state.auth.password,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login , logout, updateToken}, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(LeadPhotos);
