import {serverSideUrl, fetchOptions} from '../config/general.config.js'
import { popupErrorAlert } from './error'

export const GET_LOBBY_FLOWS_PENDING = 'lobby/GET_LOBBY_FLOWS_PENDING'
export const GET_LOBBY_FLOWS_COMPLETE = 'lobby/GET_LOBBY_FLOWS_COMPLETE'
export const GET_LOBBY_FLOWS_FAILED = 'lobby/GET_LOBBY_FLOWS_FAILED'

export const GET_LOBBY_DASH_PENDING = 'lobby/GET_LOBBY_DASH_PENDING'
export const GET_LOBBY_DASH_COMPLETE = 'lobby/GET_LOBBY_DASH_COMPLETE'
export const GET_LOBBY_DASH_FAILED = 'lobby/GET_LOBBY_DASH_FAILED'

export const GET_ALL_LOBBY_DASHBOARDS_PENDING = 'lobby/GET_ALL_LOBBY_DASHBOARDS_PENDING'
export const GET_ALL_LOBBY_DASHBOARDS_COMPLETE = 'lobby/GET_ALL_LOBBY_DASHBOARDS_COMPLETE'
export const GET_ALL_LOBBY_DASHBOARDS_FAILED = 'lobby/GET_ALL_LOBBY_DASHBOARDS_FAILED'

export const GET_LOBBY_FLOWS_ALERTS_COUNT_PENDING = 'lobby/GET_LOBBY_FLOWS_ALERTS_COUNT_PENDING'
export const GET_LOBBY_FLOWS_ALERTS_COUNT_COMPLETE = 'lobby/GET_LOBBY_FLOW_ALERTS_COUNTS_COMPLETE'
export const GET_LOBBY_FLOWS_ALERTS_COUNT_FAILED = 'lobby/GET_LOBBY_FLOWS_ALERTS_COUNT_FAILED'


const initialState = {
	sources: {
		nodes:{}
	},
	data: {
	},
	allDashboards: {}
}


// const initialState = {
// 	sources: { 
// 		im : {
// 			displayName: "מסלול הIM",
// 			flowID : "rJoUu0_oM",
// 			data: {
// 				alerts: {
// 					value: "15",
// 					isCritical: false
// 				},
// 				hermetic: {
// 					value: "99.1",
// 					isCritical: false
// 				}
// 			}
// 		},
// 		shema: {
// 			displayName: "מסלול הטקסט",
// 			flowID : "B1vMA1TKz",
// 			data: {
// 				alerts: {
// 					value: "12",
// 					isCritical: true
// 				},
// 				hermetic: {
// 					value: "100",
// 					isCritical: false
// 				}
// 			}
// 		}
// 	}
// }

export default (state = initialState, action) => {
  switch (action.type) {
	case GET_LOBBY_FLOWS_PENDING:
		return {...state, status: 'FETCHING'}
	case GET_LOBBY_FLOWS_COMPLETE:
		let flows = action.payload	
		return {...state, sources: flows, status: 'NORMAL'}
	case GET_LOBBY_FLOWS_FAILED:
		return {...state, status: 'FAILED'}
	case GET_LOBBY_DASH_PENDING:
		return {...state, status: 'FETCHING'}
	case GET_LOBBY_DASH_COMPLETE:
		flows = action.payload	
		return {...state, sources: flows, status: 'NORMAL'}
	case GET_LOBBY_DASH_FAILED:
		return {...state, status: 'FAILED'}
	case GET_LOBBY_FLOWS_ALERTS_COUNT_PENDING:
		return {...state, status: 'FETCHING'}
	case GET_LOBBY_FLOWS_ALERTS_COUNT_COMPLETE:
		return {...state,data: action.payload, status: 'NORMAL'}
	case GET_LOBBY_FLOWS_ALERTS_COUNT_FAILED:
		return {...state, status: 'FAILED'}
	case GET_ALL_LOBBY_DASHBOARDS_PENDING:
		return {...state, status: 'FETCHING'}
	case GET_ALL_LOBBY_DASHBOARDS_COMPLETE:
		return {...state,allDashboards: action.payload, status: 'NORMAL'}
	case GET_ALL_LOBBY_DASHBOARDS_FAILED:
		return {...state, status: 'FAILED'}
	default:
	  return state
  }
}

export const fetchLobbyFlows = () =>{
	return dispatch => {
		dispatch({
			type: GET_LOBBY_FLOWS_PENDING,
		})

		fetch(`${serverSideUrl}/lobby/get/all`, fetchOptions())
			.then(res => {
				return res.json()
			}).then(flows => {				
				dispatch({
					type: GET_LOBBY_FLOWS_COMPLETE,
					payload: flows
				})
			}, error => {
				dispatch({
					type: GET_LOBBY_FLOWS_FAILED,
					payload: {error}
				})
			})
	}
}

export const fetchLobbyDash = (dashId) =>{
	return dispatch => {
		dispatch({
			type: GET_LOBBY_DASH_PENDING,
		})

		fetch(`${serverSideUrl}/lobby/get/byId/${dashId}`, fetchOptions())
			.then(res => {
				return res.json()
			}).then(flows => {	
				dispatch({
					type: GET_LOBBY_DASH_COMPLETE,
					payload: flows
				})
			}, error => {
				popupErrorAlert('הייתה שגיאה בבקשה לקבלת המסך הראשי', 5)(dispatch)
				dispatch({
					type: GET_LOBBY_DASH_FAILED,
					payload: {error}
				})
			})
	}
}

export const fetchLobbyInfo = (dashId) =>{
	return dispatch => {
		dispatch({
			type: GET_LOBBY_FLOWS_ALERTS_COUNT_PENDING,
		})

		fetch(`${serverSideUrl}/lobby/get/info/${dashId}`, fetchOptions())
		.then(res => {
			return res.json()
		}).then(info => {
			dispatch({
				type: GET_LOBBY_FLOWS_ALERTS_COUNT_COMPLETE,
				payload: info
			})
		}, error => {
			popupErrorAlert('הייתה שגיאה בבקשה לקבלת המסך הראשי', 5)(dispatch)
			dispatch({
				type: GET_LOBBY_FLOWS_ALERTS_COUNT_FAILED,
				payload: {error}
			})
		})
	}
}

export const fetchAllDashboards = (dashId) =>{
	return dispatch => {
		dispatch({
			type: GET_ALL_LOBBY_DASHBOARDS_PENDING,
		})

		fetch(`${serverSideUrl}/lobby/get/all/dashboards`, fetchOptions())
		.then(res => {
			return res.json()
		}).then(allDashboards => {
			dispatch({
				type: GET_ALL_LOBBY_DASHBOARDS_COMPLETE,
				payload: allDashboards
			})
		}, error => {
			dispatch({
				type: GET_ALL_LOBBY_DASHBOARDS_FAILED,
				payload: {error}
			})
		})
	}
}

export const updateLobbyInfo = (info) =>{
	return dispatch => {
		dispatch({
			type: GET_LOBBY_FLOWS_ALERTS_COUNT_COMPLETE,
			payload: info
		})
	}
}