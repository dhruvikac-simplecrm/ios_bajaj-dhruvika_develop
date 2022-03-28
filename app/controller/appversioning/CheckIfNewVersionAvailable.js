import {Alert, Linking, AppState, NativeModules} from "react-native"

import globals from "../../globals"


//!Change this APP_ID & APP_NAME before uploading to app store.
const APP_ID = "1459476102"//this id is for SalesMobi ios app
// const APP_ID = "529479190"//this id for clash of clans ios app, just for testing
const APP_NAME = "salesmobi"
// const APP_NAME = "clash-of-clans"

let isPopupShowing = false

export default class CheckIfNewVersionAvailable{
    constructor(currentVersion){
      const appsCurrentVersion = currentVersion;
        console.log("SalesMobi: appsCurrentVersion: "+appsCurrentVersion)
        console.log("CheckIfNewVersionAvailable: constructor = ")

        this.getAppstoreAppVersion(APP_ID) //put any apps id here
        .then(({appVersion,releasedNotes} = data) => {
                 console.log("clash of clans ios app version on appstore", appVersion);
              //Show alert only when new app version is available
              if(appsCurrentVersion < appVersion){
                Alert. alert("App update required! Version("+appVersion+")", releasedNotes,
                [
                    { text: "Ok", onPress: () =>{           
                           isPopupShowing = false
                           Linking.openURL("https://apps.apple.com/us/app/"+APP_NAME+"/"+APP_ID)
                    } },
                    // { text: "Cancel" }, //!Remove this before uploading to app store, needs forec update.
                           ],
                    // { cancelable: false }
                    ) 
                    isPopupShowing = true

                //This AppState is used to check app is in foreground or background    
                AppState.addEventListener('change', function (new_state) {
                  console.log("addEventListener: change: "+new_state);
          
                  //Show the popup when the state changes to "Active" that is app is in foreground and if alert is not showing
                  if (new_state === 'active' && appsCurrentVersion < appVersion && isPopupShowing === false) {
                    Alert. alert("App update require! Version("+appVersion+")", releasedNotes,
                    [
                        { text: "Ok", onPress: () => {
                                    isPopupShowing = false
                                     Linking.openURL("https://apps.apple.com/us/app/"+APP_NAME+"/"+APP_ID) 
                                 }
                      },
                        // { text: "Cancel" },
                               ],
                        // { cancelable: false }
                        )    
                        isPopupShowing = true
                  }

                });

              
                } else{
                  console.log("Current Version(version) is not less than appStore Version(appVersion)")
                }
        })
       .catch(err => {
             console.log("error occurred", err);
        });


//        this. getPlaystoreAppVersion("com.supercell.clashofclans") //put any apps packageId here
//   .then(appVersion => {
//     console.log("clashofclans android app version on playstore", appVersion);
//   })
//   .catch(err => {
//     console.log("error occurred", err);
//   });
    }


 getPlaystoreAppVersion = (id, options = { jquerySelector: "" }) => {
        const url = `https://play.google.com/store/apps/details?id=${id}`;
        return new Promise((resolve, reject) => {
          NativeModules.RNAppstoreVersionChecker.appVersionExtractor(url,options.jquerySelector,resolve, reject);
        });
      };

 getAppstoreAppVersion = (identifier, options = { typeOfId: 'id' }) => {
        const country = options.country ? `&country=${options.country}` : '';
        const url = `https://itunes.apple.com/lookup?${options.typeOfId}=${identifier}${country}`;
        return this.get(url).then(this.parseJson).then((d) => {
            // console.log("getAppstoreAppVersion: d = "+JSON.stringify(d))

           let appVersion="";
           let releasedNotes="";
           let data = {appVersion,releasedNotes}
            try{
              appVersion = d.data.results[0].version;
              releasedNotes = d.data.results[0].releaseNotes;
              
              data = {appVersion, releasedNotes}
              console.log("getAppstoreAppVersion: version = "+appVersion)
            }catch(e){
          if (!appVersion) {
            // throw new Error('App not found!');
            console.log("App Not Found!")
          }
        }
          return data;
        });
    
      };


       parseJson = (r) => new Promise((resolve, reject) => {
        r.json().then((result) => {
          r.data = result;
          resolve(r);
        }).catch((err) => {
          r.data = err;
          reject(r);
        });
      });
      
       get = (url) => {
        const config = {
          method: 'GET',
          credentials: 'include',
          mode: 'no-cors',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': 0
          }
        };

        return fetch(url, config).then((response) => {
            if (response.status === 200) {
              return response;
            }
            throw response;
          });
     }
}