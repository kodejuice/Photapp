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

export const set_notification = (newNotification: boolean) => {
    return {
        type: "SET_NOTIFICATION",
        payload: newNotification,
    }
}

export const add_user_follow = (user: string) => {
    return {
        type: "ADD_USER_FOLLOW",
        payload: user,
    }
}

export const delete_user_follow = (user: string) => {
    return {
        type: "DELETE_USER_FOLLOW",
        payload: user,
    }
}
