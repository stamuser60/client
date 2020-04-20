import React from 'react'
import './style.scss'


const LobbyCard = props => {

	const alertClass = props.colorAlerts ? 'bad' : 'good',
	hermeticClass = props.colorHermetic ? 'bad' : 'good'

	return (
		<div className="lobby-card">
			<div className="lobby-card-header">
				<div className="lobby-card-header-arrow-down"/>
				<div className="lobby-card-header-before">מסלול</div>
				<div className="lobby-card-header-name">{props.title}</div>
			</div>
			<div className="lobby-card-content">
				<div 
				className={`item alerts ${alertClass}`} 
				onClick = {props.onClickAlert}>
					<div className="item-wrapper-for-hover">
						<i className="fa fa-heartbeat"></i>
						<div className="data">
					  		<div className="data-title">רכיבי</div>
							<div className="data-value">{props.alerts}</div>
						</div>
			  		</div>
				</div>
				<div 
				className={`item hermetic ${hermeticClass}`}
				onClick = {props.onClickHermetic}>
					<div className="item-wrapper-for-hover">
						<i className="fa fa-street-view"></i>
						{props.hasAlert && <i className={"fa fa-exclamation-triangle hasAlert"}></i>}
						<div className="data">
							<div className="data-title">הרמטיות</div>
							<div className="data-value">{props.hermetic == null ? "אין מידע" :parseInt(props.hermetic)}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default LobbyCard