import React from 'react';
import './SideBarSection.scss';

const SideBarSection = (props) => {
	const openStyle = { height: `calc(100% - var(--sidebar-title-height) * ${props.sectionsNumber - 1 } - var(--sidebar-footer-height) - ${props.sectionsNumber}*1px)`}
	const closedStyle = { height : "var(--sidebar-title-height)", overflow: "hidden"}

	const state = (props.isActive) ? 'opened' : 'closed';
	// const contentOpenStyle = { opacity: 1 , transitionDelay: '0.3s'}
	// const contentClosedStyle = { opacity: 0 }
    return (
		<div className= "SideBarSection" style = {(props.isActive) ? openStyle : closedStyle }>
			<div className="header" onClick={props.onActivate}>
				<div className="title">{props.title}</div>
			</div>
			<div className = {"sidebarSectionContent " + state} >
				{props.children}
			</div>
		</div>
    );
}

export default SideBarSection;
// style = {(props.isActive) ? contentOpenStyle : contentClosedStyle}