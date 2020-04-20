import React from 'react'
import UserIconActivated from './icons8-user-32.png'
import UserIconDeactivated from './icons8-user-32.png'
import './loginButton.scss'

const IdentifyButton = props => {
  console.log(props.username)
  return (
    <div className={"loginContainer"}>
      {props.username ? <span className={'greeting'}><img className={"userImgKnown"} src={UserIconActivated} alt={"user img"}/>{props.username}</span> :
        <button onClick={props.onClick} className={'connectBtn'}><img className={"userImgBtn"} src={UserIconDeactivated} alt={"user img"}/>התחבר</button>}
    </div>
  )
}

export default IdentifyButton