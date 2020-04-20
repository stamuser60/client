import React from 'react'
import PropTypes from 'prop-types'
import List from '../list'
import Alert from '../alert'
import AlertModal from '../alertModal'
import {isEqual} from 'lodash'
import './AlertsList.scss'

class AlertsList extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			alert: null,
			heightInPage: null,
			activeIndex: null
		}
	}

	componentWillReceiveProps(nextProps,nextContext){
		if (nextContext.sidebarOpen === false || !isEqual(nextProps.alerts,this.props.alerts)){
			this.setState({alert: null,heightInPage:null})
		}

		// if (nextProps.alerts.length !== this.props.alerts.length){
		// 	console.log('new',nextProps.alerts,'old',this.props.alerts)
		// }
	}

	setAlert = (alert,heightInPage,activeIndex) => {
		this.setState({alert,heightInPage,activeIndex})
	}

	render (){
	    return  (
	    		<div className="alerts-list">
	    			<AlertModal alert = {this.state.alert} heightInPage = {this.state.heightInPage}/>
					<List>
						{this.props.alerts.map((alert,index) => {
							return <Alert 
									key={alert.id}
									alert = {alert}
									nodeId = {this.props.nodeId}
									changeAlert = {this.props.changeAlert}
									addVip = {this.props.addVip}
									removeVip = {this.props.removeVip}
									modifyVip = {this.props.modifyVip}
									isActive = {this.state.activeIndex===index}
									updateAlerts = {this.props.updateAlerts}
									onClick={ (heightInPage) => {this.setAlert(alert,heightInPage,index)}}/>
						})}
					</List>
				</div>
	    )
	}
}


AlertsList.contextTypes = {
	sidebarOpen: PropTypes.bool
}


export default AlertsList