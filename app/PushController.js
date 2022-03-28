import React, { Component } from 'react';
import PushNotification from 'react-native-push-notification';
import {PushNotificationIOS} from 'react-native';

export default class PushController extends Component {

    componentDidMount(){
        PushNotification.configure({

            // (required) Called when a remote or local notification is opened or received
    onNotification: (notification) => {
        console.log( 'NOTIFICATION:', notification );
        // process the notification
        
        // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

     // IOS ONLY (optional): default: all - Permissions to register.
     permissions: {
        alert: true,
        badge: true,
        sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: true,

        });
    }

    render(){
        return null;
    }


//!extra added
    scheduleNotif(response){

        const startDate = new Date(response.data.result.date_start).getTime();
        const notificationDate = new Date(startDate - (response.data.result.reminder_time * 1000));
        console.log("NOTIFY Me on Date/Time : " + notificationDate)
        //If reminder is not set, don't show notification
        if ((response.data.result.reminder_time != "0"
            || response.data.result.reminder_time > 0)
            && notificationDate.getTime() > new Date().getTime()) {
            //create a push notification for this created call
            PushNotification.localNotificationSchedule({
                //... You can use all the options from localNotifications
                 /* iOS and Android properties */
                 title: response.data.result.name, // (optional)
                 message: response.data.result.description, // (required)
                 playSound: true, // (optional) default: true
                 soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
            
                 //Scheduled date and time
                 date: notificationDate,

                //userInfo require to get the action when uesr clicks on 'open' in ios  
                userInfo: {
                    id: response.data.result.id, module: "Calls",
                    type: "Calendar"
                },
                data:{  id: response.data.result.id, module: "Calls",
                type: "Calendar"},

                alertAction: 'view', // (optional) default: view
                category: null, // (optional) default: null
          
               

            });
        }
        }
}
