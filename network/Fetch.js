import globals from '../App/globals';
import Listeners from "./Listeners.ts"
const URL = globals.home_url;
const METHOD_GET = 'GET';
const METHOD_POST = 'POST';

//get method will have configuration and internally fetch the data and return the result
export const get = (entryPoint) => {
    const config = {
        method: METHOD_GET,
        dataType: 'jsonp',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    }
    return fetcher(entryPoint, config)
};

//post method will have configuration and internally fetch the data and return the result
export const post = (entryPoint) => {
    const config = {
        method: METHOD_POST,
        dataType: 'jsonp',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }
    return fetcher(entryPoint, config)
}

//uploadImage method will upload an image and returns result
export const uploadImage = (image) =>{

}

//uploadDocument method will upload a document and returns result
export const uploadDocument = (document) =>{
    
}


const fetcher = (entryPoint, config) => {
    return fetch(URL+entryPoint, config)
    .then((response) => {
        return response.json() 
    }).then((response) => {
        console.log("fetcher: response = "+response)
        if (response.success) {
            console.log("fetcher: suceess response")
            return response;
        } else if(response.success === false){
            console.log("fetcher: False response")
             if (response.data.number === globals.apiErrorCodes.ECODE_TOKEN_EXPIRED) {
                 //Access token expired
                Alert.alert(
                    globals.app_messages.error_string,
                    globals.app_messages.token_expired,
                    [
                    { text: globals.login, onPress: () => this.props.logout() }
                               ],
                    { cancelable: false }
                )
            } else{
                //false response
            }
            return response;
        } else{
            console.log("fetcher: success is niether true nor false response")
        }
        throw response;
    });
}

//parseJson method will parse the result and return proper response with validation
parseJson = (r) => new Promise((resolve, reject) => {
    r.json().then((result) => {
      r.data = result;
      resolve(r);
    }).catch((err) => {
      r.data = err;
      reject(r);
    });
  });
