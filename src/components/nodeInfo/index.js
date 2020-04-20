import React from 'react'
import ExpandingTextarea from '../expandingTextarea/'
import './NodeInfo.scss'
import nodeTypes from '../../config/nodeTypes'

class NodeInfo extends React.Component {

	static defaultProps = {
		name: '',
		displayName: '',
		team: '',
		description: '',
		type: ''
	}

	submit = (data) => {
		this.props.submit(data)
	}

	handleInputChange = (event) => {
		const {name, value} = event.target
		// console.log(name,value)
		this.submit({[name]: value})
	}

	selectNodeType() {
		return (
			<select name="type" type="select" value={this.props.type} onChange={this.handleInputChange}>
				{
					Object.keys(nodeTypes).map((typeId, index) => {
					let type = nodeTypes[typeId]
					if(typeId === this.props.type) {
						return <option key={index} value={typeId} selected="selected">
									{type.displayName}
								</option>
					}
					return (<option key={index} value={typeId}>
								{type.displayName}
							</option>)
					})
				}
			</select>
		)
	}

	showNodeType () {
		// to be reviewed (sometimes gets undefined)
		return (
			<input className="disabled" disabled name="type" value={this.props.type ? nodeTypes[this.props.type].displayName : ''}/>
		)
	}

	render () {

		const {
			name,
			displayName,
			team,
			description,
			type,
			edit,
			regex} = this.props

		const inputClass = edit ? "" : "disabled"

		return (
			<div className="NodeInfo">
				<div dir="rtl" className="info">
					<div className="information">
						<div className="title">שם רכיב</div>
						<div className={"content " + inputClass}>
							<input onFocus={this.props.setFocus} onBlur={this.props.unsetFocus} className={(edit ? "" : "disabled")} disabled={!edit} name="name" value={ name || ""} placeholder="example" onChange={this.handleInputChange}/>
						</div>
					</div>
					<div className="information">
						<div className="title">שם הצגה</div>
						<div className={"content " + inputClass}>
							<input onFocus={this.props.setFocus} onBlur={this.props.unsetFocus} disabled={!edit} name="displayName" value={displayName} placeholder="שם תצוגה" onChange={this.handleInputChange}/>
						</div>
					</div>
					<div className="information">
						<div className="title">צוות אחראי</div>
						<div className={"content " + inputClass}>
							<input onFocus={this.props.setFocus} onBlur={this.props.unsetFocus} disabled={!edit} name="team" value={team} placeholder="צוות" onChange={this.handleInputChange}/>
						</div>
					</div>
					<div className="information">	
						<div className="title">סוג רכיב</div>
						<div className={"content " + inputClass}>
							{(this.props.edit ? this.selectNodeType() : this.showNodeType(type))}
						</div>
					</div>
					<div className="information">	
						<div className="title">ביטוי רגולרי</div>
						<div className={"content " + inputClass}>
						<ExpandingTextarea
              setFocus={this.props.setFocus}
              unsetFocus={this.props.unsetFocus}
              className="regex"
							disabled={!edit} 
							name="regex" 
							onChange={this.handleInputChange}
							value = {regex || ''}
							placeholder="regex"
							/>
							{/*<TextEditor 
							value ={regex} 
							onChange = {this.handleInputChange}
							name = "regex"
							placeholder="liron" 
							className = "text-editor"
							/>*/}
						</div>
					</div>
					<div className="information">
						<div className="title">תיאור</div>
						<div className={"content " + inputClass}>
							<ExpandingTextarea
              setFocus={this.props.setFocus}
              unsetFocus={this.props.unsetFocus}
							className="description" 
							disabled={!edit} 
							name="description" 
							onChange={this.handleInputChange}
							value = {description}
							placeholder="תיאור"
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default NodeInfo