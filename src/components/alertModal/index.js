import React from 'react'
import 'moment/locale/he'
import './AlertModal.scss'

const translateAlertMeta = key => {
	return {
		node: 'רכיב',
		message_group: 'קבוצה',
		severity: 'חומרה',
		application: 'אפליקציה',
		object: 'אובייקט',
		source: 'מקור',
		id: 'מזהה',
		date: 'תאריך',
		vip: 'vip'
	}[key] || key
}

const ignoreInDetails = ['title','layout','nodeId','vip']

class AlertModal extends React.Component {
	render(){

		let props = this.props
		let visible = (props.alert && props.heightInPage !== null)
		let alertAttributes = []
		if (props.alert) {
			alertAttributes = Object.keys(props.alert).filter( alertKey =>  !ignoreInDetails.includes(alertKey) )
		}

	    return visible && (
	    	<div className="alert-modal" ref={ref => {this.root = ref}} style={{top:`calc(${props.heightInPage}px + var(--alert-height)/2)`}}>
	    		<div className="alert">
	    			<div className="header">
	    				<div className="blue-header"></div>
	    				<div className="container">
	    					<div className="title-area">
	    						<h className="title">{props.alert.title}</h>
	    						<h className="subtitle" dir="ltr">{props.alert.date.fromNow()}</h>					
	    					</div>
	    				</div>
	    			</div>
	    			<div className="details" style={{height:`calc(${(alertAttributes.length )} * var(--item-height ) + var(--body-padding)/2 )`}}>
	    			<div className = "items-container">
	    				{
	    					alertAttributes.map(
	    					(key,index) => (key === 'date') ? 
	    					 	<item key={index}>
	    					 		<h className="name">{translateAlertMeta(key)}</h><h className="value">{props.alert[key].format('D/M kk:mm')}</h>
	    					 	</item>
	    					 	:
	    					 	<item key={index}>
	    					 		<h className="name">{translateAlertMeta(key)}</h><h className="value">{props.alert[key]}</h>
	    					 	</item>
	    					
	    				)}
	    				
    				</div>
	    			</div>
	    			<div className="footer"></div>
	    		</div>
	    	</div>
	    );
	}
}

export default AlertModal;