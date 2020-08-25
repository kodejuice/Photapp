
type Action = {
    type: 'SET_ALERT_MESSAGE',
    payload: {
        message: string[],
        type: 'error'|'success'
    }
};

const alertReducer = (state={message:[]}, action: Action) => {
    switch (action.type) {
        case "SET_ALERT_MESSAGE":
            return action.payload
        default:
            return state
    }
}

export default alertReducer;
