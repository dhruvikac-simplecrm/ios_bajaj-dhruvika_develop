import React, { Component } from 'react';
import {
    View,
    Alert,
    TextInput,
    FlatList,
    Image,
    ImageBackground,
    AlertIOS,
    Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Container, Card, Text , Spinner, Content} from 'native-base';
import { login, logout } from '../../actions/auth';
import { bindActionCreators } from 'redux';
import styles from './style';
import { FlatGrid } from 'react-native-super-grid';
import globals from '../../globals';
const LIMIT = 10;

class LeadFiles extends  Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            username: '',
            password: '',
            module_id: this.props.module_id,
            offset:0,
            noteArray:[],
            attachmentArray:[]
        }
        console.log("PHOTOS: module_id = "+this.state.module_id);

    }

    //This getRelationshipRecords() method gets the recent 10 records at a time, in this we get note ids
    getRelationshipRecords(){
        //show loader meanwhile
       this.showLoader()

        let url = globals.home_url + "/getRelationships"
        + "?token_id=" + this.props.token +
        "&module_name=" + globals.leads +
        "&module_id=" + this.state.module_id +
        "&link_field_name="+ "notes"+
        "&related_fields="+ "id,name"+
        "&deleted="+ "0"+
        "&order_by=" + "date_entered" +
        "&offset=" + this.state.offset +
        "&limit=" + LIMIT 
        + "&url="+this.props.url;
       
        console.log("getRelationshipRecords: URL: "+url)

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
                if(response.data.info.result_count > 0){
                const array = response.data.result;
                this.setState({
                  noteArray : array,
               //   offset: offset+LIMIT
                })
                console.log("NOTE_ARRAY: "+this.state.noteArray)
                //Make a call to get images from all the note ids
              for (let i = 0; i < array.length; i++) {
                  const element = array[i];
                  this.getAttachedPhotos(element, i);
              }
            } else{
                this.hideLoader()
            }
            }else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                Alert.alert(
                    globals.app_messages.error_string,
                    globals.app_messages.token_expired,
                    [
                    { text: globals.login, onPress: () => this.props.logout() }
                               ],
                    { cancelable: false }
                )
            }  else {
                this.hideLoader()
                Alert.alert('Error', response.data.description);
            }

        })
    
        .catch(err => {
            console.log(err);
            this.hideLoader()
        });
    }

    hideLoader(){
        this.setState({
            loading:false
        })
    }
    showLoader(){
        this.setState({
            loading:true
        })
    }
    getAttachedPhotos(element, index){
        //Need to change something here to display documents
        let url = globals.home_url + "/getAttachment"
            + "?token_id=" + this.props.token +
            "&module_name=" + globals.notes +
            "&id=" + element.id 
            + "&url="+this.props.url;

        console.log("getAttachedPhotos: URL: "+url)

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
                const jsonObj = "{\"name\":\""+element.name+"\",\"image\":\""+response.data.result.note_attachment.file+"\"}"
                this.state.attachmentArray.push(jsonObj)

                if (response.success === true) {
                   this.setState({
                   })
                    
                   if(index == this.state.attachmentArray.length - 1 ){
                    this.hideLoader()
                   }
                    console.log("AttachedArray: "+this.state.attachmentArray)
                } else if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                    this.hideLoader()

                    Alert.alert(
                        globals.app_messages.error_string,
                        globals.app_messages.token_expired,
                        [
                        { text: globals.login, onPress: () => this.props.logout() }
                                   ],
                        { cancelable: false }
                    )
                } else {
                    this.hideLoader()
                    Alert.alert('Error', response.data.description);
                }

            })
            .catch(err => {
                this.hideLoader()
                console.log(err);
            });
    }

   

    componentDidMount(){
        this.getRelationshipRecords()
    }

    render() {
        return (
            <Container style={{ backgroundColor: 'white', justifyContent: 'center', height: null }} >
                           <Content>

            {this.state.loading &&
                <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 1}}>
                    <Spinner color='red' />
                </View>
            }

        {this.state.loading == false && this.state.attachmentArray.length >0 &&

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
                                    source={{uri:"data:image/png;base64,"+JSON.parse(item).image}}
                                >
                                    <View style={styles.itemContainerInside}>
                                        <Text style={styles.itemName}>{JSON.parse(item).name}</Text>
                                    </View>
                                </ImageBackground>
                            </Card>
                        )}
                    />

                </View>
            }

            {this.state.loading == false && this.state.attachmentArray.length == 0 &&
                  <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 40}} >
                  <Text style={{color: 'grey'}} >No Files</Text>
              </View>
            }
                </Content>

            </Container>

                        
        );
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
    return bindActionCreators({login, logout}, dispatch)
};

export default Login = connect(mapStateToProps, mapDispatchToProps)(LeadFiles);