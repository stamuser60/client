import React from 'react'
import './editor.scss'
import {Editor, EditorState, ContentState, convertToRaw} from 'draft-js'


const convertRawToText = raw => (raw.map( line => (line.text) ).join('\n'))
const convertTextToContentState = value => (EditorState.createWithContent(ContentState.createFromText(value || '')))

class TextEditor extends React.Component {

	constructor(props) {
		super(props)
		this.state = { 
			editorState : convertTextToContentState(props.value)
		}
	}

	onChange = editorState => {
		const contentState = editorState.getCurrentContent(),
		rawLines = convertToRaw(contentState).blocks,
		value = convertRawToText(rawLines),
		name = this.props.name

		if (this.props.onChange){
			this.props.onChange({
				target: {
					name,
					value
				}
			})
		}
		// console.log(value)
	}

	componentWillReceiveProps = newProps => {
		this.setState({editorState: convertTextToContentState(newProps.value)})
	}

	render (){
		const {readOnly, placeholder, className} = this.props
		return <div className = {className}>
				<Editor editorState={this.state.editorState} placeholder={placeholder} onChange={this.onChange} readOnly={readOnly}/>
			</div>
	}
}

export default TextEditor