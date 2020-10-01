import loggedReducer from './isLogged';
import profileReducer from './userProfile';
import alertReducer from './Alerts';
import notificationReducer from './notificationUnread';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
	isLogged: loggedReducer,
    userProfile: profileReducer,
    alert: alertReducer,
    newNotification: notificationReducer,
})

export default rootReducer;
