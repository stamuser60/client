import { MODES } from '../helpers/general.helper'
import { loadPartialConfig } from '@babel/core'

export const CHANGE_SCREEN_MODE_TO_NORMAL = 'app/CHANGE_SCREEN_MODE_TO_NORMAL'
export const CHANGE_SCREEN_MODE_TO_OPEN = 'app/CHANGE_SCREEN_MODE_TO_OPEN'
export const CHANGE_SCREEN_MODE_TO_EDIT = 'app/CHANGE_SCREEN_MODE_TO_EDIT'
export const CHANGE_SCREEN_MODE_TO_PRESENTATION = 'app/CHANGE_SCREEN_MODE_TO_PRESENTATION'

export const ADD_NODE_TO_COPY = 'app/ADD_NODE_TO_COPY'
export const RESET_NODE_TO_COPY = 'app/RESET_NODE_TO_COPY'

export const ADD_NODE_TO_CUT = 'app/ADD_NODE_TO_CUT'
export const RESET_NODES_TO_CUT = 'app/RESET_NODES_TO_CUT'

const initialState = {
    screenMode: MODES.NORMAL,
    copiedNodes: [],
    cutedNodes: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case CHANGE_SCREEN_MODE_TO_NORMAL: {
            return {
                ...state,
                screenMode: MODES.NORMAL
            }
        }
        case CHANGE_SCREEN_MODE_TO_OPEN: {
            return {
                ...state,
                screenMode: MODES.OPEN
            }
        }
        case CHANGE_SCREEN_MODE_TO_EDIT: {
            return {
                ...state,
                screenMode: MODES.EDIT
            }
        }
        case CHANGE_SCREEN_MODE_TO_PRESENTATION: {
            return {
                ...state,
                screenMode: MODES.PRESENTATION
            }
        }
        case ADD_NODE_TO_COPY: {
            return {
                ...state,
                copiedNodes: action.payload
            }
        }
        case RESET_NODE_TO_COPY: {
            return {
                ...state,
                copiedNodes: []
            }
        }
        case ADD_NODE_TO_CUT: {
            return {
                ...state,
                cutedNodes: action.payload
            }
        }
        case RESET_NODES_TO_CUT: {
            return {
                ...state,
                cutedNodes: []
            }
        }
        default: {
            return state;
        }
    }
}

export const switchModeToNormal = () => {
    return dispatch => {
        dispatch({
            type: CHANGE_SCREEN_MODE_TO_NORMAL
        })
    }
}

export const switchModeToEdit = () => {
    return dispatch => {
        dispatch({
            type: CHANGE_SCREEN_MODE_TO_EDIT
        })
    }
}

export const switchModeToOpen = () => {
    return dispatch => {
        dispatch({
            type: CHANGE_SCREEN_MODE_TO_OPEN
        })
    }
}

export const addNodeToCopy = (copiedNodes) => {
    return dispatch => {
        dispatch({
            type: ADD_NODE_TO_COPY,
            payload: copiedNodes
        })
    }
}

export const resetNodesToCopy = () => {
    return dispatch => {
        dispatch({
            type: RESET_NODE_TO_COPY
        })
    }
}

export const addNodeToCut = (cutedNode) => {
    return dispatch => {
        dispatch({
            type: ADD_NODE_TO_CUT,
            payload: cutedNode
        })
    }
}

export const resetNodesToCut = () => {
    return dispatch => {
        dispatch({
            type: RESET_NODES_TO_CUT
        })
    }
}
