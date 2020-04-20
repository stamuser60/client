import React from 'react';
import './Button.scss';

/* remove the class name , to be reviewed*/
const Button = props => {

    return (
		<div className={"Button " + (props.tmpClassName || '')} onClick={props.onClick}>
			<div>
				{props.children}
			</div>
		</div>
    );
}

export default Button;