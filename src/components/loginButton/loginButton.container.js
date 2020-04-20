import React from 'react';
import { connect } from 'react-redux'
import IdentifyButton from './loginButton.component'

const mapStateToProps = state => ({
  username: state.user.username,
})

class LoginButtonContainer extends React.Component {
  render() {
    return <IdentifyButton onClick={() => {
      window.location.replace(window.location.origin + '/identify')
    }} username={this.props.username}/>
  }
}

export default connect(mapStateToProps, undefined)(LoginButtonContainer);