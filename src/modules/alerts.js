import moment from 'moment'
import 'moment/locale/he'
import {maxBy, mapValues, pickBy, filter} from 'lodash'
import {serverSideUrl, fetchOptions} from '../config/general.config.js'

export const GET_ALERTS_PENDING = 'alerts/GET_ALERTS_PENDING'
export const GET_ALERTS_COMPLETED = 'alerts/GET_ALERTS_COMPLETED'
export const GET_ALERTS_FAILED = 'alerts/GET_ALERTS_FAILED'
export const POST_VIP_PENDING = 'alerts/POST_VIP_PENDING'
export const POST_VIP_COMPLETED = 'alerts/POST_VIP_COMPLETED'
export const POST_VIP_FAILED = 'alerts/POST_VIP_FAILED'
export const CHANGE_ALERT = 'alerts/CHANGE_ALERT'
export const CHANGE_FILTER = 'alerts/CHANGE_FILTER'


// to be reviewed
// should this be exported or should there be a reset action?
export const getDefaultFilter = () => {

	const now = moment()

	return {
		from: now.clone().subtract(24,'hours'),
		until: now.clone(),
		maxFilter: now.clone().subtract(6,'days'),
		minFilter: now.clone()
	}
}

const initialState = {
	status: 'NORMAL',
	filter: {
		...getDefaultFilter()
	},
	nodes: {}
}
//vip - to be reviewed
const severities = {
	vip: 	  { value: 10, colorClass: 'vip'},
	CRITICAL: { value:5, colorClass: 'critical'},
	MAJOR:    { value:4, colorClass: 'major'},
	MINOR :   { value:3, colorClass: 'minor'},
	WARNING : { value:2, colorClass: 'warning'},
	UNKNOWN : { value:1, colorClass: 'natural'},
	Normal :  { value:0, colorClass: 'normal'}
}

const defaultAlert = {severity: 'Normal'}

const getMaxColor = alerts => { 
	// to be reviewed
	const maxAlert = maxBy(alerts, alert => ( alert.vip ? severities.vip.value : severities[alert.severity].value )) || defaultAlert
	return severities[ maxAlert.vip ? 'vip' : maxAlert.severity].colorClass


}

const getNodesAlerts = ({nodes}) => ({
	nodes: mapValues(nodes, ({alerts,...rest}) => ({
		...rest,
		alerts: mapValues(alerts, alert => ({
			...alert,
			date : moment(alert.date)
		}))
	})),
})


// const getNodesAlerts = ({payload: {nodes}}, state) => ({
// 	nodes: mapValues(nodes, ({alerts,name}) => ({
// 		count: Object.keys(alerts).length,
// 		color: getMaxColor(filter( alerts, alert => ( alert.vip || alert.node === name ))),
// 		alerts: mapValues(alerts, alert => ({
// 			...alert,
// 			date : moment(alert.date)
// 		}))
// 	})),
// 	status: 'NORMAL'
// })


const getfilteredAlerts = ({nodes}, {from, until}) => ({
	nodes: mapValues(nodes, ({alerts: allAlerts,name}) => {
		const alerts = pickBy(allAlerts, ({date}) => date > from && date < until)
		// const alerts = allAlerts
		return {
			count: Object.keys(alerts).length,
			color: getMaxColor(filter( alerts, alert => ( alert.severity == "CRITICAL" || alert.node === name ))),
			alerts
		}
	})
})

const getChangedAlert = ({payload: {nodeId,alert}},state) => ({
	...state,
	nodes: {
		...state.nodes,
		[nodeId] : {
			...state.nodes[nodeId],
			alerts: {
				...state.nodes[nodeId].alerts,
				[alert.id] : alert
			}
		}
	}
})

const getChangedFilter = ({payload: {filter}}, state) => {
	let newState = {
		...state,
		filter: {
			...state.filter,
			...filter
		}
	}
	if (state.allNodesAlerts){
		newState = {...newState, ...getfilteredAlerts(state.allNodesAlerts,filter)}
	}
	return newState
}

const clearAlerts = state => {
	const emptyNodesAlerts = mapValues(state.allNodesAlerts, () => {
		return {
			count: 0,
			color: severities.Unknown.colorClass,
			alerts: {}
		}
	})

	return {
		...state,
		allNodesAlerts: emptyNodesAlerts,
		nodes: emptyNodesAlerts
	}
}

const getNewAlerts = (state,{payload: nodesAlerts}) => {
	const momentNodes = getNodesAlerts(nodesAlerts)
	return {
		...state,
		allNodesAlerts: momentNodes,
		...getfilteredAlerts(momentNodes,state.filter),
		updateRecived: moment(),
		updateTime: moment(nodesAlerts.updateTime),
		status: 'NORMAL'
	}
}

export default (state = initialState, action) => {
  switch (action.type) {
	case GET_ALERTS_PENDING:
		return {...state, status: 'FETCHING'}
	case GET_ALERTS_COMPLETED:
		return getNewAlerts(state,action)
	case GET_ALERTS_FAILED:
		return {
			...state,
			// ...clearAlerts(state),
			status: 'FAILED'
		}
	case CHANGE_FILTER:
		return getChangedFilter(action,state)
	case CHANGE_ALERT:
		const changedAlerts = getChangedAlert(action,state)
		return changedAlerts
	default:
	  return state
  }
}

const postVipBulk = (alerts, success, fail) => {
	fetch(`${serverSideUrl}/alerts/changeMulti`, fetchOptions('POST', {alerts}))
	.then( res => (res.json()))
	.then( 
		res => {
			if (success) success()
		},
		res => {
			if (fail) fail()
		}
	)
}

const vipStack = delay => {
	let timeoutID = null,
	alerts = []
	delay = delay || 1000
	return function (alert, success, fail) {
		clearTimeout(timeoutID)
		alerts.push(alert)
		timeoutID = setTimeout( function (){
			postVipBulk(alerts, success, fail)
			timeoutID = null
			alerts = []
		}, delay)
	}
}

export const modifyVip = vipStack()

export const changeAlert = (nodeId, alert) => {
	return dispatch => {
		dispatch({
			type: CHANGE_ALERT,
			payload: {nodeId,alert}
		})
	}
}

export const getFlowAlerts = id => {
	return dispatch => {
		dispatch({
			type: GET_ALERTS_PENDING,
		})
		fetch(`${serverSideUrl}/flows/get/alerts/${id}`,fetchOptions())
		.then(
			res => {
				return res.json()
			}
		).then(
			res => {
				dispatch({
					type: GET_ALERTS_COMPLETED,
					payload: {nodes: res.alerts, updateTime: res.flowAlerts}
				})
			},
			response => {
				dispatch({
					type: GET_ALERTS_FAILED,
					payload: {response}
				})
			})
	}
}

export const setNewFlowAlerts = alertsObj => {
	return dispatch => {
		dispatch({
			type: GET_ALERTS_COMPLETED,
			payload: {nodes: alertsObj.alerts, updateTime: alertsObj.flowAlerts}
		})
	}
}

export const changeFilter = filter => {
	return dispatch => {
		dispatch({
			type: CHANGE_FILTER,
			payload: {filter}
		})
	}
}