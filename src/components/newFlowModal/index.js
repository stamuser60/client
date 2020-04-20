import React from 'react'
import './newFlowModal.scss'

class selectNodeType extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			name: "",
			displayName:""
		}
	}

	handleModalInputChange = (event) => {
		const target = event.target
		const value = target.value
		const name = target.name

		this.setState({[name] : value})
	}

	cancelbtnClick() {
		this.setState({name:"",
					   displayName: ""})
		this.props.toggle()
	}

	savebtnClick() {
		this.props.addFlow(this.state.name, this.state.displayName)
		this.setState({
		   name:"",
		   displayName: ""
		})
		// this.props.addNode({
		// 	type:this.props.type, 
		// 	name: this.state.name, 
		// 	displayName: this.state.displayName
		// })

		this.props.toggle()
	}

	render() {
		return (
			<div className="flowModal">
					<div className="flow-modal-content">
					<div className="input-title">שם</div>
						<input name="name" value={this.state.name} placeholder="שם באנגלית" onChange={this.handleModalInputChange}/>
					<div className="input-title">שם הצגה</div>
						<input name="displayName" value={this.state.displayName} placeholder="שם הצגת מסלול" onChange={this.handleModalInputChange}/>
					<div className="buttons">
				 		<button onClick={() => {this.savebtnClick()}} className="savebtn">שמור</button>
				 		<button onClick={() => {this.cancelbtnClick()}} className="cancelbtn">ביטול</button>
			 		</div>
				</div>
	 		</div>
		)
	}
}

export default selectNodeType