import React from "react"

const METHOD_GET = "GET"
const METHOD_POST = "POST"

class ServerCall{

 makeCall(apiMethod, apiUrl) {

fetch(apiUrl, {
    method: apiMethod,
    dataType: 'jsonp',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
    },
})

    .then((response) => {
        return response.json() // << This is the problem
    })
    .then((response) => {
        
        if (response.success === true) {
            console.log(response);
            if(response.data.info.result_count ===  0){
                this.setState({loading: false});
            }else{
                //* response is stored in an array state variable serverData.
                this.setState({ serverData: [...this.state.serverData, ...response.data.result], loading: false });
            }
            

        } else {

            Alert.alert(
                globals.app_messages.error_string,
                response.data.description,
                [
                    { text: 'Ok', onPress: () => '' },

                ],
                { cancelable: false }
            );
        }


    })
    .catch((error) => {
        console.error(error);
    });

}
}