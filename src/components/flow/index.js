import React from 'react'
import Node from '../node'
import Line from '../line'
import TmpLine from '../tmpLine'
import Interactive from '../interactive'
import './Flow.scss'
import {circleDiameter} from '../../config/general.config.js'

class Flow extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			showParents: false,
			zoom: {
				value: 1,
				x: 0,
				y: 0
			}
		}

		this.draggableOptions = {
			inertia: true,
			onmove: event => {
				let {dx, dy} = event
				if (this.state.zoom.value){
					dx /= this.state.zoom.value
					dy /= this.state.zoom.value
				}
				let x = (this.props.offset.x || 0 ) + dx
				let y = (this.props.offset.y || 0 ) + dy

				this.props.changeOffset({x,y})
			}
		}
	}

	static defaultProps = {
		offset: {x: 0,y: 0}
	}
	
	onClick = (event) => {
		this.props.onClick(event)
	}

	showParents = () => {
		this.setState({
			showParents: true
		})
	}

	hideParents = () => {
		this.setState({
			showParents: false
		})
	}

	handleKeyDown = event => {
	  let charCode = String.fromCharCode(event.which).toLowerCase()
		if(event.key === 'Control'){
			this.showParents()
		}
    if (event.ctrlKey && charCode === 'c') {
      this.props.ctrlC()
    }
    if (event.ctrlKey && charCode === 'v') {
      this.props.ctrlV()
    }
		if (event.ctrlKey && charCode === 'x') {
			this.props.ctrlX()
		}
	}
	handleKeyUp = event => {
		if(event.key === 'Control'){
			this.hideParents()
		}
	}

	// to be reviewd, make this a pure function (and move it somewhere maybe)
	handleWheel = event => {
		if (event.ctrlKey){
			event.preventDefault()
			let zoomDelta = (event.deltaY < 0) ? 5/4 : 3/4			
			let {x: oldX, y: oldY, value: oz} = this.state.zoom

			
			let nz = oz * zoomDelta
			if (nz > 6) {
				nz = 6
			} else if (nz < .25){
				nz = .2
			}
			let mx = event.clientX,
			    my = event.clientY,
			    /// calculate click at current zoom
			    ix = (mx - oldX) / oz,
			    iy = (my - oldY) / oz,
			    /// calculate click at new zoom
			    nx = ix * nz,
			    ny = iy * nz,
			    /// move to the difference
			    /// make sure we take mouse pointer offset into account!
			    cx = (ix + (mx - ix) - nx),
			    cy = (iy + (my - iy) - ny)

			this.setState({
				zoom: {
					value: nz,
					x: cx,
					y: cy
				}
			})
		}
	}

	componentDidMount () {
		window.addEventListener('wheel',this.handleWheel)
		window.addEventListener('keydown',this.handleKeyDown)
		window.addEventListener('keyup',this.handleKeyUp)
	}

	componentWillUnmount () {
		window.removeEventListener('wheel',this.handleWheel)
		window.removeEventListener('keydown',this.handleKeyDown)
		window.removeEventListener('keyup',this.handleKeyUp)
	}

	getNodes = (nodes, alerts, changeXY, draggingEnabled, selectedNode) => Object.keys(nodes).map(id => {
		const node = nodes[id],
		nodeAlerts = alerts.nodes[node.id],
		color = (nodeAlerts || {color:'natural'}).color,
		counter = nodeAlerts ? nodeAlerts.count : 0
		return <Node key = {id}
			zoom = {this.state.zoom.value}
			update={changeXY}
			id={id}
			counter={counter}
			type = {node.type}
			regex = {node.regex}
			draggingEnabled = {draggingEnabled}
			selected = {selectedNode === id}
			grayed = {selectedNode !== id && selectedNode !== ''}
			isParent = {typeof node.child !== "undefined"}
			displayParentness = {this.state.showParents}
			color={color} 
			x = {node.x}
			y = {node.y}
			onContextMenu = {(e) => {
				this.props.onNodeContextMenu(e, id)
			}}
			singleTap = {(e) => {
				this.props.onNodeTap(e, id)
			}}
			doubleTap = {(e) => {
				this.props.onNodeDoubleTap(e, node)
			}}
			isCut={this.props.cutNodes.some(node=> node.nodeId == id)}			
			>{node.displayName}
			
		</Node>
	})

	getLinks = (links, nodes, linesBuffer) => links.map((link, index) => {
		// console.log(link)
		const fromNode = nodes[link.from]
		const toNode = nodes[link.to]
		return <Line key={`${link.from}${link.to}`} 
			radius = {circleDiameter/2}
			fromX={fromNode.x + circleDiameter/2} 
			fromY={fromNode.y + circleDiameter/2} 
			toX={toNode.x + circleDiameter/2} 
			toY={toNode.y + circleDiameter/2}
			offsetX = {linesBuffer.x}
			offsetY = {linesBuffer.y}
			onContextMenu = {(e) => {
				this.props.onLinkContextMenu(e,link)
			}}
		/>
	})
	// checkIfCritical = alerts => {
	// 	console.log("alerts",alerts)
	// 	if(alerts) {
	// 	var thereIsCritical = [];
	// 	Object.keys(alerts.nodes).map((node) => {
	// 		if(node.alerts) 
	// 		{
	// 			return node.alerts.map((alert) => {
	// 				if(alert.severity == "critical")
	// 					thereIsCritical.push(alert)
	// 			})
	// 		}

	// 	})
	// 	}
	// 	if(thereIsCritical.length > 0 )
	// 	{	
	// 		return <Sound 
	// 			url = {Soundd}
	// 			playStatus = {Sound.status.PLAYING}
	// 			autoLoad = {true}
	// 			autoPlay = {true}				
	// 		/>
	// 	}	
	// }

	render () {
		const {props} = this

		const zoomStyle = {
			position: 'fixed',
			height: '100%',
			width: '100%',
			top: 0,
			left: 0,
			transformOrigin: '0 0 0',
		    transition: 'transform 0.25s',
		    transform: `translate(${this.state.zoom.x}px,${this.state.zoom.y}px) scale(${this.state.zoom.value})`
		}

		const style = {
			position: 'absolute',
			transform: `translate(${this.props.offset.x}px,${this.props.offset.y}px)`,
			height: '100%',
			width: '100%',
		}

		// to be reviewed, limit user drag dont let lines get cut
		const linesBuffer = {
			x: 10000,
			y: 10000
		}
		
		return (
			<div 
			className="Flow"
			id="Flow"
			onContextMenu={(e)=>{
				this.props.onBackgroundContextMenu(e)
			}}
			onClick={this.props.setFocus}
			>
				{/*<div className="coordinates">x : {this.state.x.toFixed(1)}; y : {this.state.y.toFixed(1)}</div>*/}

				
				<Interactive draggable draggableOptions={this.draggableOptions}
				 tappable
				 singleTap = {this.onClick}
				 >
					<div style={zoomStyle}>
						<div style={style}>
							{this.getNodes(props.nodes, props.alerts, props.changeXY, props.nodesDraggingEnabled, props.selectedNode)}
							<svg 
							className = "lines"
							style = {
								{
									left: `${-1 * linesBuffer.x}px`,
									top: `${-1 * linesBuffer.y}px`
								}
							}
							>
								{this.getLinks(props.links, props.nodes, linesBuffer)}
								<TmpLine 
									visible = {this.props.tmpline.visible}
									radius = {0} 
									fromX = {this.props.tmpline.fromX + circleDiameter/2} 
									fromY = {this.props.tmpline.fromY + circleDiameter/2}
									close = {this.props.closeTmpline}
									offsetX = {this.props.offset.x}
									offsetY = {this.props.offset.y}
									buffer = {linesBuffer}
									zoom = {this.state.zoom}
								/>
								{/*props.children.filter(c => c.type === Line || c.type === TmpLine)*/}	
							</svg>
						</div>
					</div>
				</Interactive>
			</div>

			
		)
	}


}

export default Flow