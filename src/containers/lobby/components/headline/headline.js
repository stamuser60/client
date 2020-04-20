import React from 'react'
import './headline.scss'
import logo from './CPR.png'

const headlineText = "CPR80"

const Headline = props => <div className="headline" style={{'--text':`'${headlineText}'`}}>
	{/*{headlineText}*/}
	<img src={logo}/>
</div>

export default Headline