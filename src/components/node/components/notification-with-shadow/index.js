import React from 'react'
import NotificationCounter from '../notification-counter'
import './notification-with-shadow.scss'

const NotificationWithShadow = props => {
	const zeroClass = !props.counter ? 'zero' : ''

	return	<div className="notification-with-shadow">
			<NotificationCounter counter={props.counter} color={props.color}/>
			<div className={`shadow-notification ${zeroClass}`}/>
		</div>
}

export default NotificationWithShadow