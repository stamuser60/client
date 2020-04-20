import React from 'react'
import 'moment/locale/he'
import './AlertModalNew.scss'

const translateAlertMeta = key => {
	return {
		node: 'רכיב',
		message_group: 'קבוצה',
		severity: 'חומרה',
		application: 'אפליקציה',
		object: 'אובייקט',
		source: 'מקור',
		date: 'תאריך',
        vip: 'vip',
        title: 'תיאור',
        id: 'מזהה'
	}[key] || key
}

function linkify(s) {
  let urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
  return s.replace(urlPattern, '<a href="$&" target="_blank">$&</a>')
}

const ignoreInDetails = ['layout','nodeId','vip']

class AlertModal extends React.Component {

    render() {
        let props = this.props
        let alertAttributes = []
        if (props.alert) {
            alertAttributes = Object.keys(props.alert).filter( alertKey =>  !ignoreInDetails.includes(alertKey))
        }
        
        return (
            <div className="details" style={{height:`calc(${(alertAttributes.length )} * var(--item-height ) + var(--body-padding)/2 )`}}>
                <div className="items-container">
                    {
                        alertAttributes.map(
                        (key,index) => (key === 'date') ? 
                            <item key={index}>
                                <h className="name">{translateAlertMeta(key)}</h><h className="value">{props.alert[key].format('D/M kk:mm')}</h>
                            </item>
                            :
                            <item key={index}>
                                <h className="name">{translateAlertMeta(key)}</h><h className="value" dangerouslySetInnerHTML={{__html: linkify(props.alert[key])}}/>
                            </item>)
                    }
                </div>
            </div>
        )
    }
}    

export default AlertModal;