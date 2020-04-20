import React from 'react'
import './Pathbar.scss'

const Pathbar = props => {

	return (
		<div className="path-bar">
			<div className="content">
				<div className="items">
					<i className="fa fa-home icon"/>
					{props.children}
				</div>
			</div>
		</div>
	)
}

export default Pathbar