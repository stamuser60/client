import { Component, cloneElement } from 'react'
import { findDOMNode } from 'react-dom'
import interact from 'interactjs'

const getClickHandler = (onClick,onDblClick,delay) => {
	let timeoutID = null
	delay = delay || 250
	return function (event) {
		event.stopPropagation()
		if (!timeoutID) {
			timeoutID = setTimeout( function (){
				onClick(event)
				timeoutID = null
			}, delay)
		} else {
			timeoutID = clearTimeout(timeoutID)
			onDblClick(event)
		}
	}
}

class Interactable extends Component{

	componentDidMount() {
		this.interact = interact(findDOMNode(this.node)).styleCursor(false)
		this.setInteractions()
	}

	// componentWillReceiveProps() {
	// 	this.interact = interact(findDOMNode(this.node))
	// 	this.setInteractions()
	// }


	setInteractions() {
		if(this.props.draggable) this.interact.draggable(this.props.draggableOptions)
		if(this.props.resizable) this.interact.resizable(this.props.resizeableOptions)
		if(this.props.tappable && !this.props.doubleTappable ) this.interact.on('tap',this.props.singleTap)
		if(this.props.tappable && this.props.doubleTappable) this.interact.on('tap',getClickHandler(this.props.singleTap,this.props.doubleTap))
			// currently doesnt support only double click

	}

	render (){
		return cloneElement(this.props.children, {
				ref: node => this.node = node,
				draggable: false
		})
	}
}

export default Interactable