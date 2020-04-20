import React from 'react'
import moment from 'moment'

const intervalTime = 1 * 1000

class Countdown extends React.Component{

	state = {
		secondsRemaining: 0,
		intervalId: ""
	}

	updateSecondsRemaining = () => {
		const secondsDif = Math.floor( (this.props.countTo - moment()) / 1000 % 60),
		secondsRemaining = (secondsDif >= 0) ? secondsDif : 0
		this.setState({secondsRemaining})
	}

	componentDidMount(){

		this.updateSecondsRemaining()

		const intervalId = setInterval(() => {
			this.updateSecondsRemaining()
		}, intervalTime)

		this.setState({intervalId})
	}

	componentWillUnmount (){
		if (this.state.intervalId) clearInterval(this.state.intervalId)
	}

	render(){
		return <span>{this.state.secondsRemaining}</span>
	}

}

export default Countdown

