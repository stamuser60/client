import React from 'react';
import './AlertsTable.scss';
import moment from 'moment';
import AlertModal from '../alertModalNew'
import ModalWindow from '../modalWindow'

const iconSeverityDict =	{
    natural : "fa fa-question-circle natural",
    unknown : "fa fa-question-circle natural",
    normal: "fa fa-check-circle normal",
    warning : "fa fa-chevron-circle-up warning",
    minor : "fa fa-exclamation-circle minor",
    major : "fa fa-exclamation-triangle major",
    critical : "fa fa-times-circle critical"
};

const cssBackgroundSeverityDict = {
    unknown: "",
    natural: "",
    normal: "normalBackground",
    warning: "warningBackground",
    minor: "minorBackground",
    major: "majorBackground",
    critical: "criticalBackground",
}

const SEVERITIES_VALUES = {
    UNKNOWN: 0,
	NORMAL: 1,
	WARNING: 2,
	MINOR: 3,
	MAJOR: 4,
    CRITICAL: 5
}

// take out of component
const sortBySeverity = (alert1,alert2) => {
    if(SEVERITIES_VALUES[alert1.severity] < SEVERITIES_VALUES[alert2.severity]) {
        return 1
    } else if (SEVERITIES_VALUES[alert1.severity] > SEVERITIES_VALUES[alert2.severity]){
        return -1
    }
    return 0
}

const sortByDate = (alert1,alert2) => {
    if (moment(alert1.date).isBefore(alert2.date)) {
        return 1
    } else if (moment(alert1.date).isAfter(alert2.date)){
        return -1
    }
    return 0
}

const sortByTitle = (alert1,alert2) => {
    if (alert1.title < alert2.title) {
        return 1
    } else if (alert1.title > alert2.title){
        return -1
    }
    return 0
}

const sortByNode = (alert1,alert2) => {
    if (alert1.node < alert2.node) {
        return 1
    } else if (alert1.node > alert2.node){
        return -1
    }
    return 0
}

const alertTextFields = ['node', 'title']

class AlertsTable extends React.Component {
    constructor(props) {
        super(props)

        this.SORT_FUNCTIONS = {
            severity: sortBySeverity,
            date: sortByDate,
            title: sortByTitle,
            node: sortByNode
        }

        this.state = {
            alert: null,
            heightInPage: null,
            modal: {
                open: false,
                title: ""
            },
            clicked: "",
            alerts: [],
            orderBy: "severity",
            orderASC: true
        }
    }

    componentDidMount () {
        this.setState({
            alerts: this.sortAlerts(this.state.orderBy,this.props.alerts, this.state.orderASC)
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({alerts:  this.sortAlerts(this.state.orderBy,nextProps.alerts, this.state.orderASC)})
    }

    setAlert = (alert,heightInPage,activeIndex) => {
		this.setState({modal: {
            open: true,
            title: "פרטי ההתראה",
            component: <AlertModal alert={alert}/>
        }})
    }
    
    closeModal = () => {
		this.setState((prevState) => ({
			modal: {
				...prevState.modal,
				open: false
            },
            clicked: ""
		}))
    }

    toShow = (alert) => {
        let toShow = false
        alertTextFields.map((field) => {
            if (alert[field] != null) {
                if(alert[field].toLowerCase().includes(this.props.filter.toLowerCase())) {
                    toShow = true
                }
            }
        });
        return toShow
    }

    sort = (type, alertsList, orderASC) => {
        let order =type === this.state.orderBy ? !orderASC : true
        let newAlerts = this.sortAlerts(type,alertsList,order)
        this.setState({
            orderASC: order,
            alerts: newAlerts,
            orderBy:type,
        })   
    }

	sortAlerts = (type,alertsList, orderASC) => {
        if (!orderASC) {
            alertsList.reverse()
        } else {
            alertsList.sort((alert1, alert2)=> {
                return this.SORT_FUNCTIONS[type](alert1, alert2) 
            })
        }
		return alertsList
	}

    render() {
        return (
            <div className="AlertsTable">
                <table className="table">
                    <thead>
                        <tr>
                            <th className={this.state.orderBy == "severity" ? "sev active": "sev"} onClick={()=> {
                                this.sort("severity",this.state.alerts, this.state.orderASC)
                                }}>חומרה</th>
                            <th className="maktag">מקתג</th>
                            <th className={this.state.orderBy == "node" ? "node active": "node"} onClick={()=> {
                                this.sort("node", this.state.alerts, this.state.orderASC)
                                }}>שם רכיב</th>
                            <th className={this.state.orderBy == "date" ? "date active": "date"} onClick={()=> {
                                this.sort("date",this.state.alerts, this.state.orderASC)
                                }}>זמן</th>
                            <th className={this.state.orderBy == "title" ? "text active": "text"} onClick={()=> {
                                this.sort("title", this.state.alerts, this.state.orderASC)
                                }}>טקסט</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.alerts.map((alert, index) => {
                                if (this.toShow(alert) || this.props.filter == "") {
                                    let alertCss = ["alertTr"]
                                    alertCss.push((this.state.clicked === index) && "active")
                                    alertCss.push(alert.severity ? cssBackgroundSeverityDict[alert.severity.toLowerCase()] : "")

                                    return (
                                        <tr className={alertCss.join(' ')}
                                            onClick={(heightInPage) => {
                                                                            this.setAlert(alert,heightInPage,index)
                                                                            this.setState({clicked: index})
                                                                        }}
                                            key = {index}>
                                            <td className='sev'>
                                                <i className={alert.severity.toLowerCase() ? iconSeverityDict[alert.severity.toLowerCase()] : iconSeverityDict["natural"]}></i>
                                            </td>
                                            <td className="maktag">
                                                <i className="fa fa-file">
                                                </i>
                                            </td>
                                            <td className="node">
                                                {alert.node.split('.')[0]}
                                            </td>
                                            <td className="date">
                                                {moment(alert.date).format('HH:mm:ss DD/MM/YYYY')}
                                            </td>
                                            <td className="text">
                                                {alert.title}
                                            </td>
                                        </tr>

                                    )
                                }
                            })
                        }
                    </tbody>
                </table>
                <ModalWindow mode={this.state.modal.open}
							title={this.state.modal.title}
							 close={this.closeModal}
                             width="700">
					{this.state.modal.component}
				</ModalWindow>
            </div>
        );
    }
}
    

export default AlertsTable;