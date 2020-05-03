import React from 'react'
import './lobby-style.scss'
import moment from 'moment'
import DataErrorAlert from '../../components/data-error-alert/data-error-alert'
import CircleCard from './components/circle-card/circle-card'
import DashboardList from './components/dashboardList/dashboardList'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import io from 'socket.io-client'
import {
	fetchLobbyFlows,
	fetchLobbyInfo,
	updateLobbyInfo,
	fetchLobbyDash,
	fetchAllDashboards
} from '../../modules/lobby'
import { lobbyId, lobbyNotificationsSocketUrl } from '../../config/general.config'
import { flowsNotificationsSocketUrl } from '../../config/general.config'
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
import { values, mapValues } from 'lodash'
import LineLoader from '../../components/line-loader/'


import BottomBarContent from '../../components/BottomBarContent/';
import BottomBarIntroduce from '../BottomBarIntroduce/'
const mapDispatchToProps = dispatch => bindActionCreators({
	changePage: (path) => push(path),
	fetchLobbyFlows,
	fetchLobbyInfo,
	updateLobbyInfo,
	fetchLobbyDash,
	fetchAllDashboards,
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

const mapStateToProps = state => ({
	path: state.router.location.pathname,
	sources: state.lobby.sources,
	data: state.lobby.data,
	allDashboards: state.lobby.allDashboards,
	alerts: state.alerts,
	changes: state.flow.changes,
	screenMode: state.app.screenMode
})

const getLobbyIdFromPath = path => {
	// to be reviewed
	const pathArr = path.split('/'),
		last = pathArr[pathArr.length - 1],
		secondLast = pathArr[pathArr.length - 2]
	if (last === 'lobby') return lobbyId
	if (last === '') {
		if (secondLast === 'lobby' || secondLast === '') {
			return lobbyId
		}
		return secondLast
	}
	return last
}

class Lobby extends React.Component {
	state = {
		interval: {
			id: ""
		},
		filter: ""
	}
	state = {
		interval: {
			id: ""
		},
		filter: "",
		problem: "ישנה תקלה בהצגת ההרמטיות יש לפנות לצוות Nexus.",
		dashId: getLobbyIdFromPath(this.props.path),
		alertsCount: {}
	}

	componentDidMount() {
		this.props.fetchLobbyDash(this.state.dashId)
		this.props.fetchLobbyInfo(this.state.dashId)
		this.props.fetchAllDashboards()
		this.lobbySocketHandler(this.state.dashId)
		//from temp
		this.flowSocketHandler(this.state.dashId)
		this.startInterval(this.state.dashId)

		// change to a condition that checks the status of the fetches
	}

	componentWillUnmount() {
		if (this.props.screenMode === MODES.OPEN) {
			this.props.switchModeToNormal();
		}

		this.socket.close()
		this.endInterval()	}

	componentWillReceiveProps(nextProps) {
		let currentLobbyId = getLobbyIdFromPath(nextProps.path)
		if (currentLobbyId !== this.state.dashId ) {
			this.setState({ dashId: currentLobbyId })
			this.socket.close()
			this.props.fetchLobbyDash(currentLobbyId)
			this.props.fetchLobbyInfo(currentLobbyId)
			this.props.fetchAllDashboards()
			this.lobbySocketHandler(currentLobbyId)
			this.flowSocketHandler(this.state.dashId)

		}
	}
	lobbySocketHandler = (dashId) => {
		this.socketHandler(dashId, lobbyNotificationsSocketUrl,(data) => {
				this.props.updateLobbyInfo(data)
			}
		)
	}
	flowSocketHandler = (flowId) => {
		this.socketHandler(flowId, flowsNotificationsSocketUrl, (data) => {
				this.props.setNewFlowAlerts(data)
				if (this.props.setCritical) {
					this.props.setCritical(this.countCriticalAlerts(this.props.alerts.nodes))
				}
			}
		)
	}
	socketHandler = (Id, endPoint, socketOn) => {
		this.socket = io.connect(endPoint, { query: { dashRoom: Id } })
		this.socket.on(Id,socketOn)
		//socketOn();
	}
	countCriticalAlerts = (alerts) => {
		let nodeCriticalAlertsDict = {}
		let nodeAlertsDict = alerts
		Object.keys(nodeAlertsDict).map(nodeKey => {
			let count = 0
			mapValues(nodeAlertsDict[nodeKey].alerts, (alert) => {
				if (alert.severity == "CRITICAL") {
					count++
				}
			})
			nodeCriticalAlertsDict[nodeKey] = count
		})
		return nodeCriticalAlertsDict
	}
	setCriticalAlertsCount = (alertsCountDict) => {
		this.setState({ alertsCount: alertsCountDict })
	}
	updateInterval = (id) => {
		if (id) {
			this.setState(prevState => ({
				interval: {
					...prevState.interval,
					id
				}
			}))
		} else {
			this.setState(prevState => ({
				interval: {
					...prevState.interval,
				}
			}))
		}
	}
	updateTimebarEdges = () => {
		// min filter should be now
		const now = moment(),
			{ from, until, minFilter } = this.props.alerts.filter,
			filterDelta = now - minFilter,
			// to be reviewed
			newFilter = {
				from: from.clone().add(filterDelta, 'ms'),
				until: until.clone().add(filterDelta, 'ms').add('10', 'years'),  //TODO: .add('10', 'years') is a part of a fix to handle future alerts, need to check it later to see how to really fix it instead of using that plaster.
				maxFilter: now.clone().subtract(6, 'days'),
				minFilter: now.clone()
			}

		this.props.changeFilter(newFilter)
	}
	startInterval = (flowId) => {

		const intervalTime = 30 * 1000

		this.endInterval()

		// this.onUpdate(flowId)
		const id = setInterval(() => {

			this.updateInterval()

			this.updateTimebarEdges()

			// this.onUpdate(flowId)

		}, intervalTime)

		this.updateInterval(id)
	}
	endInterval = () => {
		if (this.state.interval.id) clearInterval(this.state.interval.id)
	}
	getAlerts = flowId => {
		this.props.getFlowAlerts(flowId)
	}



	getAlertsTable = () => {
		let alerts = {}
		if (this.props.alerts) {
			mapValues(this.props.alerts.nodes, node => {
				values(node.alerts).map(alert => {
					alerts[alert.id] = alert
				})
			})
		}

		return values(alerts)
	}

	onUpdate = (flowId) => {
		// this.getAlerts(flowId)
		if (this.props.fetchLobbyInfo) this.props.fetchLobbyInfo()
	}
	render() {
		return <div className="lobby-container">
			<DataErrorAlert show={this.props.data.infoProblem} text={this.state.problem} />
			<div>
			<LineLoader show={(this.props.alerts.status === 'FETCHING')} />
			<BottomBarIntroduce
				search={event => { this.props.openSearch() }}
				edit={() => { this.props.switchModeToEdit() }}
				cancel={() => {
					this.props.switchModeToNormal()
					this.props.resetNodesToCut()
				}}
				save={() => {
					this.props.switchModeToNormal()
					this.props.resetNodesToCut()
					this.props.resetNodesToCopy()
				}}>
			 <BottomBarContent title={"דף הבית"}
				alertsTable={this.getAlertsTable()}/>
             </BottomBarIntroduce>			 

		</div>
		
			{/* <Temp
				setCritical={this.setCriticalAlertsCount}
				flowId={this.state.dashId}
				openSearch={this.props.openSearch}
				onUpdate={this.props.fetchLobbyInfo}
			/> */}
			{values(this.props.data).length != 0 && Object.keys(this.props.sources.nodes).map(nodeId => {
				const nodeChildId = this.props.sources.nodes[nodeId].child,
					nodeSelfId = this.props.sources.nodes[nodeId].id
				const { displayName, morebeakUrl } = this.props.sources.nodes[nodeId],
					alerts = this.props.data.info[flowId],
					hermetic = this.props.data.info[flowId],
					flowId = nodeChildId ? nodeChildId : nodeSelfId
				return this.props.data.info[flowId] ? <CircleCard
					colorAlerts={!!this.state.alertsCount[nodeId]}
					colorHermetic={this.props.data.info[flowId].severity}
					hasHermeticProblem={this.props.data.info[flowId].hasHermeticProblem}
					title={displayName}
					alertsCount={this.state.alertsCount[nodeId]}
					hermetic={this.props.data.info[flowId].hermetic}
					morebeakUrl={this.props.sources.nodes[nodeId].morebeakUrl}
					beakId={this.props.sources.nodes[nodeId].beakId}
					onClickAlert={() => { this.props.changePage(`/flow/${flowId}`) }}
					onClickHermetic={() => { window.location = morebeakUrl }}
				/> : null
			})}
			<DashboardList dashboards={this.props.allDashboards}
				onDashboardClick={(dashboardId) => {
					this.props.changePage(`/lobby/${dashboardId}`)
				}} />
		</div>
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(Lobby);