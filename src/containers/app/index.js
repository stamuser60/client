import React from 'react'
import { Router,Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {setUsername} from '../../modules/user'
import Home from '../home/'
import Background from '../../components/background/'
import Lobby from '../lobby/lobby'
import Tools from '../tools/tools'
import {setAuthToken} from '../../services/authToken.service'
import './fonts/font-awesome.css'
import './fonts/assistant.css'
import './fonts/glyphicon.css'
import './constants.css'

const mapDispatchToProps = dispatch => bindActionCreators({
	setUsername,
}, dispatch)

class App extends React.Component {
  constructor(props) {
    super(props)
 
    /**
     * Code in this functions executes before the `render` function,
     * thus, the function that sets the auth token must be all sync, so that the code
     * in `render` wont run before we have the authentication token set in place.
     **/
		let newAuthToken = setAuthToken();
		this.props.setUsername(newAuthToken);
  }

	state = {
		search: {
			open: false,
			value: ''
		}
	}
	
	onSearchInput = (value, callback) => {
		this.setState(state => ({
			search: {
				...state.search,
				value
			}
		}), callback)
	}

	closeSearch = () => {
		this.setState( state => ({search: {
			...state.search,
			open: false,
			value: ''
		}}))
	}

	openSearch = () => {
		this.setState( state => ({search: {
			...state.search,
			open: true
		}}))
	}

	render() {
		return	<div 
			style={{height: '100%',position:'relative'}}
			onContextMenu={(e)=>{e.preventDefault()}}
			className="app"
			>
				<Tools
				searchValue = {this.state.search.value}
				onSearchInput = {this.onSearchInput}
				closeSearch = {this.closeSearch}
				searchOpen = {this.state.search.open}
				/>
				<Background/>
				<Route exact path='/' render={
					(props) => <Lobby {...props}
				closeSearch={this.closeSearch} 
				openSearch={this.openSearch}/>}
				/>
				<Route path='/Lobby' render={
					(props) => <Lobby {...props}
				closeSearch={this.closeSearch} 
				openSearch={this.openSearch}/>}
				/>
				{/*<Route  path="/flow" component={Home} />*/}
				<Route path="/flow" render={(props) => <Home {...props} 
				closeSearch={this.closeSearch} 
				openSearch={this.openSearch}/>} 
				/>

		  	</div>
  }

}

export default connect(undefined, mapDispatchToProps)(App);

