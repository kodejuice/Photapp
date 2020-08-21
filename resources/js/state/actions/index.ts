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
