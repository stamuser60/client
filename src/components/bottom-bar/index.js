import React from 'react';
import './BottomBar.scss';
import ConfirmModal from '../confirmModal'
import ModalWindow from '../modalWindow'
import {modalWidth} from '../../config/general.config.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { switchModeToNormal, switchModeToEdit } from '../../modules/app'
import { MODES } from '../../helpers/general.helper';

const transitionDuration = .5;

const getModeClass = (mode, nextMode) => {
	if (mode==='NORMAL' && nextMode ==='EDIT') return 'normal-to-edit'
	if (mode==='EDIT' && nextMode ==='NORMAL') return 'edit-to-normal'
	if (mode==='NORMAL' && nextMode ==='OPEN') return 'normal-to-open'
	if (mode==='OPEN' && nextMode ==='EDIT') return 'open-to-edit'
	if (mode==='OPEN' && nextMode ==='NORMAL') return 'open-to-normal'
	return ''
}

const saveQuestion = 'האם ברצונך לאשר את שינויי המסלול?'
const saveAcceptText = 'שמור'
const saveDeclineText = 'אל תשמור'
const cancelQuestion = 'האם ברצונך לבטל את שינויי המסלול?'
const cancelAcceptText = 'בטל שינויים'
const cancelDeclineText = 'הישאר! אל תבטל'

const mapStateToProps = state => ({
	screenMode: state.app.screenMode
})

const mapDispatchToProps = dispatch => bindActionCreators({
	switchModeToNormal,
	switchModeToEdit
}, dispatch)


class BottomBar extends React.Component {

	// const leftButtonIcon = !props.edit ? 'search' : 'headphones'
	// const rightButtonIcon = !props.edit ? 'plus' : 'envelope'

	constructor(props) {
		super(props)
		this.state = {
			modeClass: '',
			height: '',
			showContent: false,
			modal: {
                open: false,
                title: "",
				modalWidth:0
			},
			countNodes: 0
		}
	}

	componentDidMount =  () => {
		if(this.props.screenMode === MODES.EDIT) {
			this.setState({modeClass: getModeClass(MODES.NORMAL, MODES.EDIT)})
		}
		
		this.setState({height: this.div.scrollHeight})
	}
	
	// }
	// FROM OPEN TO EDIT   X
	// FROM OPEN TO NORMAL X
	// FROM NORAML OPEN    X
	// FROM NORMAL TO EDIT X
	// FROM EDIT TO NORMAL X

	// to be reviewed (willRecieveProps will be depricated in react 17)
	componentWillReceiveProps = (nextProps) => {
		const {mode} = this.props,
			nextMode = nextProps.mode
		if ( mode !== nextMode ){
				this.setState({modeClass: getModeClass(mode, nextMode)})
			if (mode === MODES.NORMAL && nextMode === MODES.OPEN) {
				this.handleHideWhenOpen()
			}
			else if (mode === MODES.OPEN && nextMode === MODES.NORMAL){
				this.handleHideWhenClose()
			}
		}
	}

	handleHideWhenOpen = () => {
		setTimeout(()=> {
			this.setState({showContent: true})
		},transitionDuration * 2.5 * 1000)
	}

	handleHideWhenClose = () => {
		this.setState({showContent: false})
	}
	closeModal = () => {
		this.setState((prevState) => ({
			modal: {
				...prevState.modal,
				open: false
            },
            clicked: ""
		}))
    }
	openConfirmModal = (actionOnConfirm, questionText, acceptText, declineText) => {
		this.setState({modal: {
			open: true,
			title: questionText,
			component: <ConfirmModal actionOnConfirm={actionOnConfirm} close={this.closeModal} acceptText={acceptText} declineText={declineText}/>,
			modalWidth:modalWidth
			}
		})
	}
    render () {
    	return (
			<div 
			ref={ div => {this.div = div} }
			className={`bottom-bar ${this.state.modeClass} ${this.props.mode === 'PRESENTATION' ? "disapearBar" : ""}  ${this.state.showContent ? '' : 'hide'}`}
			style={{
				'--open-height':`${this.state.height}px`,
				'--transitionDuration' : transitionDuration + 's'
			}}
			//onTransitionEnd = {this.onTransitionEnd}>
			>
				<div className="middle" 
				onClick={(this.props.mode === 'OPEN') ? this.props.close : this.props.open}>
						<div className={`arrow ${this.props.mode==='OPEN' ? 'down':''}`}/>
						<div className="message">{this.props.title || "בוקר טוב"}</div>
				</div>
				<div className="btn-side pool-right" 
				onClick={
					this.props.mode === 'EDIT' ? 
						(
							Object.keys(this.props.changes).length ?
							() => this.openConfirmModal(this.props.save, saveQuestion, saveAcceptText, saveDeclineText) :
							this.props.cancel
						) :
					this.props.edit
				}>
					<i className="right"></i>
				</div>
				<div className="btn-side pool-left"
				onClick={

					this.props.mode === 'EDIT' ? 
						(
							Object.keys(this.props.changes).length ?
							() => this.openConfirmModal(this.props.cancel, cancelQuestion, cancelAcceptText, cancelDeclineText) :
							this.props.cancel
						) :
					this.props.search
				}>
					<i className={`left ${this.state.modeClass}`}></i>
				</div>
				<div className="content">
					<div className="hide-wrapper">
						{this.props.children}
					</div>
				</div>
				<ModalWindow mode={this.state.modal.open}
					title={this.state.modal.title}
				 	close={this.closeModal}
				 	width={this.state.modal.modalWidth}>
					{this.state.modal.component}
				</ModalWindow>
			</div>
	    )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(BottomBar);