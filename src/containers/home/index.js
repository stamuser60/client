import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux'
import SideBar from '../../components/sidebar/'
import SideBarSection from '../../components/sidebar/sidebarsection/'
import List from '../../components/list/'
import Tool from '../../components/tool/'
import NodeInfo from '../../components/nodeInfo/'
import Flow from '../../components/flow/'
import ContextMenu from '../../components/contextMenu/'
import AlertsList from '../../components/alertsList/'
import Pathbar from '../../components/pathbar/'
import Path from '../../components/pathbar/components/path'
import BottomBar from '../../components/bottom-bar';
import { MODES } from '../../helpers/general.helper';
import ErrorMessage from '../../components/errorMessage/'
import Button from '../../components/button/'
import Row from '../../components/row/'
import BottomTitle from '../../components/bottom-title/'
import ModalWindow from '../../components/modalWindow/'
import NewFlowModal from '../../components/newFlowModal/'
import AlertsErrorModal from '../../components/alerts-error-modal/'
import TimeBar from '../../components/timeBar/'
import CancelPresentation from '../../components/cancelPresentation/'
import { Link } from 'react-router-dom'
import {findIndex ,values, sumBy, has, some, mapValues} from 'lodash'
import Loader from '../../components/loader/'
import LineLoader from '../../components/line-loader/'
import nodeTypes from '../../config/nodeTypes'
import Countdown from '../../components/countdown/'
import CountdownDisplay from '../../components/countdown-display/'
import AlertsTable from '../../components/alertsTable/'
import AlertSearch from '../../components/alertSearch/'
import NodeContextMenu from '../../components/nodeContextMenu/nodeContextMenu'
import LinkContextMenu from '../../components/linkContextMenu/lineContextMenu'
import io from 'socket.io-client'
import { rootId, circleDiameter, flowsNotificationsSocketUrl, lastUpdateChannel} from '../../config/general.config.js'
import { bindActionCreators } from 'redux'
import {history} from '../../modules';

import BottomBarContent from '../../components/BottomBarContent/'

import {
  changeXY,
  changeOffset,
  addBlankNode,
  deleteNode,
  addLink,
  removeLink,
  clearChanges,
  loadFlowLocally,
  addChild,
  fetchFlow,
  changeNodeInfo,
  saveChanges,
  addNewFlow,
  addNodeToRoot,
  generateId,
  pasteCutNode,
  cutFlowToChanges,
	pasteCopyOfNewNode,
//   copyNode,
} from '../../modules/flow'
import {
	getFlowAlerts,
	setNewFlowAlerts,
	changeAlert,
	modifyVip,
	changeFilter,
	getDefaultFilter
} from '../../modules/alerts'
import {popupErrorAlert} from '../../modules/error'
import { push } from 'react-router-redux'
import { switchModeToNormal, switchModeToEdit, switchModeToOpen, addNodeToCopy, resetNodesToCopy, addNodeToCut, resetNodesToCut } from '../../modules/app'
import Search from '../search/search'

const mapStateToProps = state => ({
	path: state.router.location.pathname,
	flowStatus: state.flow.status,
	flow: state.flow.flow,
	changes: state.flow.changes,
	alerts: state.alerts,
	screenMode: state.app.screenMode,
	copiedNodes: state.app.copiedNodes,
	cutedNodes: state.app.cutedNodes
})

const mapDispatchToProps = dispatch => bindActionCreators({
	pasteCopyOfNewNode,
  changeXY,
  changeOffset,
  addBlankNode,
  deleteNode,
  pasteCutNode,
  addLink,
  removeLink,
  clearChanges,
  loadFlowLocally,
  addChild,
  fetchFlow,
  changeNodeInfo,
  saveChanges,
  addNodeToRoot,
  addNewFlow,
  getFlowAlerts,
  setNewFlowAlerts,
  changeAlert,
  changeFilter,
  cutFlowToChanges,
  popupErrorAlert,
  switchModeToNormal,
  switchModeToEdit,
  switchModeToOpen,
  addNodeToCopy,
  resetNodesToCopy,
  addNodeToCut,
  resetNodesToCut,
  changePage: (path) => push(path)
}, dispatch)

const preventBrowserDnD = () => {
	window.addEventListener("dragover", function(e) {
		e.preventDefault()
	},false)
	window.addEventListener("drop", function(e) {
		e.preventDefault()
	},false)
}

// to be reviewed, the modes are handled very badly here (all over the place)
const FOCUS_SECTIONS = {
	FLOW: 'FLOW',
	NODE_INFO: "NODE_INFO",
}

class Home extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			filter: "",
			connectingLink: false,
			nodeContextMenu : {
				x: 0,
				y: 0,
				id: ""
			},
			lineContextMenu : {
				visible: false,
				x: 0,
				y: 0,
				line: {}
			},
			backgroundContextMenu : {
				x: 0,
				y: 0,
				visible: false
			},
			selectedNode: "",
			tmpLine: {visible:false,fromX:0,fromY:0,toX:0,toY:0,fromNode:""},
			paths: [],
			modal: {
				open: false,
				content: {
					title: "",
					component: null
				}
			},
			interval: {
				id: ""
			},
			bottomBarShow: true,
			focus: FOCUS_SECTIONS.FLOW,
			showSidebar: false
		}
		this.selectedNodeTimer = null
	}

	changeOffset = (offset) => {
		// this.setState({offset})
		this.props.changeOffset(offset)
	}

	componentWillReceiveProps(nextProps){

		// pathbar, to be removed, to be reviewed
		if ( nextProps.flow.id !== this.props.flow.id ){
			const newFlowId = nextProps.flow.id
			const index = findIndex(this.state.paths, {id: newFlowId})
			this.setState({paths: index > -1 ?
				this.state.paths.slice(0,index + 1) :
				[...this.state.paths,{id:newFlowId,
					displayName: nextProps.flow.displayName || "אין שם הצגה"
				}]
			})
		}

		if (nextProps.path !== this.props.path) {
			const newFlowId = this.getIdFromPath(nextProps.path)

			if (this.props.cutedNodes.some(node => node.nodeInfo.child === newFlowId)) {
				history.goBack()
				this.props.popupErrorAlert('לא ניתן להיכנס למסלול שמסומן לגזירה', 3)
				return
			}

			//  load from local or server
			if ( this.props.screenMode === MODES.EDIT && has(nextProps.changes,newFlowId)){
				this.props.loadFlowLocally(nextProps.changes[newFlowId])
        this.socketHandler(newFlowId)
			} else {
				this.changeSelectedNode('', () => {
					this.props.fetchFlow(newFlowId)
					this.socketHandler(newFlowId)
				})
			}

			this.closeBackgroundContextMenu()
			this.closeLineContextMenu()
			this.closeNodeContextMenu()

			this.startInterval(newFlowId)
		}
	}

	changeMode = (mode,callback) => {
		if(mode === MODES.NORMAL) {
			this.props.switchModeToNormal();
		} else {
			this.props.switchModeToEdit();
		}
	}

	changeSelectedNode = (id, callback) => {
		this.setState({ selectedNode : id},callback)
	}

	changePage = (flowId) => {
		this.setState({...this.state,selectedNode:'',nodeContextMenu : {x: 0,y: 0,node: ""}},
			() => {this.props.changePage('/flow/' + flowId)})

	}

	getIdFromPath = path => {
		// to be reviewed

		const pathArr = path.split('/'),
		last = pathArr[pathArr.length - 1],
		secondLast = pathArr[pathArr.length - 2]
		if (last === 'flow') return rootId
		if (last === ''){
			if (secondLast === 'flow' || secondLast === ''){
				return rootId
			}
			return secondLast
		}
		return last
	}

	updateInterval = (id) => {
		if (id){
			this.setState( prevState => ({
				interval: {
					...prevState.interval,
					id
				}
			}))
		} else {
			this.setState( prevState => ({
				interval: {
					...prevState.interval
				}
			}))
		}
	}

	getAlerts = flowId => {
		this.props.getFlowAlerts(flowId)
	}

	closeBottomBar = () => {
		this.props.switchModeToNormal()
	}

	startInterval = (flowId) => {

		const intervalTime = 30 * 1000

		this.endInterval()

		const id = setInterval(() => {
			
			this.updateInterval()
			this.updateTimebarEdges()
		}, intervalTime)

		this.updateInterval(id)
	}

	endInterval = () => {
		if (this.state.interval.id) clearInterval(this.state.interval.id)
	}

	componentDidMount = () => {
		preventBrowserDnD()

		const flowId = this.getIdFromPath(this.props.path)

		if(this.props.screenMode === MODES.EDIT) {
			this.setState({showSidebar: true})
			this.changeMode(MODES.EDIT)
		}
		else {
			this.selectedNodesReset();
		}

		if(this.props.screenMode === MODES.EDIT && has(this.props.changes, flowId)) {
			this.props.loadFlowLocally(this.props.changes[flowId]);
		} else {
			this.props.fetchFlow(flowId)
		}

		this.startInterval(flowId)	
		this.socketHandler(flowId)
	}

	socketHandler = (flowId) => {
		const endPoint = flowsNotificationsSocketUrl
		if(this.socket != undefined) {
			this.socket.close()			
		}
		this.socket = io.connect(endPoint, {query: {flowRoom: flowId}})
		this.socket.on(flowId, (data)=> {
			this.props.setNewFlowAlerts(data)
		})
	}

	componentWillUnmount  = () =>{
		if(this.props.screenMode === MODES.OPEN) {
			this.props.switchModeToNormal();
		}

		this.endInterval()
		this.setState({showSidebar: false});
		// to be reviewed
		this.resetTimeFilter()
		this.socket.close()
		//console.log("This is the changes: ", this.props.changes)
	}

	onNodeTap = (event, nodeId) => {

		// to be reviewed, seperate each click type (single,double, etc) to its own func

		// if right click
		if (event.which === 3){
			return;
		}
		// clicked node to connect a link to it
		if (this.state.connectingLink){
			this.setState({connectingLink:false})

			const fromNode = this.state.tmpLine.fromNode
			const toNode = nodeId

			const shouldAddLink = !some(this.props.flow.links, item => item.from === fromNode && item.to === toNode)

			if (shouldAddLink) this.props.addLink(fromNode,toNode)
		// regular node click
		// to be reviewed
		} else {
			this.changeSelectedNode(nodeId)
			if (this.props.screenMode !== MODES.EDIT){
				this.props.switchModeToOpen()
			}
		}
	}

	onNodeDoubleTap = (event, node) => {
		if (event.which === 3){
			return;
		}

		if (this.props.cutedNodes.some(cutNode => cutNode.nodeId === node.id)) {
     		 this.props.popupErrorAlert('לא ניתן להיכנס למסלול שמסומן לגזירה', 3)
		  	return
    	}

		if (has(node, 'child')) {
			this.changePage(`${node.child}`)
		}
	}

	onNodeContextMenu = (event, nodeId) => {
		event.preventDefault()
		const {pageX: x,pageY: y} = event
		this.setState({nodeContextMenu: {visible: true, x, y, id: nodeId}})
	}

	  onBackgroundContextMenu = (event, nodeId) => {
		if(!this.state.nodeContextMenu.id && !this.state.lineContextMenu.visible) {
			event.preventDefault()
			const {pageX: x,pageY: y} = event
			this.setState({backgroundContextMenu: {visible: true, x, y}})
		}
	}

	onLinkContextMenu = (event, link) => {
		// this.closeNodeContextMenu()
		// this.closeBackgroundContextMenu()
		console.log("link")
		event.preventDefault()
		const {pageX: x, pageY: y} = event
		this.setState({lineContextMenu: {visible: true, x, y, line: link}})
	}

	closeTmpline = () => {
		this.setState({tmpLine:{...this.state.tmpLine,visible:false}})
	}

	connectLink = (id) => {
		this.setState({
			connectingLink: true,
			tmpLine: {
					visible : true,
					fromX : this.props.flow.nodes[id].x,
					fromY : this.props.flow.nodes[id].y,
					fromNode: id
			},
		})
	}

	closeNodeContextMenu = () => {
		this.setState({nodeContextMenu: {visible: false}})
	}

	closeBackgroundContextMenu = () => {
		this.setState({backgroundContextMenu: {visible: false}})
	}

	closeLineContextMenu = () => {
		this.setState({lineContextMenu: {visible: false}})
	}

	addChild = id => {
		if (this.props.cutedNodes.some(cutNode => cutNode.nodeId === id)) {
			this.props.popupErrorAlert('לא ניתן ליצור מסלול בן לרכיב המסומן לגזירה', 7)
			return
		}

		let nodeObj = this.props.flow.nodes[id]
		if (has(nodeObj, 'child')) {
			this.changePage(`${nodeObj.child}`)
		} else {
			this.props.addChild(id)
			this.changePage(`${id}`)
		}
	}

	addNode = type => {
		// to be reviewed
		const nodes = values(this.props.flow.nodes)
		const nodesLen = nodes.length || 1
		const x = sumBy(nodes, 'x') / nodesLen || 320
		const y = sumBy(nodes, 'y') / nodesLen || 142
		this.props.addBlankNode(type,x,y)

	}

	closeModal = () => {
		this.setState((prevState) => ({
			modal: {
				...prevState.modal,
				open: false
			}
		}))
	}

	openAlertsProblemModal = () => {
		this.setState({
			modal: {
				title: "אויש",
				component: <AlertsErrorModal/>,
				open: true
			}
		})
	}

	openNewFlowModal = () => {
		this.setState({
			modal: {
				title: "פרטי המסלול",
				component: <NewFlowModal addFlow={this.addNewFlow} toggle={this.closeModal} type={this.state.type}/>,
				open: true
			}
		})
	}

	addNewFlow = (name, displayName) => {
		const id = generateId()
		this.changeMode(MODES.EDIT, () => {
			this.props.addNewFlow(id, name, displayName)
			this.changePage(`${id}`)
		})
		this.setState({
			paths: [name]
		})
	}

	getAlertsList = nodeId => (
		// sort by vip and date
		values(this.props.alerts.nodes[nodeId].alerts).sort( (alertA,alertB) => {
			const {vip: vipA} = alertA,
				  {vip: vipB} = alertB
			if (vipA && !vipB) return 1000000
			if (vipB && !vipA) return -1000000
			return (alertA.date - alertB.date)/1000/60/60
		}).reverse()
	)

	updateTimebarEdges = () => {
		// min filter should be now
		const now = moment(),
		{from, until, minFilter} = this.props.alerts.filter,
		filterDelta = now - minFilter,
		// to be reviewed
		newFilter = {
			from: from.clone().add(filterDelta,'ms'),
			until: until.clone().add(filterDelta,'ms'),
			maxFilter: now.clone().subtract(6,'days'),
			minFilter: now.clone()
		}

		this.props.changeFilter(newFilter)
	}


	// to be reviewed
	resetTimeFilter = () => {
		this.props.changeFilter(getDefaultFilter())
	}

	getAlertsTable = () => {
		let alerts = {}
		mapValues(this.props.alerts.nodes, node => {
			values(node.alerts).map(alert => {
				alerts[alert.id] = alert
			})
		})

		return values(alerts)
	}

	changeAlertsFilter = (filter) => {
		this.setState({filter})
	}

	
	deleteRightClickedNode = () => {
		this.props.deleteNode(this.state.nodeContextMenu.id)
		this.changeSelectedNode('')

		let cutNodesWithoutDeletedNode = this.props.cutedNodes.filter((node) => {return node.nodeId !== this.state.nodeContextMenu.id})
		this.props.copiedNodes.length !== 0 ? this.props.addNodeToCopy(this.props.copiedNodes.filter((node) => {return node.nodeId !== this.state.nodeContextMenu.id})) : this.props.addNodeToCut(this.props.cutedNodes.filter((node) => {return node.nodeId !== this.state.nodeContextMenu.id}))
		this.props.addNodeToCut(cutNodesWithoutDeletedNode)
	}

	cutNode = () => {
		this.props.resetNodesToCopy();
		this.props.addNodeToCut([{nodeId: this.state.nodeContextMenu.id, flowId:this.props.flow.id, nodeInfo:this.props.flow.nodes[this.state.nodeContextMenu.id]}]);
		this.props.cutFlowToChanges()
	}

	copyNode = () => {
		this.props.addNodeToCopy([{flowId:this.props.flow.id, nodeId: this.state.nodeContextMenu.id, nodeInfo:this.props.flow.nodes[this.state.nodeContextMenu.id]}])
		this.props.resetNodesToCut();
	}

	pasteNodes = () => {
		if(this.props.copiedNodes.length || this.props.cutedNodes.length) {
			let x = this.state.backgroundContextMenu.x ? this.state.backgroundContextMenu.x - this.props.flow.offset.x : window.innerWidth/2 - this.props.flow.offset.x
			let y = this.state.backgroundContextMenu.y ? this.state.backgroundContextMenu.y - this.props.flow.offset.y : window.innerHeight/2 - this.props.flow.offset.y

			if(this.props.cutedNodes.length) { // if cut
				this.pasteCutNode(x,y)
			} else { // if copy
				this.pasteCopyNode(x,y)
			}
		}
	}

	goToDashboard = () => {
		if (this.graphanaIsAvailable()) {
			const selectedNodeObj = this.props.flow.nodes[this.state.nodeContextMenu.id]
			let nodeName = selectedNodeObj.name
			if (nodeName.includes(<domainName/>)) {
				nodeName = nodeName.slice(0, -10)
			}
			window.open(`${process.env.REACT_APP_GRAFANA_URL}${nodeName}&${process.env.REACT_APP_GRAFANA_TIME_QUERY}`)
		}
	}

	graphanaIsAvailable = () => {
		if (!process.env.REACT_APP_GRAFANA_URL) {
			return false
		}
		const selectedNodeObj = this.props.flow.nodes[this.state.nodeContextMenu.id]
		if (selectedNodeObj) {
			return selectedNodeObj.type === "server"
		}
		return false
	}

	pasteCutNode = (x,y) => {
		this.props.cutedNodes.map(node => {
			this.props.pasteCutNode(node, {x,y})
		})
		this.props.resetNodesToCut();
	}

	pasteCopyNode = (x,y) => {
		let toPaste = this.props.copiedNodes
		let targetNodeInfo = toPaste[0].nodeInfo
		this.props.pasteCopyOfNewNode(targetNodeInfo, this.props.changes, {x, y})
	}

	onCtrlC = () => {
		if (this.state.focus !== FOCUS_SECTIONS.FLOW) {
			return
		}
		if (this.props.screenMode === MODES.EDIT && this.state.selectedNode) {
			this.props.resetNodesToCut();
			this.props.addNodeToCopy([{flowId:this.props.flow.id, nodeId: this.state.selectedNode, nodeInfo:this.props.flow.nodes[this.state.selectedNode]}])
		}
	}

	onCtrlV = () => {
		if (this.state.focus !== FOCUS_SECTIONS.FLOW) {
			return
		}
		if (this.props.screenMode === MODES.EDIT && this.props.copiedNodes.length || this.props.screenMode === MODES.EDIT && this.props.cutedNodes.length) {
			this.pasteNodes()
			this.props.resetNodesToCut();
		}
	}

	onCtrlX = () => {
		if (this.state.focus !== FOCUS_SECTIONS.FLOW) {
			return
		}
		if (this.props.screenMode === MODES.EDIT && this.state.selectedNode) {
			this.props.resetNodesToCopy();
			this.props.addNodeToCut([{nodeId: this.props.flow.nodes[this.state.selectedNode].id, flowId: this.props.flow.id, nodeInfo: this.props.flow.nodes[this.state.selectedNode]}]);
			this.props.cutFlowToChanges()
		}
	}

	selectedNodesReset = () => {
		this.setState({selectedNode: ''})
		this.props.resetNodesToCopy();
		this.props.resetNodesToCut();
	}

	setFocusFlow = () => {
		this.setState({
			focus: FOCUS_SECTIONS.FLOW
		})
	}

	setFocusInfo = () => {
		this.setState({
			focus: FOCUS_SECTIONS.NODE_INFO
		})
	}

	render () {
		{/*return <Search/>*/}

		if (this.props.flowStatus === 'FAILED') return <ErrorMessage/>
		const {props} = this
		const {nodeContextMenu, lineContextMenu, selectedNode} = this.state
		const selectedNodeObj = props.flow.nodes[selectedNode] || {}

		return (
			<div>
				{/*node context menu
					TODO: fix double ContextMenu when click background
				*/}
				<NodeContextMenu
					nodeContextDetails={nodeContextMenu}
					backgroundContextDetails={this.state.backgroundContextMenu}
					mode={this.props.screenMode}
					closeNodeContext={this.closeNodeContextMenu}
					closeBackgroundContext={this.closeBackgroundContextMenu}
					onConnectLink={()=>{this.connectLink(this.state.nodeContextMenu.id)}}
					onAddChild={()=>{ this.addChild(this.state.nodeContextMenu.id) }}
					onDeleteNode={()=>{this.deleteRightClickedNode()}}
					onCutNode={this.cutNode}
					onCopyNode={this.copyNode}
					onPasteNode={this.pasteNodes}
					disabled={(this.props.copiedNodes.length === 0 && this.props.cutedNodes.length === 0)}
					graphanaDisabled={!this.graphanaIsAvailable()}
					onDashboard={this.goToDashboard}
				/>
				<LinkContextMenu
					mode={this.props.screenMode}
					contextDetails={lineContextMenu}
					close={this.closeLineContextMenu}
					onRemoveLink={()=>{props.removeLink(lineContextMenu.line.from,lineContextMenu.line.to)}}
				/>
				<LineLoader show={(this.props.alerts.status === 'FETCHING')}/>
				<Loader show={(this.props.flowStatus === 'FETCHING')} style={{zIndex:1000, position: 'relative'}}/>
				{(this.props.flowStatus === 'FETCHING') ? null : <Flow onClick={(event) => {
					this.changeSelectedNode('')
					if (this.props.screenMode !== MODES.EDIT){
						this.props.switchModeToNormal()
					}
				}}
					setFocus={this.setFocusFlow}
					offset = {this.props.flow.offset}
					changeOffset = {this.changeOffset}
					nodes = {props.flow.nodes}
					links = {props.flow.links}
					alerts = {props.alerts}
					selectedNode = {selectedNode}
					changeXY = {props.changeXY}
					nodesDraggingEnabled = {this.props.screenMode === MODES.EDIT}
					onNodeTap = {this.onNodeTap}
					onNodeDoubleTap = {this.onNodeDoubleTap}
					onNodeContextMenu = {this.onNodeContextMenu}
					onBackgroundContextMenu = {(event)=>{
						if (this.props.screenMode === MODES.EDIT){
							this.onBackgroundContextMenu(event)
						}
					}}
					onLinkContextMenu = {this.onLinkContextMenu}
					tmpline = {this.state.tmpLine}
					closeTmpline = {this.closeTmpline}
					cutNodes = {this.props.cutedNodes}
					ctrlC={this.onCtrlC}
					ctrlV={this.onCtrlV}
					ctrlX={this.onCtrlX}
				>
				</Flow>}
				<Pathbar>
					{this.state.paths.map( path => {
						return <Path key={path.id} displayName = {path.displayName} onClick={()=>{
							this.changePage(`${path.id}`)
						}}>{path.displayName}</Path>
					})}
				</Pathbar>
				<SideBar show={this.state.showSidebar} left={true}>
					<SideBarSection title="כלים" open={true}>
						<List>
							{Object.keys(nodeTypes).map( typeId => {
								const type = nodeTypes[typeId]
								return (<Tool key={typeId} name={type.displayName} img={type.asset} onClick={() => {this.addNode(typeId)}}/>)
							})}
						</List>
					</SideBarSection>
				</SideBar>
				
				<SideBar show={( selectedNode !== "")} 
						 left={false}
						 defaultIndex = {0}>
					<SideBarSection title="מידע">
						<NodeInfo
							setFocus={this.setFocusInfo}
							unsetFocus={this.setFocusFlow}
							edit = {this.props.screenMode === MODES.EDIT}
							types = {nodeTypes}
							type = {selectedNodeObj.type}
							nodeTypes = {nodeTypes}
							name = {selectedNodeObj.name}
							regex = {selectedNodeObj.regex}
							displayName = {selectedNodeObj.displayName}
							description = {selectedNodeObj.description}
							team = {selectedNodeObj.team}
							submit = { nodeData => {this.props.changeNodeInfo(selectedNode,nodeData)}} />
					</SideBarSection>			
				</SideBar>
				<TimeBar
				maxFilter = {props.alerts.filter.maxFilter} 
				minFilter = {props.alerts.filter.minFilter}
				changeFilter = {props.changeFilter}
				filter = {props.alerts.filter}
				hide = {this.props.screenMode === MODES.EDIT}
				/>
				<BottomBar 
					show = {this.state.bottomBarShow}
					title = {
						<CountdownDisplay 
						updateTime={this.props.alerts.updateTime} 
						/>
					}
					changes={this.props.changes}
					mode={this.props.screenMode} 
					search={ event => {this.props.openSearch()}}
					edit={()=> {
						this.props.clearChanges()
						this.setState({showSidebar: true});
						this.changeMode(MODES.EDIT)
					}}
					cancel={()=>{
						let flowId = this.props.flow.id
						props.clearChanges()
						this.setState({paths:[]})
						this.changeMode(MODES.NORMAL,()=>{this.changePage(`${flowId}`)})
						this.props.fetchFlow(flowId)
						this.socketHandler(flowId)
						this.selectedNodesReset()
						this.setState({showSidebar: false});
						this.props.resetNodesToCut();
					}}
					save={()=>{
						this.props.saveChanges({...this.props.changes})
						this.changeMode(MODES.NORMAL)
						props.clearChanges()
						this.selectedNodesReset()
						this.setState({showSidebar: false});
						this.props.resetNodesToCut();
					}}
					open={this.props.switchModeToOpen}
					close={this.props.switchModeToNormal}
					>
						<BottomBarContent title={props.flow.displayName}
						alertsTable={props.alerts.nodes[selectedNodeObj.id] 
							? this.getAlertsList(selectedNodeObj.id) 
							: this.getAlertsTable()}/>
					{/* <BottomTitle>
						{props.flow.displayName}
					</BottomTitle>
					<BottomTitle>
						<AlertSearch setFilter={this.changeAlertsFilter}></AlertSearch>
					</BottomTitle>
					<Row>
						<AlertsTable 
						isOpen={this.state.bottomBarShow} 
						filter={this.state.filter} 
						alerts={props.alerts.nodes[selectedNodeObj.id] 
						? this.getAlertsList(selectedNodeObj.id) 
						: this.getAlertsTable()}/>
					</Row> */}
				</BottomBar>
				<CancelPresentation show={(this.props.screenMode === 'PRESENTATION')} mode={this.props.screenMode} cancel={() => {this.changeMode(MODES.NORMAL)}}/>
				<ModalWindow mode={this.state.modal.open}
							title={this.state.modal.title}
							 close={this.closeModal}
							 width={350}>
					{this.state.modal.component}
				</ModalWindow>
			</div>
		)
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Home);
