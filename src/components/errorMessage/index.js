import React from 'react';
import errorImg from './assets/error-bug.png'
import './ErrorMessage.scss';

//  props: type

// type to name
// const names = {
// 	database : "מסד נתונים",
// 	server : "שרת",
// 	folder: "שרת FTP"
// }

const ErrorMessage = props => {

    return (
		<div className="ErrorMessage">
			<span> אופס! קרה משהו </span>
			<img src={errorImg} alt="sad waze"/>
		</div>
    );
}

export default ErrorMessage;