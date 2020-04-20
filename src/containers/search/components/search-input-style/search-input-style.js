import React from 'react'
import './search-input-style.scss'

const SearchInputStyle = props => <div className="search-input-style">
	<div className="input-container">
		{props.children}
	</div>
</div>

export default SearchInputStyle