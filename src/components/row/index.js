import React from 'react';
import './Row.scss';

const Row = props => {

    return (
		<div className="Row">
			{props.children}
		</div>
    );
}

export default Row;