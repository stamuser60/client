import React from 'react'
import './CancelPresentation.scss'
import AnimatedMount from '../animated-mount'


const CancelPresentation = (props) => {
	return (
		<div onClick={()=>{props.cancel()}}>
				<i className="fa fa-times"/>
		</div>
	)
}

export default AnimatedMount({mountClass:'show', unmountClass:'hide',defaultClass: 'CancelPresentation'})(CancelPresentation)
// export default CancelPresentation