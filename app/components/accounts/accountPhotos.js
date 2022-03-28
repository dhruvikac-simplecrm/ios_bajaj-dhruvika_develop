import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    FlatList,
    Image,
    ImageBackground,
    AlertIOS,
    Dimensions,
    Platform,TouchableOpacity, ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

import { Container, Card, Text, Spinner, Content } from 'native-base';
import { login , logout} from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { FlatGrid } from 'react-native-super-grid';
import globals from '../../globals';

import List from "./attachments/List"
import OpenFile from 'react-native-doc-viewer';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LIMIT = 30;
class Photos extends Component {
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
            "&module_name=" + globals.accounts +
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
                        if(isShowLoader){
                        this.hideLoader()
                        }

                    } else {
                        this.setFetchingFromServer(false)
                        if(isShowLoader){
                        this.hideLoader()
                        }
                    }
                } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    this.setFetchingFromServer(false)
                    if(isShowLoader){
                    this.hideLoader()
                    }
                    Alert.alert(
                        globals.app_messages.error_string,
                        globals.app_messages.token_expired,
                        [
                        { text: globals.login, onPress: () => this.props.logout() }
                                   ],
                        { cancelable: false }
                    )
                    
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

    // getAttachedPhotos(element, index) {

    //     let url = globals.home_url + "/getAttachment"
    //         + "?token_id=" + this.props.token +
    //         "&module_name=" + globals.notes +
    //         "&id=" + element.id;

    //     console.log("getAttachedPhotos: URL: " + url)

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
    //             const jsonObj = "{\"name\":\"" + element.name + "\",\"image\":\"" + response.data.result.note_attachment.file + "\"}"
    //             this.state.attachmentArray.push(jsonObj)

    //             if (response.success === true) {
    //                 this.setState({
    //                 })

    //                 if (index == this.state.attachmentArray.length - 1) {
    //                     this.hideLoader()
    //                 }
    //                 console.log("AttachedArray: " + this.state.attachmentArray)
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
            <Container style={{ backgroundColor: 'white', justifyContent: 'center', height: null }} >
                <Content>

                    {this.state.loading &&
                        <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                            <Spinner color='red' />
                        </View>
                    }

                    {/* {this.state.loading == false && this.state.attachmentArray.length > 0 &&
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: 10 }} >
                            <FlatGrid
                                scrollEnabled={false}
                                itemDimension={130}
                                items={this.state.attachmentArray}
                                style={styles.gridView}
                                staticDimension={350}
                                // fixed ={ true}
                                // spacing={10}

                                renderItem={({ item, index }) => (
                                    <Card>

                                        <ImageBackground
                                            style={styles.itemContainer}
                                            source={{ uri: "data:image/png;base64," + JSON.parse(item).image }}
                                        >
                                            <View style={styles.itemContainerInside}>
                                                <Text style={styles.itemName}>{JSON.parse(item).name}</Text>
                                            </View>
                                        </ImageBackground>
                                    </Card>
                                )}
                            />

                        </View>
                    } */}



                    {this.state.fullScreenLoader == false && this.state.loading == false && this.state.noteArray.length > 0 &&
                        <View >
                            {/* We have a separate arrow function that is <List> which contains a FlatList */}
                            <List data={this.state.noteArray} onClick={this.onItemClick} renderFooter = {this.renderFooter.bind(this)}/>
                        </View>
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

                </Content>

            </Container>


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

                } else if (response.data != null && response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    Alert.alert(
                        globals.app_messages.error_string,
                        globals.app_messages.token_expired,
                        [
                        { text: globals.login, onPress: () => this.props.logout() }
                                   ],
                        { cancelable: false }
                    )
                } else {
                    Alert.alert('Error', response.data.description);

                }
                this.hideFullScreenLoader()

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

}


const mapStateToProps = (state, ownProps) => {
    return {
         isLoggedIn: state.auth.isLoggedIn,
        loginTime: state.auth.loginTime,
        token: state.auth.token,
        url: state.auth.url,
    };
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ login , logout}, dispatch)
};
export default Login = connect(mapStateToProps, mapDispatchToProps)(Photos);