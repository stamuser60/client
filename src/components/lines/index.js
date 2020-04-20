import React from 'react'
import './Lines.scss'

const Lines = props => {
	return (
		<svg className="Lines">
			{props.children}
		</svg>
	)
}

export default Lines