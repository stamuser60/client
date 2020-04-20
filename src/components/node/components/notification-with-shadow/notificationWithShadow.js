import React from 'react'
import NotificationCounter from '../notification-counter'
import './notification-with-shadow.scss'

const NotificationWithShadow = props => <div className="notification-with-shadow">
	<NotificationCounter counter={this.props.counter} color={this.props.color}/>
	<div className="shadow-notification"/>
</div>

export default NotificationWithShadow