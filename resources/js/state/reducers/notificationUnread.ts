type Action = {type: 'SET_NOTIFICATION', payload: boolean};

const notificationReducer = (state=false, action: Action): boolean => {
    switch (action.type) {
        case "SET_NOTIFICATION":
            return action.payload
        default:
            return state
    }
}

export default notificationReducer;
