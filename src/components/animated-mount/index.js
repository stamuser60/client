import React from 'react'

const AnimatedMount = ({mountClass, unmountClass, defaultClass}) => {
	
	return Wrapped => class extends React.Component {
		state = {
			mounted: false
		}

		componentDidUpdate = (prevProps) => {
			if ( this.props.show !== prevProps.show){
				if ( this.props.show ) {
					this.setState({mounted: true})
					this.mountStyle()
				}
				else {
					this.unmountStyle()
				}
			}
		}

		mountStyle = () => {
			this.setState({
				class: mountClass
			})
		}

		unmountStyle = () => {
			this.setState({
				class: unmountClass
			})
		}

		transitionEnd = (e) => {
			if(this.props.show === false) {
				this.setState({
					mounted: false,
					class: ''
				})
			}
		}

		render () {
			const { show, style, ...props} = this.props
			return this.state.mounted && <div
			style = {style}
			onTransitionEnd = {this.transitionEnd}
			onAnimationEnd = {this.transitionEnd}
			className={`${defaultClass} ${this.state.class}`}
			>
				<Wrapped {...props} />
			</div>
		}
	}
}

export default AnimatedMount