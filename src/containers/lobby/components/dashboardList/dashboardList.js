import React from 'react'
import '../../../app/fonts/glyphicon.css'
import './dashboardList.scss'
const DashboardList = (props) => {
	return (
		<div className="DashboardList">
			<button>
				<div width="200" className="dropup">
					<div className="title">דשבורדים</div>
					<div className="list">
						{
							Object.keys(props.dashboards).map(dashboardId => {
								let dashboard = props.dashboards[dashboardId]
								return (
									<div className="list-item" onClick={()=> {
											props.onDashboardClick(dashboardId)
										}}>
										{dashboard.displayName}
									</div>
								)
							})
						}
					</div>
				</div>
				<span className="glyphicon glyphicon-th icon"></span>
			</button>
		</div>
	)
}

export default DashboardList

