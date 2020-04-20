import React from 'react'
import {debounce} from 'lodash'
import './time-bar.scss'

const displayDate = momentObj => momentObj.calendar(null,{
					lastWeek : 'dddd [ב-]LT',
					sameDay: '[היום ב-]LT',
					lastDay: '[אתמול ב-]LT',
					sameElse: 'L LT'
				})

const calcThumbOffset = (input, thumbWidth) => {
	const width = input.offsetWidth,
	point = (input.value - input.getAttribute("min")) / (input.getAttribute("max") - input.getAttribute("min")),
	left = width * point,
	right = width * (1 - point),
	leftOffset = (point * thumbWidth),
	rightOffset = ((1 - point) * thumbWidth)

	return {
		point,
		left: (left - leftOffset), 
		right: (right - rightOffset)
	}
}

const calcValueDate = (value,minFilter) => minFilter.clone().subtract(value, 'minutes')

const calcDateValue = (date, minDate) => Math.round((minDate - date)/1000/60)

const dragFinishDelay = 50

class TimeBar extends React.Component {
	constructor (props){
		super(props)
		const {from, until} = props.filter

		this.state = {
			thumbSize: {
				width: 0,
				height: 0
			},
			leftThumb: {
				value: calcDateValue(until, props.minFilter),
				left: 0,
				right: 0,
				point: 0
			},
			rightThumb: {
				value: calcDateValue(from, props.minFilter),
				left: 0,
				right: 0,
				point: 0
			}
		}
	}

	finishedDragg = debounce(()=>{ 
		this.props.changeFilter({
			from: this.getValueDate(this.state.rightThumb.value),
			until: this.getValueDate(this.state.leftThumb.value).add('10', 'years') //TODO: .add('10', 'years') is a part of a fix to handle future alerts, need to check it later to see how to really fix it instead of using that plaster.
		})
	},dragFinishDelay)

	onChange = (e) => {

		let {name, value} = e.target
		// if (name === "rightThumb"){
		// 	value = (this.state.leftThumb.value > value) ? this.state.leftThumb.value : value
		// 	// console.log('left:',this.state.leftThumb.value,'right', value)
		// } else {
		// 	value = (value > this.state.rightThumb.value) ? this.state.rightThumb.value : value
		// 	// console.log('left:',value,'right', this.state.rightThumb.value)
		// }
		this.setState({[name]: {...this.state[name], value}},() => {
			this.modifyThumbOffset()
			this.finishedDragg()
			})

		// this.setState({[name]: {...this.state[name], value}},this.finishedDragg)
	}

	modifyThumbOffset = () => {
		this.setState({
			leftThumb: {
				...this.state.leftThumb,
				...calcThumbOffset(this.leftThumbInput,this.state.thumbSize.width)
			},
			rightThumb: {
				...this.state.rightThumb,
				...calcThumbOffset(this.rightThumbInput,this.state.thumbSize.width)
			}
		})
	}

	_updateThumbSize = () => {
		this.setState({thumbSize : {width: this.hiddenThumb.clientWidth, height: this.hiddenThumb.clientHeight }},this.modifyThumbOffset)
	}

	componentDidMount() {
		this._updateThumbSize()
	}

	getValueDate = value => {
		return calcValueDate(value,this.props.minFilter)
	}

	getSelectedArea = () => {
		const {left: leftThumbLeft} = this.state.leftThumb,
		{right: rightThumbLeft} = this.state.rightThumb,
		{width} = this.state.thumbSize
		// console.log("left",leftPoint,{
		// 	left: leftThumbLeft + width * leftPoint,
		// 	right: rightThumbLeft + width * (1 - rightPoint)
		// })
		return {
			left: leftThumbLeft + width/2,
			right: rightThumbLeft + width/2
		}
	}

	render () {
		const {
				left: leftThumbLeft,
				right: leftThumbRight,
				value: leftThumbValue
		} = this.state.leftThumb
		const leftDate = this.getValueDate(leftThumbValue)

		const {
				left: rightThumbLeft,
				right: rightThumbRight,
				value: rightThumbValue
		} = this.state.rightThumb
		const rightDate = this.getValueDate(rightThumbValue)

		const {
			left, right
		} = this.getSelectedArea()

		const leftThumbPos = {left: `${leftThumbLeft}px` ,right: `${leftThumbRight}px`}
		const rightThumbPos = {left: `${rightThumbLeft}px` ,right: `${rightThumbRight}px`}
		const selectedAreaStyle = {left: `${left}px`, right: `${right}px`}


		const max = `${Math.round((this.props.minFilter - this.props.maxFilter)/1000/60)}`

		return <div 
		className={`time-bar ${(this.props.hide ? 'hide' : '')}`}
		onMouseEnter = {this._updateThumbSize}
		onMouseLeave = {this._updateThumbSize}
		>

			<div 
			className="my-thumb" 
			style={leftThumbPos}
			>
			</div>
			<div 
			className="my-thumb" 
			style={rightThumbPos}
			>
			</div>
			<div
			ref = { dom => {this.hiddenThumb = dom}}
			className="my-thumb hidden"
			/>
			<input
			ref = { dom => {this.leftThumbInput = dom} }
			type="range"
			min = "0"
			max = {max}
			step="1"
			onChange={this.onChange}
			value = {this.state.leftThumb.value}
			name = "leftThumb"
			/>
			<div
			className="selected-area"
			style = {selectedAreaStyle}
			/>
			<input
			ref = { dom => {this.rightThumbInput = dom} }
			type="range"
			min = "0"
			max = {max}
			step="1"
			onChange={this.onChange}
			value = {this.state.rightThumb.value}
			name = "rightThumb"
			/>
			<div className="output ruler-background">
				<div className="text">
					{ `מ${displayDate(rightDate)} עד ${displayDate(leftDate)}` }
				</div>
			</div>
		</div>
	}
}

export default TimeBar
