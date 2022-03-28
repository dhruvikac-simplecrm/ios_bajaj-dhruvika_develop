import { AsyncStorage } from 'react-native';
import { applyMiddleware, createStore, compose } from 'redux';
import rootReducer from './reducers';
import { createLogger } from 'redux-logger';
// import { composeWithDevTools } from 'redux-devtools-extension';
import { autoRehydrate, persistStore, persistReducer, persistCombineReducers } from 'redux-persist';
export const ACTION_LOGIN = 'BAJAJ_CAPITAL_LOGIN'
export const ACTION_LOGOUT = 'BAJAJ_CAPITAL_LOGOUT'
export const ACTION_UPDATE_CURRENCY = 'BAJAJ_CAPITAL_UPDATE_CURRENCY'
export const ACTION_UPDATE_PROFILE_PIC = 'BAJAJ_CAPITAL_GET_SET_PROFILE_PIC'
export const LAST_CHECK = 'LAST_CHECK'
export const ACTION_SESSION_CLEAR = 'ACTION_SESSION_CLEAR'
export const SCREENTIME = 'SCREENTIME'

// export const ACTION_UPLOAD_PROFILE_PIC = 'BAJAJ_CAPITAL_UPLOAD_PROFILE_PIC'

export const ACTION_UPDATE_ACTION = 'BAJAJ_CAPITAL_UPDATE_ACTION'
export const ACTION_DYNAMIC_DROPDOWNS = 'BAJAJ_CAPITAL_ACTION_DYNAMIC_DROPDOWNS'
export const ACTION_PERSIST_REHYDRATE = 'persist/REHYDRATE' //Default of redux 
export const ACTION_UPDATE_TOKEN = 'BAJAJ_CAPITAL_UPDATE_TOKEN'

const middlewares = [];

if (__DEV__) {
  middlewares.push(createLogger());
}

const persistConfig = {
    key: 'auth',
    storage: AsyncStorage
};
const persistReducer1 = persistReducer(persistConfig, rootReducer);

const store = createStore(persistReducer1);
export default function configureStore(){
    
    return store;
}

export const persistor = persistStore(store);