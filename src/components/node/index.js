import React from 'react'
import Interactive from '../interactive'
import nodeTypes from '../../config/nodeTypes'
import './Node.scss'
import NotificationWithShadow from './components/notification-with-shadow'
import drilldown from './assets/drilldown.png'
import AnimatedMount from '../animated-mount'


// const NodeIcon = AnimatedMount({mountClass:'icon-mount', unmountClass:'icon-unmount',defaultClass: 'icon-box-default'})(
// 	props => <img className="icon" src={props.src} alt={props.alt}/>
// )

class Node extends React.Component{

	constructor(props) {
		super(props)
		
		this.draggableOptions = {
			inertia: true,
			restrict: {
				// restriction:"parent",
				endOnly:true,
				elementRect:{top:0,left:0,bottom:1,right:1}
			},
			onmove: event => {
				if (this.props.draggingEnabled){
					let {dx, dy} = event
					if (this.props.zoom){
						dx /= this.props.zoom
						dy /= this.props.zoom
					}
					const x = this.props.x + dx
					const y = this.props.y + dy
					this.props.update(this.props.id, x, y)
				}
			}
		}

		this.state = {
			displayParentness: false,
			mouseOver: false
		}
	}

	shouldAppearAsParent = () => {
		return this.props.isParent && (this.state.displayParentness || this.props.displayParentness)
	}

	displayParentness = () => {
		this.setState({
			displayParentness: true
		})
	}

	hideParentness = () => {
		this.setState({
			displayParentness: false
		})	
	}

	handleMouseEnter = () => {
		this.setState({mouseOver: true})
		this.displayParentness()
	}

	handleMouseLeave = () => {
		this.setState({mouseOver: false})
		this.hideParentness()
	}

	render () {
		return	(
	
			<Interactive draggable draggableOptions={this.draggableOptions}
			 tappable
			 doubleTappable
			 singleTap = {this.props.singleTap}
			 doubleTap = {this.props.doubleTap}
			 >
			 <div 
			 className="node-container" 
			 style={{transform:`translate(${this.props.x}px,${this.props.y}px)`}}
			 onMouseEnter = {this.handleMouseEnter}
			 onMouseLeave = {this.handleMouseLeave}
			 >
				<div className={`Node ${this.props.grayed ? 'grayed' : ''} ${this.props.color} ${this.props.selected ? 'selected' : ''} ${this.props.isCut ? 'cut' : ''}`}
				onContextMenu = {this.props.onContextMenu}
				// data-x={this.props.x} 
				// data-y={this.props.y}
				// style={{transform:`translate(${this.props.x}px,${this.props.y}px)`}}>
				>
				<NotificationWithShadow counter={this.props.counter} color={this.props.color}/>
					<div className = "content">
						{/*<i className={"fa fa-" + this.props.type}></i>*/}
						<div className={`icon-container ${this.props.regex ? 'regex' : ''}`}>
								<img className={`icon ${this.shouldAppearAsParent() ? 'show-drill' : 'hide-drill'}`} src={drilldown} alt='drill img'/>
								<img className={`icon ${this.shouldAppearAsParent() ? 'hide-type' : 'show-type'}`} src={ nodeTypes[this.props.type].asset } alt='node img'/>
							<span className="regex">regex</span>
						</div>
						<div className="name">{this.props.children}</div>
					</div>
				</div>
			</div>
			</Interactive>
			
		)
	}	
} 

export default Node
// export default AnimatedMount({mountClass:'node-mount', unmountClass:'node-unmount',defaultClass: 'loader-box-initial'})(Node)