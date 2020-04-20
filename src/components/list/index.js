import React from 'react';
import './List.scss';

const List = (props) => {
    return (
		<div className="List">
			{props.children}
		</div>
    );
}

export default List;