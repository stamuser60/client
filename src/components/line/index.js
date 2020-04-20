import React from 'react'
import {isEqual} from 'lodash'
import './Line.scss'

const polyLength = 10
const angle = .4

class Line extends React.Component {

	shouldComponentUpdate(nextProps){
		return !isEqual(this.props,nextProps)
	}

	render () {
		let {fromX,fromY,toX,toY,radius} = this.props

		const distance = ((toY - fromY)**2 + (toX - fromX)**2)**0.5
		const directionX = (fromX - toX)/distance || 0
		const directionY =  (fromY - toY)/distance || 0
		// const relativePart = radius/distance
		let pointerX = toX + radius * directionX
		let pointerY = toY + radius * directionY

		// move x,y to the parameter of the circle
		fromX = fromX + radius * -directionX
		fromY = fromY + radius * -directionY


		let poly1x = pointerX + polyLength * (directionX + directionY * angle)
		let poly1y = pointerY + polyLength * (directionY - directionX * angle)
		
		let poly2x = pointerX + polyLength * (directionX - directionY * angle)
		let poly2y = pointerY + polyLength * (directionY + directionX * angle)


		let offsetX = this.props.offsetX ||  0
		let offsetY = this.props.offsetY ||  0
		fromX += offsetX
		fromY += offsetY
		pointerX += offsetX
		pointerY += offsetY
		poly1x += offsetX
		poly1y += offsetY
		poly2x += offsetX
		poly2y += offsetY
		// toX += offsetX
		// toY += offsetY

		return (
			<g>
				<line onContextMenu = {this.props.onContextMenu} className="line" x1={pointerX} y1={pointerY} x2={poly1x} y2={poly1y}/>
				<line onContextMenu = {this.props.onContextMenu} className="line" x1={pointerX} y1={pointerY} x2={poly2x} y2={poly2y}/>
				<line onContextMenu = {this.props.onContextMenu} className="line" x1={fromX} y1={fromY} x2={pointerX} y2={pointerY}/>
			</g>
		)
	}


}

export default Line
