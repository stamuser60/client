import React from 'react'
import StarButton from '../../components/starButton/'
import './Alert.scss'
						
						
const iconSeverityDict =	{
								natural : "fa fa-question-circle natural",
								normal: "fa fa-check-circle normal",
								warning : "fa fa-chevron-circle-up warning",
								minor : "fa fa-exclamation-circle minor",
								major : "fa fa-exclamation-triangle major",
								critical : "fa fa-times-circle critical"
							};

const getOffsetTop = (elem) => {
	let box = elem.getBoundingClientRect()
	let body = document.body
	let docEl = document.documentElement
	let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
	let clientTop = docEl.clientTop || body.clientTop || 0

	let top = box.top + scrollTop - clientTop

	return Math.round(top)
}



// const getStarMode = (vip,pending) => {
// 	if (pending) return 'loading'
// 	if (vip) return 'full'
// 	return 'empty'
// }

class Alert extends React.Component{

	state = {
		pending: false
	}

	// setPending = pending => {
	// 	this.setState({pending})
	// }

	onClick = () => {
		this.props.onClick(getOffsetTop(this.alert))
	}

	finishVipSuccess = () => {
		this.props.updateAlerts()
		// this.setPending(false)
		// console.log('success')
	}

	finishVipFailed = () => {
		// this.setPending(false)
		// console.log('failed')

	}

	// static myAddVip = vipStack(() => {this.props.addVip(this.props.alert)}, 1000, this.finishVipSuccess)
	// static myRemoveVip = vipStack(() => {this.props.removeVip(this.props.alert)}, 1000, this.finishVipSuccess)

	addVip = () => {
		// const alert = {...this.props.alert,pending: true}
		// this.props.changeAlert(this.props.nodeId, alert)
		this.setPending(true)
		// post to server
		// for the animation
		// Alert.myAddVip()		
		// setTimeout(() => {} ,0)
	}

	removeVip = () => {
		// const alert = {...this.props.alert,pending: true}
		// this.props.changeAlert(this.props.nodeId, alert)
		this.setPending(true)
		// post to server
		// this.props.removeVip(this.props.alert,this.props.updateAlerts)
		// this.props.removeVip(this.props.alert, this.finishVipSuccess, this.finishVipFailed)
		// Alert.myRemoveVip()
		// setTimeout(() => {} ,0)
	}

	modifyAlert = () => {
		// this.setPending(true)
		const alert = {...this.props.alert,pending: true}
		this.props.changeAlert(this.props.nodeId, alert)
		this.props.modifyVip(this.props.alert, this.finishVipSuccess, this.finishVipFailed)
	}

	// shouldComponentUpdate (nextProps) {
	// 	return this.props.
	// }

	// componentWillReceiveProps(nextProps) {
	// 	// to be reviewed
	// 	this.setPending(false)
	// }

	render () {
		const props = this.props
		const severity = props.alert.severity.toLowerCase()
		const message = props.alert.title
		// const starMode = getStarMode(props.alert.vip, props.alert.pending)

	    return (
			<div className={'Alert ' + ( this.props.isActive ? 'active' : '')} onClick={this.onClick} ref={ ref => this.alert = ref}>
				<div className="icon">
					<i className={ severity ? iconSeverityDict[severity] : iconSeverityDict["natural"]}></i>
				</div>
				<div className="alert-text">
					<span className="truncate">{message}</span>
				</div>
				<div className="button">
					<StarButton
						mode = {props.alert.vip ? 'full' : 'empty'}
						loading = {this.props.alert.pending}
						onClickEmpty = {this.modifyAlert}
						onClickFull = {this.modifyAlert}
					/>
				</div>
			</div>
	    );
	}
}
						//{onClickEmpty = {this.addVip}}
						//{onClickFull = {this.removeVip}}
export default Alert;