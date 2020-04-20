import React from 'react';
import PropTypes from 'prop-types'
import ContextMenuItem from '../contextMenu/contextMenuItem/contextMenuItem'
import linkIcon from './addLink.png'
import familyIcon from './addChildFlow.png'
import deleteIcon from './delete.png'
import scissorsIcon from './cutNode.png'
import copyIcon from './copy.png'
import ContextMenu from '../contextMenu'
import PieChart from './pieChartGraphana.png'

const NodeContextMenu = props => {
  return (
    <React.Fragment>
      <ContextMenu
        visible={props.mode === 'EDIT' && props.nodeContextDetails.id}
        x={props.nodeContextDetails.x}
        y={props.nodeContextDetails.y}
        close={props.closeNodeContext}>
        <ContextMenuItem onClick={props.onConnectLink} text={'הוסף לינק'} iconSrc={linkIcon}/>
        <ContextMenuItem onClick={props.onAddChild} text={'צור מסלול בן'} iconSrc={familyIcon}/>
        <ContextMenuItem onClick={props.onDeleteNode} text={'מחק'} iconSrc={deleteIcon}/>
        <ContextMenuItem onClick={props.onCutNode} text={'גזור'} iconSrc={scissorsIcon}/>
        <ContextMenuItem onClick={props.onCopyNode} text={'העתק'} iconSrc={copyIcon}/>
      </ContextMenu>
      <ContextMenu
        visible={props.mode === 'EDIT' && props.backgroundContextDetails.visible && !props.nodeContextDetails.id}
        x={props.backgroundContextDetails.x}
        y={props.backgroundContextDetails.y}
        close={props.closeBackgroundContext}>
        <ContextMenuItem
          onClick={props.onPasteNode} text={'הדבק'} iconSrc={copyIcon}
          disabled={props.disabled}
        />
      </ContextMenu>
      <ContextMenu
        visible={props.mode === 'NORMAL' && props.nodeContextDetails.id}
        x={props.nodeContextDetails.x}
        y={props.nodeContextDetails.y}
        close={props.closeNodeContext}
      >
        <ContextMenuItem
          onClick={props.onDashboard} text={'Grafana'} iconSrc={PieChart}
          disabled={props.graphanaDisabled}
        />
      </ContextMenu>
    </React.Fragment>
  );
}

NodeContextMenu.propTypes = {
  mode: PropTypes.string,
  closeNodeContext: PropTypes.func,
  closeBackgroundContext: PropTypes.func,
  nodeContextDetails: PropTypes.object,
  backgroundContextDetails: PropTypes.object,
  onConnectLink: PropTypes.func,
  onAddChild: PropTypes.func,
  onDeleteNode: PropTypes.func,
  onCutNode: PropTypes.func,
  onCopyNode: PropTypes.func,
  onPasteNode: PropTypes.func,
  onDashboard: PropTypes.func,
  disabled: PropTypes.bool,
  graphanaDisabled: PropTypes.bool,
}

export default NodeContextMenu;