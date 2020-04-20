import React from 'react'
import './expandingTextarea.scss'

class ExpandingTextarea extends React.Component {

	componentDidMount () {
		this._adjustTextarea({})
	}

	_handleChange = (e) => {
		const { onChange } = this.props
		if (onChange) onChange(e)
		this._adjustTextarea(e)
	}

	_adjustTextarea = ({ target = this.element }) => {
		target.style.height = 0
		target.style.height = `${target.scrollHeight}px`
	}

	componentDidUpdate(prevProps) {
		if( this.props.value !== prevProps.value){
			this._adjustTextarea({})
		}
	}

	render () {
		const { onChange, ...rest } = this.props
		return <div className="expanding-textarea">
				<textarea
					{ ...rest }
					onFocus={this.props.setFocus}
					onBlur={this.props.unsetFocus}
					ref={ref => {this.element = ref}}
					onChange={this._handleChange}
				/>
			</div>
	}

}

export default ExpandingTextarea
