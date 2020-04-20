import React from 'react'
import './alerts-error-modal.scss'
import errorImg from './assets/waze_error.png'


const AlertsErrorModal = props => 
<div className="alerts-error-modal">
	<div className="content">
		לא הצלחתי להביא התראות
	</div>
	<img src={errorImg} alt="sad waze"/>
</div>


export default AlertsErrorModal