import React from 'react'
// to be reviewd, change the name, its not css its confusing
import SearchInputStyle from './components/search-input-style/search-input-style'
import List from '../../components/list'
import Tool from '../../components/tool'
import nodeTypes from '../../config/nodeTypes'
import {fetchOptions, serverSideUrl} from '../../config/general.config.js'
import {debounce, orderBy, values} from 'lodash'

// to be reviewed, create requests file
const API_URL = `${serverSideUrl}/flows/nodes/byFilter`

class Search extends React.Component {

	constructor(props) {
		super(props)
		this.debouncedGetInfo = debounce(this.getInfo , 300)
	}

	state = {
		results: []
	}

	getInfo = () => {
		// to be reviewed, create requests file
		fetch(`${API_URL}/${this.props.searchValue}`, fetchOptions())
			.then( res => res.json())
			.then( results => {
				this.setState({
					results: orderBy(values(results),['sortGrade'],['desc'])
				})
			})
	}

	updateResults = () => {
		if (this.props.searchValue && this.props.searchValue.length > 1) {
			this.debouncedGetInfo()
		} else {
			this.debouncedGetInfo.cancel()
			this.setState({results: []})
		}
	}

	handleInputChange = () => {
		// this.setState({
		// 	query: this.search.value
		// }, this.updateResults)

		this.props.onSearchInput(this.search.value, this.updateResults)
	}

	componentDidUpdate (prevProps) {
		if (prevProps.searchValue !== this.props.searchValue) {
			this.updateResults()
		}
		if (prevProps.open !== this.props.open && this.props.open === true) {
			this.search.focus()
		}
	}

	render () {

		return (
			<div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
				<SearchInputStyle>
					<input
						placeholder="חפש ..."
						value = {this.props.searchValue}
						ref = {input => this.search = input}
						onChange={this.handleInputChange}
					/>
				</SearchInputStyle>
				<List>
					{
						this.state.results.map( node => {
								const {type, name, id, parentName, parentId} = node
								return (<Tool 
									// key={id} 
									name={name} 
									img={nodeTypes[type].asset} 
									note = {parentName}
									onClick = {() => {
										const flowId = (parentId) ? parentId : id
										this.props.changePage(`/flow/${flowId}`)
										// to be reviewed
										{/* if (this.props.onResultClick) this.props.onResultClick() */}
									}}
									/>)
						})
					}
				</List>
			</div>
		)
	}
}

export default Search
