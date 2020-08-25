import loggedReducer from './isLogged';
import profileReducer from './userProfile';
import alertReducer from './Alerts';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
	isLogged: loggedReducer,
  userProfile: profileReducer,
  alert: alertReducer,
})

export default rootReducer;
