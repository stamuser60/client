import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { 
	getFlowAlerts,
	changeFilter,
	setNewFlowAlerts
} from '../../modules/alerts';
import { clearChanges, saveChanges } 
from '../../modules/flow'
import { switchModeToNormal, switchModeToEdit, switchModeToOpen, resetNodesToCopy, resetNodesToCut } 
from '../../modules/app'

import { MODES } from '../../helpers/general.helper';

import BottomTitle from '../bottom-title/'
import AlertSearch from '../alertSearch/'
import Row from '../row/'
import AlertsTable from '../alertsTable/'

import moment from 'moment'
import io from 'socket.io-client'
import {flowsNotificationsSocketUrl} from '../../config/general.config'
import {values, mapValues} from 'lodash'

const mapStateToProps = state => ({
	alerts: state.alerts,
	changes: state.flow.changes,
	screenMode: state.app.screenMode
})

const mapDispatchToProps = dispatch => bindActionCreators({
	// getFlowAlerts,
	// changeFilter,
	// setNewFlowAlerts,
	// clearChanges,
	// switchModeToNormal,
	// switchModeToEdit,
	// switchModeToOpen,
	// saveChanges,
	
	// resetNodesToCut,
	// resetNodesToCopy
}, dispatch)


class BottomBarContent extends React.Component {

	state = {
		filter: ""
	}

	changeAlertsFilter = (filter) => {
		this.setState({filter})
	}
	render() {
		return <div>
					<BottomTitle>
						{this.props.title}
					</BottomTitle>
					<BottomTitle>
						<AlertSearch setFilter={this.changeAlertsFilter}></AlertSearch>
					</BottomTitle>
					<Row>
						<AlertsTable 
						isOpen={this.state.bottomBarShow} 
						filter={this.state.filter} 
						alerts={this.props.alertsTable}/>
					</Row>
			</div>
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(BottomBarContent);
