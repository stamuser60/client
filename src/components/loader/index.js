import React from 'react'
import AnimatedMount from '../animated-mount'
import './loader.scss'

const Loader = props => <div className="showbox">
		<svg className="circular showbox" viewBox="25 25 50 50">
		  <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="1" strokeMiterlimit="10"/>
		  <circle className="path2" cx="50" cy="50" r="20" fill="none" strokeWidth="1" strokeMiterlimit="10"/>
		</svg>
	</div>

export default AnimatedMount({mountClass:'loader-mount', unmountClass:'loader-unmount',defaultClass: 'loader-box-initial'})(Loader)