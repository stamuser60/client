import React from 'react'
import './version.scss'

const Version = props => <div className="version"> 
	<div className="container">
		<span className="text">
			{props.text}
		</span>
	</div>
</div>

export default Version