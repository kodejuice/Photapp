type Action = {type: 'SIGN_IN'};

const loggedReducer = (state=false, action: Action) => {
	switch (action.type) {
		case "SIGN_IN":
			return !state
		default:
			return state
	}
}

export default loggedReducer;
