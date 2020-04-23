import React from 'react'
import Navbar from '../../components/navbar/'
import SideBar from '../../components/sidebar/'
import SideBarSection from '../../components/sidebar/sidebarsection/'
import Search from '../search/search'
import DataErrorAlert from '../../components/data-error-alert/data-error-alert'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { lobbyId } from '../../config/general.config'

import BottomBar from '../../components/bottom-bar';
import CountdownDisplay from '../../components/countdown-display/'
import BottomTitle from '../../components/bottom-title/'
import AlertSearch from '../../components/alertSearch/'
import Row from '../../components/row/'
import AlertsTable from '../../components/alertsTable/'
const mapDispatchToProps = dispatch => bindActionCreators({
  changePage: (path) => push(path)
}, dispatch)

const mapStateToProps = state => ({
	dashboardId: state.lobby.sources.id,
	showErrorAlert: state.error.show,
	errorMsg: state.error.msg
})

class Tools extends React.Component {

	render() {
		return <div>
			<DataErrorAlert show={this.props.showErrorAlert} text={this.props.errorMsg}/>
			<Navbar onClickLogo={()=>{
				let dashboardId = this.props.dashboardId
				if(dashboardId == undefined) {
					dashboardId = lobbyId
				}
				this.props.changePage(`/lobby/${dashboardId}`)
			}}/>
{/* <BottomBar 
					show = {this.state.bottomBarShow}
					title = {
						<CountdownDisplay 
						updateTime={this.props.alerts.updateTime} 
						lastRefresh={this.state.interval.intervalTime} 
						/>
					}
					changes={this.props.changes}
					mode={this.props.screenMode} 
					search={ event => {this.props.openSearch()}}
					edit={()=> {this.props.switchModeToEdit()}}
					cancel={()=>{this.resetApplicationState()}}
					save={()=>{
						this.props.saveChanges({...this.props.changes})
						this.resetApplicationState()
					}}
					open={()=>{
						 this.props.switchModeToOpen() 
					}}
					close={()=>{
						 this.props.switchModeToNormal();
					}}
					>
					<BottomTitle>
						דף הבית
					</BottomTitle>
					<BottomTitle>
						<AlertSearch setFilter={this.changeAlertsFilter}></AlertSearch>
					</BottomTitle>
					<Row>
						<AlertsTable 
						isOpen={this.state.bottomBarShow} 
						filter={this.state.filter} 
						alerts={this.getAlertsTable()}/>
					</Row>
				</BottomBar> */}

			<SideBar 
			show={this.props.searchOpen} 
			left={true}
			onClickOutside = {this.props.closeSearch}
			>
				<SideBarSection title="חיפוש" open={true}>
					<Search
					open = {this.props.searchOpen}
			 		onSearchInput = {this.props.onSearchInput}
					searchValue = {this.props.searchValue}
					changePage={this.props.changePage} 
					/>
				</SideBarSection>
			</SideBar>
		</div>
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Tools);


