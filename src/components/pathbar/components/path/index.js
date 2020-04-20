import React from 'react'
import './Path.scss'

const Path = (props) => {

	return (
		<div className="path" onClick={props.onClick}>{props.children}</div>
	)
}

export default Path