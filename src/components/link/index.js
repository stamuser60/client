import React from 'react';
import './Link.scss';

const Link = (props) => {
    return (
		<div className="Link" onClick = {props.linkAction}>
			{props.children}
		</div>
    );
}

export default Link;