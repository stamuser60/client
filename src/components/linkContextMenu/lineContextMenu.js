import React from 'react';
import PropTypes from 'prop-types'
import ContextMenuItem from '../contextMenu/contextMenuItem/contextMenuItem'
import deleteIcon from './delete.png'
import ContextMenu from '../contextMenu'

const LineContextMenu = props => {
  return (
    <ContextMenu
      visible={props.mode === 'EDIT' && props.contextDetails.visible}
      x={props.contextDetails.x}
      y={props.contextDetails.y}
      close={props.close}>
      <ContextMenuItem onClick={props.onRemoveLink} text={'מחק'} iconSrc={deleteIcon}/>
    </ContextMenu>
  );
}

LineContextMenu.propTypes = {
  mode: PropTypes.string,
  close: PropTypes.func,
  contextDetails: PropTypes.object,
  onRemoveLink: PropTypes.func,
}

export default LineContextMenu;