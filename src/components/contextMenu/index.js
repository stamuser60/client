import React from 'react';
import './ContextMenu.scss';

class ContextMenu extends React.Component {

	_handleClick = (event) => {
		const {visible} = this.props
		const wasOutside = visible ? !(this.root.contains(event.target)) : false
		if (wasOutside && visible) this.props.close()
	}

	componentDidMount() {
		document.addEventListener('click',this._handleClick)
	}

	componentWillUnmount () {
		document.removeEventListener('click',this._handleClick)
	}

	render () {
		const children = React.Children.map(this.props.children, (child,index) => {
			return React.cloneElement(child, {
				className: `ContextMenu--option ${child.props.disabled && 'disabled'}`,
				onClick: (e) => {child.props.onClick(e);this.props.close()}
			})
		})


	    return(this.props.visible || null ) && 
			<div ref={ref => {this.root = ref}} className="ContextMenu" style={{left:this.props.x,top:this.props.y}}>
				<div className="ContextMenu--header"/>
				{ children }
			</div>
	}
    
}

export default ContextMenu;