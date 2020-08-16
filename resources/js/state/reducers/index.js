import loggedReducer from './isLogged';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
	isLogged: loggedReducer,
})

export default rootReducer;
