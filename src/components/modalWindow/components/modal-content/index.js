import React from 'react'
import './modal-content.scss'

class ModalContent extends React.Component {

	state = {
		height: 0
	}

	updateContentHeight = () => {
		this.setState({
			height: this.content.scrollHeight
		})
	}

	componentWillReceiveProps(nextProps) {
		if( this.props.children !== nextProps.children){
			this.updateContentHeight()
		}
	}

	componentDidMount() {
		this.updateContentHeight()
	}

	render (){

		return (
			<div className="modal-content" 
			ref={ dom => {this.content = dom; window.contentDom = dom}}
			style = {{'--content-height':`${this.state.height}px`}}
			>
				{this.props.children}
			</div>
		)
	}
}

export default ModalContent