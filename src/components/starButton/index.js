import React from 'react'
import './star-button.scss'

class StarButton extends React.Component{

	onClick = clickHandler => event => {
		event.stopPropagation()
		if (clickHandler) clickHandler(event)
	}

	getClickFunc = mode => {
		if ( mode === 'empty' ) return this.onClick(this.props.onClickEmpty) 
		if ( mode === 'loading' ) return this.onClick(this.props.onClickLoading)
		if ( mode === 'full' ) return this.onClick(this.props.onClickFull)
		return null
	}


	render () {
		return <div className={`star-button ${this.props.mode} ${this.props.loading ? 'loading' : ''}`} >
			<i onClick={this.getClickFunc(this.props.mode)}/>

		</div>
	}
}

export default StarButton;