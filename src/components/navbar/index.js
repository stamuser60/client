import React from 'react'
import cprLogo from './assets/cpr60.png'
import './Navbar.scss'
import IdentifyButtonContainer from '../loginButton/loginButton.container'

const Navbar = props => {
	return (
		<div className={`Navbar ${props.mode === 'PRESENTATION' ? "disapear" : ""}`}>
			<div className="logo">
				<img src={cprLogo} alt="cprLogo" onClick={() => {
					if (props.onClickLogo) props.onClickLogo()
				}}/>
			</div>
			<IdentifyButtonContainer/>
		</div>
	)
}
export default Navbar;