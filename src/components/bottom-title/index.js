import React from 'react';
import './BottomTitle.scss';

const BottomTitle = props => {

    return (
		<div className="bottom-title">
			{props.children}
		</div>
    );
}

export default BottomTitle;