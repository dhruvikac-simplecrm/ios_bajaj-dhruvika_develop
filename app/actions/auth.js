import { ACTION_UPDATE_ACTION, LAST_CHECK,SCREENTIME,ACTION_SESSION_CLEAR,ACTION_LOGIN, ACTION_LOGOUT, ACTION_UPDATE_TOKEN, ACTION_UPDATE_CURRENCY, ACTION_UPDATE_PROFILE_PIC,ACTION_DYNAMIC_DROPDOWNS} from "../store"

export const login = (username, password, assigned_user_id, currency_id, token, user_currency_name, instance_url, userProfile, rm_code, full_name,loginTime) => {
    return {
        type: ACTION_LOGIN,
        username: username,
        password: password,
        assigned_user_id: assigned_user_id,
        currency_id: currency_id,
        token: token,
        user_currency_name: user_currency_name,
        url: instance_url,
        profilePicData : userProfile.data,
        isProfileBase64 : userProfile.isBase64,
        rm_code: rm_code,
        full_name: full_name,
        loginTime:loginTime
    }
}
export const notify = (last_check) => {
    return {
        type: LAST_CHECK,
        last_check: last_check,
    }
}
export const screentiming = (screenStatus) => {
    return {
        type: SCREENTIME,
        screentime: screentime,
    }
}
export const session_clear = () => {
    return {
        type: ACTION_SESSION_CLEAR,
        username: '',
        password:'',
        currency_id:'',
        assigned_user_id: '',
        full_name: '',
        token:'',
        user_currency_name:'',
        profile_pic : '',
        url:'https://',
        profilePicData : '',
        isProfileBase64 : false,
        rm_code:''
    }
}

export const logout = () => {
    return {
        type: ACTION_LOGOUT,
        // username: '',
        // password:'',
        currency_id:'',
        assigned_user_id: '',
        full_name: '',
        token:'',
        user_currency_name:'',
        profile_pic : '',
        // url:'https://'
        profilePicData : '',
        isProfileBase64 : false,
        rm_code:''

    }
}

export const updateToken = (token) => {
    return {
        type: ACTION_UPDATE_TOKEN,
        token: token,
    }
}

export const updateCurrency = (currency) =>{
    console.log("Inside Action, currency: "+currency.name)
    return {
        type:ACTION_UPDATE_CURRENCY,
        currency_id: currency.id,
        user_currency_name: currency.name,
    }

}

export const updateProfilePic = (userProfile) =>{
    console.log("Inside Action, isBase64: "+userProfile.isBase64)
    console.log("Inside Action, data: "+userProfile.data)

    return {
        type:ACTION_UPDATE_PROFILE_PIC,
        profilePicData : userProfile.data,
        isProfileBase64 : userProfile.isBase64,
    }
}

 export const updateAction = (updatedAction) =>{
        console.log("Inside Action, updatedAction: "+updatedAction)    
        return {
            type:ACTION_UPDATE_ACTION,
            updatedAction : updatedAction,
        }
 }


export const updateDynamicDropdowns = (salutationList, lead_sourceList, statusList, interested_product_cList, disposition_category_cList, occupation_type_cList, process_type_cList) => {
    return {
        type: ACTION_DYNAMIC_DROPDOWNS,
        salutationList: salutationList,
        lead_sourceList: lead_sourceList,
        statusList: statusList,
        interested_product_cList: interested_product_cList,
        disposition_category_cList: disposition_category_cList,
        occupation_type_cList: occupation_type_cList,
        process_type_cList: process_type_cList,
    }
}

