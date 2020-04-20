import Modal from 'react-modal'
import React from 'react'
import ModalContent from './components/modal-content'
import './modalWindow.scss'

class ModalWindow extends React.Component {

	render (){
		
		const animationDuration = 500,
		props = this.props
		return (
			<Modal closeTimeoutMS={animationDuration} 
					overlayClassName='close-overlay' 
					style={{overlay:{'--duration':`${animationDuration}ms`, '--width': `${props.width}px`}}} 
					ariaHideApp={false} 
					isOpen={props.mode} 
					onRequestClose={props.close} 
					className="modal" >
				{/*<div className="blueheader"/>*/}
				<div className="header">
					<div className="title">{props.title}</div>
				</div>
				<ModalContent>
					{props.children}
				</ModalContent>
				<div className="footer"/>
			</Modal>
		)
	}
}

export default ModalWindow