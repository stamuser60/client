import React from 'react'
import LobbyCard from './components/lobby-card/lobby-card'
import Headline from './components/headline/headline'
import './lobby-style.scss'
import moment from 'moment'
import alhutan from './assets/alhutan.png'
import dj from './assets/dj.png'
import tacti from './assets/tacti.png'
import text from './assets/text.png'
import DataErrorAlert from '../../components/data-error-alert/data-error-alert'
import CircleCard from './components/circle-card/circle-card'
import DashboardList from './components/dashboardList/dashboardList'
import Temp from '../temp/temp'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import {values} from 'lodash'
import io from 'socket.io-client'
import {
	fetchLobbyFlows,
	fetchLobbyInfo,
	updateLobbyInfo,
	fetchLobbyDash,
	fetchAllDashboards
  } from '../../modules/lobby'
import {lobbyId, lobbyNotificationsSocketUrl} from '../../config/general.config'

const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (path) => push(path),
  fetchLobbyFlows,
  fetchLobbyInfo,
  updateLobbyInfo,
  fetchLobbyDash,
  fetchAllDashboards
}, dispatch)

const mapStateToProps = state => ({
	path: state.router.location.pathname, 
	sources: state.lobby.sources,
	data: state.lobby.data,
	allDashboards: state.lobby.allDashboards
})

const getLobbyIdFromPath = path => {
	// to be reviewed
	const pathArr = path.split('/'),
	last = pathArr[pathArr.length - 1],
	secondLast = pathArr[pathArr.length - 2]
	if (last === 'lobby') return lobbyId
	if (last === ''){
		if (secondLast === 'lobby' || secondLast === ''){
			return lobbyId
		}
		return secondLast
	}
	return last
}

class Lobby extends React.Component {

	state = {
		problem: "ישנה תקלה בהצגת ההרמטיות יש לפנות לצוות Nexus.",
		dashId: getLobbyIdFromPath(this.props.path),
		alertsCount: {}
	}

	componentDidMount() {
		this.props.fetchLobbyDash(this.state.dashId)
		this.props.fetchLobbyInfo(this.state.dashId)
		this.props.fetchAllDashboards()
		this.socketHandler(this.state.dashId)
		// change to a condition that checks the status of the fetches
	}

	componentWillUnmount() {
		this.socket.close()
	}

	componentWillReceiveProps(nextProps){
		let currentLobbyId = getLobbyIdFromPath(nextProps.path) 
		if (currentLobbyId !== this.state.dashId) {
			this.setState({dashId: currentLobbyId})
			this.socket.close()
			this.props.fetchLobbyDash(currentLobbyId)
			this.props.fetchLobbyInfo(currentLobbyId)
			this.props.fetchAllDashboards()
			this.socketHandler(currentLobbyId)			
		}
	}		

	socketHandler = (dashId) => {
		const endPoint = lobbyNotificationsSocketUrl
		const lobbyInfoChannel = dashId
		this.socket = io.connect(endPoint, {query: {dashRoom: dashId}})
		this.socket.on(lobbyInfoChannel, (data)=> {
			this.props.updateLobbyInfo(data)
		})		
	}

	setCriticalAlertsCount = (alertsCountDict) => {
		this.setState({alertsCount: alertsCountDict})
	}

	render(){
		return <div className="lobby-container">
			<DataErrorAlert show={this.props.data.infoProblem} text={this.state.problem} />
			<Temp 
			setCritical={this.setCriticalAlertsCount}
			flowId={this.state.dashId}
			openSearch={this.props.openSearch}
			onUpdate={this.props.fetchLobbyInfo}
			/>
			{ values(this.props.data).length != 0 && Object.keys(this.props.sources.nodes).map( nodeId => {
				const nodeChildId = this.props.sources.nodes[nodeId].child,			
				nodeSelfId = this.props.sources.nodes[nodeId].id				
				const {displayName, morebeakUrl} = this.props.sources.nodes[nodeId],
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
						onClickAlert = {() => {this.props.changePage(`/flow/${flowId}`)}}
						onClickHermetic = {() => {window.location = morebeakUrl}}
						/> : null
			})}
			<DashboardList dashboards={this.props.allDashboards}
						   onDashboardClick = {(dashboardId) => {this.props.changePage(`/lobby/${dashboardId}`)
						   }}/>
		</div>
	}	
}
export default connect(mapStateToProps,mapDispatchToProps)(Lobby);