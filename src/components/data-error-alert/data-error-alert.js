import React from 'react'
import './data-error-alert.scss'

const DataErrorAlert = props => props.show ? <div 
className={`data-error-alert`}>
	{props.text}
</div> : null

export default DataErrorAlert