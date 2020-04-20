import React from 'react'
import './ConfirmModal.scss'


class ConfirmModal extends React.Component {
	render(){
	    return this.props.actionOnConfirm && (
            <div className="confirm-modal">
                <div className="option" onClick={() => {this.props.close()}}>
                    <h3>{this.props.declineText}</h3>
                </div>
                <div className="option" onClick={() => {
                    this.props.close()
                    this.props.actionOnConfirm()
                }}>
                    <h3>{this.props.acceptText}</h3>
                </div>
            </div>
	    );
	}
}

export default ConfirmModal;