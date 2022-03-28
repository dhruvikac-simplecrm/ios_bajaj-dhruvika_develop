import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Spinner, View } from 'native-base';


class ImageCommon extends Component {

  constructor(props){
  		super(props);
  		this.state = {
  			loading: true
  		};
  }

  render() {
    return (
    	<View style={{justifyContent: 'center', alignSelf: 'center'}}>
	        <Image 
	        	source={this.props.source} 
	            onLoadStart = {() => this.setState({ loading: true })}
	            onLoad = {() => this.setState({ loading: false })}
	            style={[this.props.style]}        	
	        />
	        {this.state.loading && <Spinner color='red' /> }
        </View>
    );
  }
}	

export default ImageCommon;
