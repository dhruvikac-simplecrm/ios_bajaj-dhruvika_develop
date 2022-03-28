import { combineReducers, createStore } from 'redux';
import { REHYDRATE, PURGE, persistStore, persistReducer } from 'redux-persist';
import auth from './auth';
import storage from 'redux-persist/lib/storage';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const rootReducer = combineReducers({
    auth, lastAction
})

function lastAction(state = null, action) {
    return action;
  }

export default rootReducer;