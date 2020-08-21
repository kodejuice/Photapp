import {userProfile} from '../userProfile.d';

type Action = {type: 'SET_USER', payload: userProfile};

const profileReducer = (state={}, action: Action): userProfile => {
    switch (action.type) {
        case "SET_USER":
            return action.payload
        default:
            return state
    }
}

export default profileReducer;
