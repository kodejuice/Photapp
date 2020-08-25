export const sign_in = () => {
    return {
        type: "SIGN_IN"
    }
}

export const set_user = (logged) => {
    return {
        type: "SET_USER",
        payload: logged
    }
}

export const set_alert_messages = (message, type) => {
    return {
        type: "SET_ALERT_MESSAGE",
        payload: {
            message,
            type,
        }
    }
}
