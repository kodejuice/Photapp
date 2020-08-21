import loggedReducer from './isLogged';
import profileReducer from './userProfile';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
	isLogged: loggedReducer,
  userProfile: profileReducer
})

export default rootReducer;
