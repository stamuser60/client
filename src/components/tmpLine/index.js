import React from 'react'
import Line from '../line'

class TmpLine extends React.Component {

	constructor(props) {
		super(props)
		let {fromX,fromY} = this.props
		this.state = {
			fromX,
			fromY,
			toX:fromX,
			toY:fromY
		}
	}

	_handleMove = event => {

		let {pageX: toX, pageY: toY} = event

		const { zoom } = this.props

		if (zoom) {
			toX = (toX - zoom.x) / zoom.value
			toY = (toY - zoom.y) / zoom.value
		}

		this.setState({toX,toY})

		// const {pageX, pageY} = event
		// let {toX, toY} = this.state

		// let dx = pageX - toX,
		// dy = pageY - toY

		// if (this.props.zoom){
		// 	dx *= this.props.zoom
		// 	dy *= this.props.zoom
		// }

		// toX += dx
		// toY += dy



		if (toX > 0 && toY > 0) this.setState({toX,toY})

		// const {movementX, movementY} = event
		// let {toX,toY} = this.state
		// toX += movementX
		// toY += movementY
		// this.setState({
		// 	toX,toY
		// })

	}

	_handleClick = event => {
		if (this.props.visible){
			this.props.close()
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible !== this.props.visible){
			if (nextProps.visible){
				window.addEventListener('mousemove',this._handleMove)
				window.addEventListener('mousedown',this._handleClick)
				this.setState({
					toX: nextProps.fromX + nextProps.offsetX,
					toY: nextProps.fromY + nextProps.offsetY
				// 	toX: nextProps.fromX + nextProps.offsetX,
				// 	toY: nextProps.fromY + nextProps.offsetY
				})	
			} else if (!nextProps.visible) {
				window.removeEventListener('mousemove',this._handleMove)
				window.removeEventListener('mousedown',this._handleClick)	
				// if( nextProps.offsetX !== this.props.offsetX || nextProps.offsetY !== this.props.offsetY) {
				// 	this.setState({ toX : (nextProps.fromX + nextProps.offsetX),toY: (nextProps.fromY + nextProps.offsetY)},()=>{console.log('new state',this.state)})		
				// }
			}
		}
	}

	render () {

		const {toX, toY} = this.state
		const {fromX, fromY, offsetX, offsetY, buffer} = this.props

		return (this.props.visible || null) && 
			<Line radius = {this.props.radius} 
			fromX={fromX} 
			fromY={fromY} 
			toX={toX - offsetX} 
			toY={toY - offsetY}
			offsetX = {buffer.x}
			offsetY = {buffer.y}
			/>
	}
}

export default TmpLine