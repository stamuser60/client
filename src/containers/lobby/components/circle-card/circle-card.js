import React from 'react'
import './style.scss'

const oneDecimal = num => Math.floor( num * 10 ) / 10
const NORMAL_STATUS = 1

const CircleCard = props => {

	// const alertClass = props.colorAlerts ? 'bad' : '',
	// hermeticClass = props.colorHermetic != 1 ? 'bad' : '',
	// cardClass = (props.colorAlerts || props.colorHermetic != 1)  ? 'bad' : 'good'

	// to be reviewed
	let alertClass,hermeticClass,cardClass;
	if (props.colorAlerts === undefined) {
		cardClass = ''
	} else {
		alertClass = props.colorAlerts ? 'bad' : ''
		hermeticClass = props.colorHermetic != NORMAL_STATUS ? 'bad' : ''
		cardClass = (props.colorAlerts === true || props.colorHermetic != NORMAL_STATUS)  ? 'bad' : 'good'
	}

	return (
		<div 
		className={`circle-card ${cardClass}`}
		onClick={()=>{ if(props.beakId == "") props.onClickAlert() }}
		>
			<div className="top columned-center" onClick = {()=> {if(props.beakId != "") props.onClickAlert()}}>
				<div className="mini-title">שירות</div>
				<div className="title">{props.title}</div>
			</div>
			<div className="mid columned-center" onClick = {()=> {if(props.beakId != "") props.onClickAlert()}}>
				<div className="mini-title">התראות</div>
				<div className={`content ${alertClass}`}>{props.alertsCount}</div>
			</div>
			{
				props.beakId != "" ?
				<div className="bottom columned-center" onClick={()=> {
					window.open(props.morebeakUrl)}}>
					{props.hasHermeticProblem && <i className={"fa fa-exclamation-triangle hasHermeticProblem"}></i>}
					<div className="mini-title">הרמטיות</div>
					<div className={`content ${hermeticClass}`}>{props.hermetic == null ? "אין מידע" :oneDecimal(props.hermetic)}</div>
					{/* </a> */}
				</div> : null
			}
		</div>
	)
}

export default CircleCard