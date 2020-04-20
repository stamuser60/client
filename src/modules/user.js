import { decodeAuthToken } from '../services/authToken.service'

export const SET_USER_NAME = 'SET_USER_DETAILS'

const initialState = {
  username: undefined
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NAME:
      return { ...state, username: action.payload }
    default:
      return state
  }
}

export const setUsername = (authToken) => {
  return dispatch => {
    try {
      if (!authToken) {
        return
      }
      let tokenInfo = decodeAuthToken(authToken)
      dispatch({
        type: SET_USER_NAME,
        payload: tokenInfo.username
      })
    } catch (e) {
      console.log(e)
    }
  }
}
