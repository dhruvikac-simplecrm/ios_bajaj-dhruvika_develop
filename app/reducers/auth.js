import globals from "../globals";
import { getStoredState } from "redux-persist";
import { ACTION_UPDATE_ACTION, ACTION_LOGIN,SCREENTIME,ACTION_SESSION_CLEAR, ACTION_UPDATE_TOKEN, ACTION_LOGOUT, ACTION_UPDATE_CURRENCY, ACTION_UPDATE_PROFILE_PIC, ACTION_DYNAMIC_DROPDOWNS, LAST_CHECK } from "../store"

const initialState = {
    isLoggedIn: false,
    username: '',
    password: '',
    assigned_user_id: '',
    token: '',
    currency_id: '',
    user_currency_name: '',
    url: 'https://bajajcapitaldev.simplecrmdev.com',
    isNotificationOpened: false,
    isProfileBase64: false,
    profilePicData: '',
    loginTime: '',
    rm_code:'',
    full_name:'',
    last_check:"",
    screentime:'',
    salutationList: [],
    lead_sourceList: [],
    statusList: [],
    interested_product_cList: [],
    disposition_category_cList: [],
    occupation_type_cList: [],
    process_type_cList: [],
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case ACTION_LOGIN:
            return Object.assign({}, state, {
                type: action.type,
                isLoggedIn: true,
                username: action.username,
                password: action.password,
                assigned_user_id: action.assigned_user_id,
                token: action.token,
                currency_id: action.currency_id,
                user_currency_name: action.user_currency_name,
                url: action.url,
                profilePicData: action.profilePicData,
                isProfileBase64: action.isProfileBase64,
                rm_code: action.rm_code,
                full_name: action.full_name,
                loginTime: action.loginTime,
            })
            case LAST_CHECK:
                return Object.assign({}, state, {
                    type: action.type,
                    last_check: action.last_check,
                })
            case SCREENTIME:
                return Object.assign({}, state, {
                    type: action.type,
                    screentime: action.screentime,
                })
        case ACTION_LOGOUT:
            // logoutApi(state)

            return Object.assign({}, state, {
                type: action.type,
                isLoggedIn: false,
                // username: '',
                // password: '',
                assigned_user_id: '',
                token: '',
                currency_id: '',
                user_currency_name: '',
                profilePicData: '',
                isProfileBase64: false,
                // url:'https://',
                rm_code:'',
                full_name:'',
            })
        case ACTION_SESSION_CLEAR:
            return Object.assign({}, state, {
                type: action.type,
                isLoggedIn: '',
                username: '',
                password: '',
                assigned_user_id: '',
                token: '',
                currency_id: '',
                user_currency_name: '',
                profilePicData: '',
                isProfileBase64: false,
                url:'https://',
                rm_code:'',
                full_name:'',
            })
            case ACTION_UPDATE_TOKEN:    
                return Object.assign({}, state, {
                    type: action.type,
                    token: action.token,
                })

        case ACTION_UPDATE_CURRENCY:
            return Object.assign({}, state, {
                type: action.type,
                isLoggedIn: true,
                currency_id: action.currency_id,
                user_currency_name: action.user_currency_name,
            })

        case ACTION_UPDATE_PROFILE_PIC:
            return Object.assign({}, state, {
                type: action.type,
                isLoggedIn: true,
                profilePicData: action.profilePicData,
                isProfileBase64: action.isProfileBase64,
            })

        case ACTION_UPDATE_ACTION:
            return Object.assign({}, state, {
                type: action.updatedAction,
                isLoggedIn: true,
            })

        case ACTION_DYNAMIC_DROPDOWNS:
            return Object.assign({}, state, {
                type: action.updatedAction,
                salutationList: action.salutationList,
                lead_sourceList: action.lead_sourceList,
                statusList: action.statusList,
                interested_product_cList: action.interested_product_cList,
                disposition_category_cList: action.disposition_category_cList,
                occupation_type_cList: action.occupation_type_cList,
                process_type_cList: action.process_type_cList,
            })

        default:
            return state;
    }
}

function logoutApi(state) {
    const url = globals.home_url + "/logout?url=" + state.url + "&token_id=" + state.token
    console.log("logoutApi: url = " + state.url + " token = " + state.token)
    fetch(url, {
        method: "GET",
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
            console.log("Logout response: " + response);
            console.log("Logout response: success : " + response.success);
            console.log("Logout response: message: " + response.message);
        })
        .catch((error) => {
            console.log(error);
        });
}