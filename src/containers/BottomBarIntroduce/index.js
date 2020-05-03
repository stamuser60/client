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
import BottomBar from '../../components/bottom-bar';
import CountdownDisplay from '../../components/countdown-display/'
import BottomTitle from '../../components/bottom-title/'
import AlertSearch from '../../components/alertSearch/'
import Row from '../../components/row/'
import AlertsTable from '../../components/alertsTable/'
import moment from 'moment'
import io from 'socket.io-client'
import { flowsNotificationsSocketUrl } from '../../config/general.config'
import { values, mapValues } from 'lodash'
import LineLoader from '../../components/line-loader/'


import BottomBarContent from '../../components/BottomBarContent/'
const mapStateToProps = state => ({
    alerts: state.alerts,
    changes: state.flow.changes,
    screenMode: state.app.screenMode
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getFlowAlerts,
    changeFilter,
    setNewFlowAlerts,
    clearChanges,
    switchModeToNormal,
    switchModeToEdit,
    switchModeToOpen,
    saveChanges,

    resetNodesToCut,
    resetNodesToCopy
}, dispatch)


class BottomBarIntroduce extends React.Component {

    state = {
        interval: {
            id: ""
        },
        filter: ""
    }   

    render() {
        return <div>
            <BottomBar
                show={this.state.bottomBarShow}
                //pay attantion that lastRefresh exist just on temp
                title={
                    <CountdownDisplay
                        updateTime={this.props.alerts.updateTime}
                        lastRefresh={this.state.interval.intervalTime}
                    />
                }
                changes={this.props.changes}
                mode={this.props.screenMode}
                search={event => {   this.props.search() }}
                edit={this.props.edit}
                cancel={() => {
                    this.props.clearChanges()
                    this.props.resetNodesToCopy()
                    this.props.cancel()
                }}Changes
                save={() => {
                    this.props.saveChanges({ ...this.props.changes })
                    this.props.clearChanges()
                    this.props.save()
                }}
                open={() => {
                    this.props.switchModeToOpen()
                }}

                close={() => {
                    this.props.switchModeToNormal();
                }}
            >
              { this.props.children}

            </BottomBar>
        </div>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BottomBarIntroduce);
