export const POPUP_ERROR_ALERT = 'error/POPUP_ERROR_ALERT'
export const CLOSE_ERROR_ALERT = 'error/CLOSE_ERROR_ALERT'

const initialState = {
  show: false,
  msg: ""
}

export default (state = initialState, action) => {
  switch (action.type) {
    case POPUP_ERROR_ALERT:
      return {
        ...state,
        show: true,
        msg: action.msg
      }

    case CLOSE_ERROR_ALERT:
      return {
        ...state,
        show: false,
        msg: ""
      }

    default:
      return state
  }
}

export const popupErrorAlert = (msg, showTimeSeconds) => {
  return dispatch => {
    dispatch({
      type: POPUP_ERROR_ALERT,
      msg: msg
    })

    setTimeout(() => {
      dispatch({
        type: CLOSE_ERROR_ALERT
      })
    }, showTimeSeconds * 1000)
  }
}
