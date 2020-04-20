import React from 'react'
import AnimatedMount from '../animated-mount'
import './line-loader.scss'

const LineLoader = props => <div className="line-loader">
	<div className="line1"/>
	<div className="line2"/>
</div>

// export default LineLoader

export default AnimatedMount({mountClass:'line-loader-mount', unmountClass:'line-loader-unmount',defaultClass: 'line-loader-box-initial'})(LineLoader)