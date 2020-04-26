import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	getFlowAlerts,
	changeFilter,
	setNewFlowAlerts
} from '../../modules/alerts';
import { clearChanges, saveChanges }
	from '../../modules/flow'
import { switchModeToNormal, switchModeToEdit, switchModeToOpen, resetNodesToCopy, resetNodesToCut }
	from '../../modules/app'

import { MODES } from '../../helpers/general.helper';
import BottomBar from '../../components/bottom-bar';
import CountdownDisplay from '../../components/countdown-display/'
import BottomTitle from '../../components/bottom-title/'
import AlertSearch from '../../components/alertSearch/'
import Row from '../../components/row/'
import AlertsTable from '../../components/alertsTable/'
import moment from 'moment'
import io from 'socket.io-client'
import { flowsNotificationsSocketUrl } from '../../config/general.config'
import { values, mapValues } from 'lodash'
import LineLoader from '../../components/line-loader/'


import BottomBarContent from '../../components/BottomBarContent/';
import BottomBarIntroduce from '../BottomBarIntroduce/'
const mapStateToProps = state => ({
	alerts: state.alerts,
	changes: state.flow.changes,
	screenMode: state.app.screenMode
})

const mapDispatchToProps = dispatch => bindActionCreators({
	getFlowAlerts,
	changeFilter,
	setNewFlowAlerts,
	clearChanges,
	switchModeToNormal,
	switchModeToEdit,
	switchModeToOpen,
	saveChanges,

	resetNodesToCut,
	resetNodesToCopy
}, dispatch)


class Temp extends React.Component {

	// state = {
	// 	interval: {
	// 		id: ""
	// 	},
	// 	filter: ""
	// }

	// updateInterval = (id) => {
	// 	if (id) {
	// 		this.setState(prevState => ({
	// 			interval: {
	// 				...prevState.interval,
	// 				id
	// 			}
	// 		}))
	// 	} else {
	// 		this.setState(prevState => ({
	// 			interval: {
	// 				...prevState.interval,
	// 			}
	// 		}))
	// 	}
	// }

	// getAlerts = flowId => {
	// 	this.props.getFlowAlerts(flowId)
	// }



	// getAlertsTable = () => {
	// 	let alerts = {}
	// 	if (this.props.alerts) {
	// 		mapValues(this.props.alerts.nodes, node => {
	// 			values(node.alerts).map(alert => {
	// 				alerts[alert.id] = alert
	// 			})
	// 		})
	// 	}

	// 	return values(alerts)
	// }

	// onUpdate = (flowId) => {
	// 	// this.getAlerts(flowId)
	// 	if (this.props.onUpdate) this.props.onUpdate()
	// }

	// updateTimebarEdges = () => {
	// 	// min filter should be now
	// 	const now = moment(),
	// 		{ from, until, minFilter } = this.props.alerts.filter,
	// 		filterDelta = now - minFilter,
	// 		// to be reviewed
	// 		newFilter = {
	// 			from: from.clone().add(filterDelta, 'ms'),
	// 			until: until.clone().add(filterDelta, 'ms').add('10', 'years'),  //TODO: .add('10', 'years') is a part of a fix to handle future alerts, need to check it later to see how to really fix it instead of using that plaster.
	// 			maxFilter: now.clone().subtract(6, 'days'),
	// 			minFilter: now.clone()
	// 		}

	// 	this.props.changeFilter(newFilter)
	// }

	// startInterval = (flowId) => {

	// 	const intervalTime = 30 * 1000

	// 	this.endInterval()

	// 	// this.onUpdate(flowId)


	// 	const id = setInterval(() => {

	// 		this.updateInterval()

	// 		this.updateTimebarEdges()

	// 		// this.onUpdate(flowId)

	// 	}, intervalTime)

	// 	this.updateInterval(id)
	// }

	// endInterval = () => {
	// 	if (this.state.interval.id) clearInterval(this.state.interval.id)
	// }

	// componentDidMount() {
	// 	this.socketHandler(this.props.flowId)
	// 	this.startInterval(this.props.flowId)
	// }

	// componentWillReceiveProps(nextProps) {
	// 	if (this.props.flowId !== nextProps.flowId) {
	// 		this.socket.close()
	// 		this.socketHandler(nextProps.flowId)
	// 	}
	// }
	

	// socketHandler = (flowId) => {

	// 	const endPoint = flowsNotificationsSocketUrl
	// 	this.socket = io.connect(endPoint, 
	// 		{ query: { flowRoom: flowId } })
	
			
	// }

	// componentWillUnmount() {
	// 	if (this.props.screenMode === MODES.OPEN) {
	// 		this.props.switchModeToNormal();
	// 	}

	// 	this.socket.close()
	// 	this.endInterval()
	// }
	// countCriticalAlerts = (alerts) => {
	// 	let nodeCriticalAlertsDict = {}
	// 	let nodeAlertsDict = alerts
	// 	Object.keys(nodeAlertsDict).map(nodeKey => {
	// 		let count = 0
	// 		mapValues(nodeAlertsDict[nodeKey].alerts, (alert) => {
	// 			if (alert.severity == "CRITICAL") {
	// 				count++
	// 			}
	// 		})
	// 		nodeCriticalAlertsDict[nodeKey] = count
	// 	})
	// 	return nodeCriticalAlertsDict
	// }
//no one call this function????!!!!!
	// resetApplicationState = () => {
	// 	this.props.clearChanges()
	// 	this.props.switchModeToNormal()
	// 	this.props.resetNodesToCut()
	// 	this.props.resetNodesToCopy()
	// }

	// render() {
	// 	return <div>
	// 		<LineLoader show={(this.props.alerts.status === 'FETCHING')} />
	// 		<BottomBarIntroduce
	// 			search={event => { this.props.openSearch() }}
	// 			edit={() => { this.props.switchModeToEdit() }}
	// 			cancel={() => {
	// 				this.props.switchModeToNormal()
	// 				this.props.resetNodesToCut()
	// 			}}
	// 			save={() => {
	// 				this.props.switchModeToNormal()
	// 				this.props.resetNodesToCut()
	// 				this.props.resetNodesToCopy()
	// 			}}>
	// 		 <BottomBarContent title={"דף הבית"}
	// 			alertsTable={this.getAlertsTable()}/>
    //          </BottomBarIntroduce>			 

	// 	</div>
	// }
}

export default connect(mapStateToProps, mapDispatchToProps)(Temp);
