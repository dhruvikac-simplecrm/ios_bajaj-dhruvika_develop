import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';
import NotificatioListener from './NotificationListener';

export default class NotificationService {
    constructor(component) {
        // this.configure()
        //  new NotificatioListener(component);
    }
    //configure the local notification here
    configure() {
        PushNotification.configure({

            // (required) Called when a remote or local notification is opened or received
            onNotification: onNotification = (notification) => {
                console.log('CreateCallCalendar: NOTIFICATION:', notification);
                // process the notification
                //   alert("CreateCallCalendar: onNotification ie notification opened.")

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

    /**
     * @param {*} detailsObj :  This is a details object which were set before to schedule notification
     */
    cancelScheduledNotification(detailsObj){
        PushNotification.cancelLocalNotifications(detailsObj)
    }


    /**
     * scheduleNotification(response, module, type) : This method is used to send local notification on specified time
     * @param {*} response : result for created appointment(call/task/meeting)
     * @param {*} module : "Calls", "Meetings", "Tasks"
     * @param {*} type : "Calendar"
     */
    scheduleNotification(response, module, type) {
        // this.showDummyNotification()
        // this.scheduleNativeLocation()
        // alert("Date: response  = "+response)
        let message = "date_start: " + response.data.result.date_start
        // alert("Date: date_start  = "+response.data.result.date_start)

        console.log("scheduleNotification: "+JSON.stringify(response))
        let array;
        if(response.data.result.date_start != "" && response.data.result.date_start != undefined){
            array = response.data.result.date_start.split(" ")
        } else  if(response.data.result.date_due != "" && response.data.result.date_due != undefined){
            array = response.data.result.date_due.split(" ")
        }else{
            return
        }
        // const array = response.data.result.date_start.split(" ")
        
        const dateArray = array[0].split("-");
        const timeArray = array[1].split(":");

        //yyyy-mm-dd hh:MM:ss
        let newSDate = new Date();
        newSDate.setFullYear(dateArray[0])
        newSDate.setMonth(dateArray[1] - 1)
        newSDate.setDate(dateArray[2])

        newSDate.setHours(timeArray[0])
        newSDate.setMinutes(timeArray[1])
        newSDate.setSeconds(timeArray[2])

        const startDate = newSDate.getTime()
        // const startDate = new Date(response.data.result.date_start).getTime();
        message = message + "   newSDate = " + newSDate.toString()

        const notificationDate = new Date(startDate - (response.data.result.reminder_time * 1000));
        message = message + "   notificationDate = " + notificationDate.toString()
        console.log("scheduleNotification: notificationDate : " + notificationDate)
        console.log("scheduleNotification: Reminder time prior to appointment : " + response.data.result.reminder_time)
        // alert(message)
        //If reminder is not set, don't show notification
        if ((response.data.result.reminder_time != "0"
            || response.data.result.reminder_time > 0)
            && notificationDate.getTime() > new Date().getTime()) {
            //create a push notification for this created call

            PushNotification.localNotificationSchedule({
                //... You can use all the options from localNotifications

                /* iOS and Android properties */
                message: response.data.result.name, // (required)
                playSound: true, // (optional) default: true
                soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)

                //Scheduled date and time
                date: notificationDate,

                //iOS only, userInfo require to get the action when uesr clicks on 'open' in ios  
                userInfo: {
                    id: response.data.result.id,
                    module: module,
                    type: type
                },
                data: {
                    id: response.data.result.id, module: module,
                    type: type
                },

                alertAction: 'view', // (optional) default: view               

            });



            // const details = {
            //     fireDate: notificationDate,

            //     // alertTitle: response.data.result.name,
            //     alertBody: response.data.result.name,
            //     userInfo: {
            //         id: response.data.result.id,
            //         module: module,
            //         type: type
            //     },
            // }
            // PushNotificationIOS.scheduleLocalNotification(details);


        }
    }

     /**
     * setReminder(response) : this method sets the notification from NotificationService file
     * @param {*} response : is the response we get after saving appointment
     */
    updateScheduledNotification(response, module, type){
      const details = {
            id: response.data.result.id,
            module: module,
            type: type
        }
        this.cancelScheduledNotification(details)
        this.scheduleNotification(response, module, type)
    }


    scheduleNativeLocation() {
        let date = new Date();
        // date.setMinutes(date.getMinutes()+1)
        date.setSeconds(date.getSeconds() + 15)
        const details = {
            fireDate: date,
            alertTitle: "SalesMob",
            alertBody: "Some message to display",
            userInfo: {
                id: "userInfoId123native", module: "userInfoModule_Calls_native",
                type: "userInfoType_Calendar_native"
            }
        }
        PushNotificationIOS.scheduleLocalNotification(details);
    }


    showDummyNotification() {
        //Set dummy notification
        console.log("NOTIFY Dummy data ")
        let date = new Date();
        // date.setMinutes(date.getMinutes()+1)
        date.setSeconds(date.getSeconds() + 15)

        //create a push notification for this created call
        PushNotification.localNotificationSchedule({
            //... You can use all the options from localNotifications

            /* iOS and Android properties */
            message: "Some message for dummy notification", // (required)
            playSound: true, // (optional) default: true
            soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)

            //Scheduled date and time
            date: date,

            //userInfo require to get the action when uesr clicks on 'open' in ios  
            userInfo: {
                id: "userInfoId123", module: "userInfoModule_Calls",
                type: "userInfoType_Calendar"
            },
            //data
            data: {
                id: "DataId1234", module: "DataModule_Calls",
                type: "DataType_Calendar"
            },

            alertAction: 'view', // (optional) default: view               

        });
    }



}