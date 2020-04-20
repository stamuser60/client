import React from 'react'
import SideBarSection from './sidebarsection/'
import PropTypes from 'prop-types'
import AnimatedMount from '../animated-mount'
import './SideBar.scss'

class SideBar extends React.Component {

	constructor(props){
		super(props)
		this.state = {
		activeIndex : props.defaultIndex || 0
		// class: (props.open ? 'open ' : 'closed ')
		}
	}

	getChildContext() {
		return {sidebarOpen : this.props.open}
	}
	
	activateTab = (activeIndex) => {
		this.setState({
			...this.state,
			activeIndex
		})
	}

	// componentWillReceiveProps(nextProps){
	// 	if( nextProps.open && this.props.open === false ){
	// 		this.setState({class:'open '})
	// 	} else if ( nextProps.open === false && this.props.open === true) {
	// 		this.setState({class:'close '})
	// 	}
	// }

	checkClickOutside = event => {
		if (!this.sidebar.contains(event.target)){
			if (this.props.onClickOutside) this.props.onClickOutside()
		}
	}

	componentDidMount () {
		document.addEventListener( "click" , this.checkClickOutside )
	}

	componentWillUnmount () {
		document.removeEventListener( "click" , this.checkClickOutside )
	}

	// SideBar sections need to know how many of them there are,
	// this is the magic that inserts that to their props
	render () {
		const children = React.Children.map(this.props.children, (child,index) => {
			if ( child.type === SideBarSection){
				return React.cloneElement(child, {
					sectionsNumber: this.props.children.length || 1,
					isActive: (this.state.activeIndex === index),
					onActivate: () => { this.activateTab(index) }
				})
			} else {
				return child
			}
		})
	    return (
			<div 
			className= {"SideBar "+ 
							// this.state.class +
							((this.props.left) ? "left" : "right")}
			ref = { sidebar => this.sidebar = sidebar}
			>
				{/*<div className="blueheader"/>*/}
				{children}
				<div className="footer"/>
			</div>
	    );
	}
}

SideBar.childContextTypes = {
	sidebarOpen : PropTypes.bool
}

// export default SideBar;

export default AnimatedMount({mountClass: 'sidebar-mount', unmountClass:'sidebar-unmount',defaultClass: 'sidebar-default'})(SideBar)
