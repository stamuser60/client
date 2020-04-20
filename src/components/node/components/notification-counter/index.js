import React from 'react'
import Odometer from 'react-odometerjs';
import './notification-counter.scss';

const NotificationCounter = props => {
	const zeroClass = !props.counter ? 'zero' : ''
    return	<div className = {`notification-counter ${props.color} withShadow ${zeroClass}`}>
				<Odometer className="notification-odometer" value= {props.counter}/>
			</div>
}

export default NotificationCounter;