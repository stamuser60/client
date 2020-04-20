import React from 'react'
import Countdown from '../countdown/'
import './countdown-display.scss'
import moment from 'moment'

const CountdownDisplay = props => {

	const acceptableDelay = 3,
	{updateTime} = props
	const problem = (moment() - updateTime) / 1000 / 60 > acceptableDelay

	return <div className="countdown-display">
			{ updateTime && <span
				className = { problem ? 'error' : ''}>
				עודכן {updateTime.fromNow()}
				</span> }
	</div>
}

export default CountdownDisplay;