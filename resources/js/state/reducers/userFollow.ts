
type Action = {
    type: 'ADD_USER_FOLLOW' | 'DELETE_USER_FOLLOW',
    payload: string
};

const userFollowReducer = (state={}, action: Action) => {
    switch (action.type) {
        case "ADD_USER_FOLLOW":
            return {...state, [action.payload]: true}

        case "DELETE_USER_FOLLOW": {
            let new_state = {};
            for (let k in state) {
                if (k != action.payload) {
                    new_state[k] = state[k];
                }
            }
            return new_state;
        }

        default:
            return state
    }
}

export default userFollowReducer;
