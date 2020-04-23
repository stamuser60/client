import {popupErrorAlert} from './error'
import {isEqual, omit, reduce} from 'lodash'
import shortid from 'shortid'
import {serverSideUrl, rootId, fetchOptions, circleDiameter} from '../config/general.config.js'

export const GET_FLOW_PENDING = 'flow/GET_FLOW_PENDING'
export const GET_FLOW_COMPLETE = 'flow/GET_FLOW_COMPLETE'
export const GET_FLOW_FAILED = 'flow/GET_FLOW_FAILED'

export const CHANGEXY = 'flow/CHANGEXY'
export const CHANGE_OFFSET = 'flow/CHANGE_OFFSET'
export const ADDBLANKNODE = 'flow/ADDBLANKNODE'
export const ADDCOPPIEDNODE = 'flow/ADDCOPPIEDNODE'
export const PASTE_TO_CHANGES = 'flow/PASTE_TO_CHANGES'
export const CUT_FLOW_TO_CHANGES = 'flow/CUT_FLOW_TO_CHANGES'
export const PASTE_CUT_NODE = 'flow/PASTE_CUT_NODE'
export const DELETENODE = 'flow/DELETENODE'
export const ADDLINK = 'flow/ADDLINK'
export const REMOVELINK = 'flow/REMOVELINK'
export const ADD_CHILD = 'flow/ADD_CHILD'
export const LOAD_LOCALLY = 'flow/LOAD_LOCALLY'
export const CHANGE_NODE_INFO = 'flow/CHANGE_NODE_INFO'
export const CLEAR_CHANGES = 'flow/CLEAR_CHANGES'
export const SAVE_CHANGES_PENDING = 'flow/SAVE_CHANGES_PENDING'
export const SAVE_CHANGES_COMPLETED = 'flow/SAVE_CHANGES_COMPLETED'
export const SAVE_CHANGES_FAILED = 'flow/SAVE_CHANGES_FAILED'
export const ADD_NODE_TO_ROOT = 'flow/ADD_NODE_TO_ROOT'
export const ADD_NODE_TO_ROOT_FAILED = 'flow/ADD_NODE_TO_ROOT_FAILED'
export const ADD_FLOW = 'flow/ADD_FLOW'

const initialState = {
	flow: {
		nodes: {},
		links: []
	},
	changes: {}
}

const newFlowType = "flow"

const calcCenterOffset = flow => {
	let avg = reduce(
		flow.nodes,
		(offsetSum, node, key) => {
			offsetSum.x += node.x
			offsetSum.y += node.y
			return offsetSum
		},
		{x: 0, y: 0}
	)

	avg.x = avg.x/Object.keys(flow.nodes).length
	avg.y = avg.y/Object.keys(flow.nodes).length

	const screen = {
		width : window.innerWidth
		|| document.documentElement.clientWidth
		|| document.body.clientWidth,
		height: window.innerHeight
		|| document.documentElement.clientHeight
		|| document.body.clientHeight
	}

	const newOffsetX = screen.width/2 - avg.x - circleDiameter/2,
	newOffsetY = screen.height/2 - avg.y - circleDiameter/2

	return {x: newOffsetX, y: newOffsetY}
}

const generateEmptyNode = (type,x,y,id) => ({
			displayName : 'רכיב חדש',
			name: '',
			// color : "natural",
			type,
			id,
			x,
			y
})

const generateEmptyFlow = (id , name, displayName) => ({
	id, name, displayName, nodes:{}, links:[], offset: {x: 0, y: 0}
})

export const generateId = () => (shortid.generate())

const getChangedXY = (state, {id, payload}) => {
	const flow = {
		...state.flow,
		nodes: {
			...state.flow.nodes,
			[id]: {...state.flow.nodes[id], ...payload}
		}
	}

	return {
		...state,
		flow,
		changes: {
			...state.changes,
			[flow.id]: {...flow}
		}
	}
}

const getChangedOffset = (state, {payload: {x, y}}) => {
	const flow = {
		...state.flow,
		offset: {x, y}
	}

	return {
		...state,
		flow
	}
}


const getAddedBlankNode = (state,{payload: {type,x,y}}) => {
	const id = shortid.generate()
	const flow = {
		...state.flow,
		nodes: {
			...state.flow.nodes,
			[id]: generateEmptyNode(type,x,y,id)
		}
	}
	return {
		...state,
		flow,
		changes: {
			...state.changes,
			[flow.id]: {...flow}
		}
	}
}

const pasteFlowsToChanges = (state,{payload: changes}) => {
	return {
		...state,
		changes: {
			...state.changes,
			...changes
		}
	}
}

function _findCutNodeFlowId(flows, targetNodeId) {
	for (let flowId in flows) {
		if (!flows.hasOwnProperty(flowId)) {
			continue
		}
		for (let nodeId in flows[flowId].nodes) {
			if (nodeId === targetNodeId) {
				return flowId
			}
		}
	}
}

function _removeLinksRelatedToNode(links, nodeId) {
	let linksWithoutNode = []
	for (const link of links) {
		if (link.from !== nodeId && link.to !== nodeId) {
			linksWithoutNode.push(link)
		}
	}
	return linksWithoutNode
}

function _removeLinksFromCutNode(state, cutNodeFlowId, cutNode) {
	let cutNodeLinks = state.changes[cutNodeFlowId].links
	let linksWithoutCutNode =  _removeLinksRelatedToNode(cutNodeLinks, cutNode.nodeId)
	state.changes[cutNodeFlowId].links = linksWithoutCutNode
	if (state.flow.id === cutNodeFlowId) {
		state.flow.links = linksWithoutCutNode
	}
	return state
}

const pasteCutNodeToNewFlow = (state, {payload: {cutNode, pasteXY}}) => {
	let cutNodeFlowId = _findCutNodeFlowId(state.changes, cutNode.nodeId)
	state = _removeLinksFromCutNode(state, cutNodeFlowId, cutNode)
	let cutNodeInfo = state.changes[cutNode.flowId].nodes[cutNode.nodeId]
	delete state.changes[cutNode.flowId].nodes[cutNode.nodeId]

	if (!state.changes[state.flow.id]) {
		state.changes[state.flow.id] = state.flow
	}
	cutNodeInfo = {...cutNodeInfo, ...pasteXY}
	state.changes[state.flow.id].nodes[cutNodeInfo.id] = cutNodeInfo
	return {
		...state,
		changes: {
			...state.changes
		}
	}
}

const putFlowInChanges = (state) => {
	return {
		...state,
		changes: {
			...state.changes,
			[state.flow.id]: {...state.flow}
		}
	}
}

const getAddedCoppiedNode = (state,{payload: node}) => {
	let id
	if("child" in node) {
		id = node.child
	} else {
		id = shortid.generate()
	}
	node["id"] = id

	const flow = {
		...state.flow,
		nodes: {
			...state.flow.nodes,
			[id]: node
		}
	}
	return {
		...state,
		flow,
		changes: {
			...state.changes,
			[flow.id]: {...flow}
		}
	}
}

const getWithoutNode = (state,{id}) => {
	const flow = {
			...state.flow,
			nodes: omit(state.flow.nodes,[id]),
			links: state.flow.links.filter(item => !(item.from === id || item.to === id))
	}
	return {
		...state,
		flow,
		changes: {
			...state.changes,
			[flow.id]: {...flow}
		}
	}
}

const getAddedLink = (state,{payload: newLink}) => {
	const flow = {
		...state.flow,
		links: [...state.flow.links,newLink]
	}

	return {
		...state,
		flow,
		changes: {
			...state.changes,
			[flow.id]: {...flow}
		}
	}
}

const getRemovedLink = (state, {payload: link}) => {
	const flow = {
		...state.flow,
		links: state.flow.links.filter(item => !isEqual(item, link))
	}

	return {
		...state,
		flow,
		changes: {
			...state.changes,
			[flow.id]: {...flow}
		}
	}
}

const getAddedChild = (state, {payload: {id}}) => {
	const node = state.flow.nodes[id]
	const flow = generateEmptyFlow(id ,node.name , node.displayName)
	return {
		...state,
		flow,
		changes: {
			...state.changes,
			[state.flow.id]: {
				...state.flow,
				nodes: {
						...state.flow.nodes,
						[id] : {
							...node,
							child: flow.id
						}
				}
			},
			[flow.id] : {...flow}
		}
	}
}

const getChangedNodeInfo = (state, {payload: {id, nodeData}}) => {
	const flow = {
		...state.flow,
		nodes: {
			...state.flow.nodes,
			[id] : {
				...state.flow.nodes[id],
				...nodeData
			}
		}
	}

	return {
		...state,
		flow,
		changes: {
			...state.changes,
			[flow.id]: {...flow}
		}
	}
}

const getAddedFlow = (state, {payload: {id, name, displayName}}) => {
	const flow = generateEmptyFlow(id ,name, displayName)

	return {
		...state,
		flow,
		changes: {
			...state.changes,
			[id] : {...flow},
			new: {...flow}
		}
	}
}

const getChangedFlow = (state, {payload: flow}) => ({
	...state,
	flow,
	status: 'NORMAL',
})


export default (state = initialState, action) => {
  switch (action.type) {
	case CHANGEXY:
		return getChangedXY(state, action)
	case CHANGE_OFFSET:
		return getChangedOffset(state, action)
	case ADDBLANKNODE:
		return getAddedBlankNode(state, action)
	case ADDCOPPIEDNODE:
		return getAddedCoppiedNode(state, action)
	case PASTE_TO_CHANGES:
		return pasteFlowsToChanges(state, action)
	case PASTE_CUT_NODE:
		return pasteCutNodeToNewFlow(state, action)
	case CUT_FLOW_TO_CHANGES:
		return putFlowInChanges(state)
	case DELETENODE:
		return getWithoutNode(state, action)
	case ADDLINK:
		return getAddedLink(state, action)
	case REMOVELINK:
		return getRemovedLink(state, action)
	case ADD_CHILD:
		return getAddedChild(state, action)
	 case CHANGE_NODE_INFO:
		return getChangedNodeInfo(state, action)
	case ADD_FLOW:
		return getAddedFlow(state, action)
	case LOAD_LOCALLY:
	case GET_FLOW_COMPLETE:
		return getChangedFlow(state, action)
	case GET_FLOW_PENDING:
	case SAVE_CHANGES_PENDING:
		return {...state, status: 'FETCHING'}
	case SAVE_CHANGES_COMPLETED:
		return {...state,status: 'NORMAL'}
	case GET_FLOW_FAILED:
	case SAVE_CHANGES_FAILED:
	case ADD_NODE_TO_ROOT_FAILED:
		return {...state, status: 'FAILED'}
	case CLEAR_CHANGES:
		return {...state,changes:{}}
	default:
	  return state
  }
}

export const changeXY = (id,x,y) => {
  return dispatch => {
	dispatch({
		type: CHANGEXY,
		id : id,
		payload: {x,y}
	})
  }
}

export const changeOffset = (offset) => {
	return dispatch => {
		dispatch({
			type: CHANGE_OFFSET,
			payload: offset
		})
	}
}

export const addBlankNode = (type,x,y) => {
  return dispatch => {
	dispatch({
		type: ADDBLANKNODE,
		payload: {type,x,y}
	})
  }
}

export const addCoppiedNode = (node) => {
	return dispatch => {
		dispatch({
			type: ADDCOPPIEDNODE,
			payload: node
		})
	}
}

export const pasteToChanges = (changes) => {
	return dispatch => {
		dispatch({
			type: PASTE_TO_CHANGES,
			payload: changes
		})
	}
}

export const pasteCutNode = (cutNode, pasteXY) => {
	return dispatch => {
		dispatch({
			type: PASTE_CUT_NODE,
			payload: {cutNode, pasteXY}
		})
	}
}

export const cutFlowToChanges = () => {
	return dispatch => {
		dispatch({
			type: CUT_FLOW_TO_CHANGES
		})
	}
}


export const deleteNode = (id) => {
  return dispatch => {
	dispatch({
		type: DELETENODE,
		id
	})
  }
}

export const addLink = (from,to) => {
  return dispatch => {
	dispatch({
		type: ADDLINK,
		payload: {from,to}
	})
  }
}

export const removeLink = (from,to) => {
  return dispatch => {
	dispatch({
		type: REMOVELINK,
		payload : {from,to}
	})
  }
}

export const addChild = (id) => {
  return dispatch => {
	dispatch({
		type: ADD_CHILD,
		payload: {id}
	})
  }
}

export const clearChanges = () => {
  return dispatch => {
	dispatch({
		type: CLEAR_CHANGES,
	})
  }
}

// export const fetchFlow = (id) =>{

// 	return dispatch => {

// 		dispatch({
//             type: GET_FLOW_PENDING,
//         })

// 		fetch(`${serverSideUrl}/flows/get/${id}`, fetchOptions())
// 			.then(res => {
// 				return res.json()
// 			}).then(flow => {

// 				const offset = calcCenterOffset(flow)

// 				dispatch({
// 					type: GET_FLOW_COMPLETE,
// 					payload: {...flow, offset}
// 				})
// 			}, response => {
// 				popupErrorAlert('הייתה שגיאה בניסיון לקבל את המסלול', 5)(dispatch)
// 				dispatch({
// 					type: GET_FLOW_FAILED,
// 					payload: {response}
// 				})
// 			})
// 	}
// }


export const fetchFlow = (id) =>{

 console.log("fetchFlow")
 return dispatch => {

  dispatch({
            type: GET_FLOW_PENDING,
        })

  // fetch(${serverSideUrl}/flows/get/${id}, fetchOptions())
  //  .then(res => {
  //   return res.json()
  //  }).then(flow => {


  //   dispatch({
  //    type: GET_FLOW_COMPLETE,
  //    payload: {...flow, offset}
  //   })
  //  }, response => {
  //   popupErrorAlert('הייתה שגיאה בניסיון לקבל את המסלול', 5)(dispatch)
  //   dispatch({
  //    type: GET_FLOW_FAILED,
  //    payload: {response}
  //   })
  //  })
  const flow = {
   name: "test",
   id: "GPvp9-gIf",
   displayName: "test",
   nodes:{
    aaa:{ 
     name:"test",
     id:"aaa",
     displayName:"sdsd",
     x:10,
     y: 20,
     description: "Sdsdssdssdsdsdsd"
    }
   },
   links: []
  }
  const offset = calcCenterOffset(flow)


  dispatch({
   type: GET_FLOW_COMPLETE,
   payload: {...flow, offset}
  })
  
 }
}

export const pasteCopyOfNewNode = (nodeToPaste, flows, { x, y }) =>{
	return dispatch => {
		fetch(`${serverSideUrl}/flows/nodeCopy`, fetchOptions('POST', {node: nodeToPaste, flows}))
			.then(res => {
				return res.json()
			}).then(pasteObject => {
			let nodeToPaste = {...pasteObject.nodeCopy, x, y}
			dispatch(addCoppiedNode(nodeToPaste))
			dispatch(pasteToChanges(pasteObject.newFlows))
		}).catch(err => {
			popupErrorAlert("הדבקה נכשלה", 5)(dispatch)
		})
	}
}

export const loadFlowLocally = flow => {
	return dispatch => {
		dispatch({
			type: LOAD_LOCALLY,
			payload: flow
		})
	}
}

export const changeNodeInfo = (id,nodeData) => {
  return dispatch => {
		dispatch({
			type: CHANGE_NODE_INFO,
			payload: {id,nodeData}
		})
	}
}

export const saveChanges = changes => {
	return dispatch => {
		dispatch({
            type: SAVE_CHANGES_PENDING,
        })
		fetch(`${serverSideUrl}/flows/save/`,fetchOptions('POST', changes))
			.then(res => {
				return res.json()
			}).then(
				res => {
					dispatch({
						type: SAVE_CHANGES_COMPLETED,
						payload: {res}
					})
				}, res => {
					popupErrorAlert('הייתה שגיאה בניסיון לקבל את המסלול', 5)(dispatch)
					dispatch({
						type: SAVE_CHANGES_FAILED,
						payload: {res}
					})
			})
	}
}

export const addNodeToRoot = (newFlow, circleSize) => {
	return dispatch => {
		fetch(`${serverSideUrl}/flows/get/${rootId}`, fetchOptions())
			.then(res => {
				return res.json()
			}).then(flow => {
				const X_DISTANCE_BETWEEN_CIRCLES = 30
				const Y_DISTANCE_BETWEEN_CIRCLES = 20
				const X_INITIAL = 200
				const Y_INITIAL = 150
				const MAX_IN_ROW = 12
				const NUM_OF_NODES = Object.keys(flow.nodes).length
				const x = X_INITIAL + (circleSize + X_DISTANCE_BETWEEN_CIRCLES)*(NUM_OF_NODES%MAX_IN_ROW + 1)
				let y = Y_INITIAL + (circleSize + X_DISTANCE_BETWEEN_CIRCLES)

				if (NUM_OF_NODES % MAX_IN_ROW === 0 && NUM_OF_NODES !== 0){
					y = Y_INITIAL + (circleSize + Y_DISTANCE_BETWEEN_CIRCLES)*(NUM_OF_NODES/MAX_IN_ROW + 1.5)
				}
				let newNode = generateEmptyNode(newFlowType, x, y, newFlow.id)
				newNode = {...newNode, name: newFlow.name, displayName: newFlow.displayName, child: newFlow.id}
				fetch(`${serverSideUrl}/addNodeToRoot/`,fetchOptions('POST', newNode));
			}, response => {
				dispatch({
					type: ADD_NODE_TO_ROOT_FAILED,
					payload: {response}
				})
			})
	}
}

export const addNewFlow = (id, name, displayName) => {
  return dispatch => {
	dispatch({
		type: ADD_FLOW,
		payload: {
			id,
			name,
			displayName
		}
	})
  }
}