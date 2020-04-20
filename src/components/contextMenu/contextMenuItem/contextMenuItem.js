import React from 'react';
import './contextMenuItem.scss';

const ContextMenuItem = props => {
  return (
    <div className={`ContextMenu--option context-menu-item-container ${props.disabled && 'disabled'}`} onClick={props.onClick}>
      <img className="icon" src={props.iconSrc} alt={'תמונה'}/>
      <div className="text">{props.text}</div>
    </div>
  );
}

export default ContextMenuItem;