import React from 'react';
import './Tool.scss';


const Tool = props => {

    return (
		<div className="Tool" onClick={props.onClick}>
			<div className="container">
				<img src={props.img} alt="tool img"/>
				<div className="name">
					{props.name}
				</div>
				{ (props.note) ? (<div className="note">
					ב-{props.note}
					<i className = "fa fa-share" />
				</div>) : null
				}
				
				{/*<i className={"icon fa fa-"+props.type}></i>*/}
			</div>
		</div>
    );
}

export default Tool;