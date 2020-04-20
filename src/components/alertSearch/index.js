import React from 'react'
import './alertSearch.scss'

const AlertSearch = (props) =>{
    return (
        <div className="alertSearch">
            <input className="searchInput" onChange={(event)=> {
                const {value} = event.target
                props.setFilter(value)
            }}/>
            <button className="searchIcon"><i className="fa fa-search"></i></button>
        </div>
    )
}

export default AlertSearch;