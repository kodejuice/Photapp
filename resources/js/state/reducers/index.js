import loggedReducer from './isLogged';
import profileReducer from './userProfile';
import alertReducer from './Alerts';
import notificationReducer from './notificationUnread';
import userFollowReducer from './userFollow';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
	isLogged: loggedReducer,
    userProfile: profileReducer,
    alert: alertReducer,
    newNotification: notificationReducer,
    userFollow: userFollowReducer,
})

export default rootReducer;
