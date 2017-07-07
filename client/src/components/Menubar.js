import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'

export const LoginButton = ({ onLoginClick }) => (
  <RaisedButton label='Login with Facebook' primary onTouchTap={onLoginClick} />
)

export const LogoutButton = ({ onLogoutClick }) => (
  <RaisedButton label='Logout' primary onTouchTap={onLogoutClick} />
)

export class Menubar extends Component {
  render () {
    const { firedux, authed, onLoginClick, onLogoutClick } = this.props
    return (
      <div>
        <Link to='/'>Leaderboard</Link><br />
        <a
          href='https://www.facebook.com/messages/t/122419575009686'
          target='_blank'
          rel='noopener noreferrer'
        >
          Play Quiz
        </a>
        <br />
        {!authed
          ? <LoginButton onLoginClick={onLoginClick} />
          : <div>
            <span>name: {firedux.displayName}</span>
            <br />
            <Link to='/myquiz'>My Quiz</Link><br />
            <LogoutButton onLogoutClick={onLogoutClick} />
          </div>}
      </div>
    )
  }
}

Menubar.PropTypes = {
  firedux: PropTypes.object,
  authed: PropTypes.bool,
  onLoginClick: PropTypes.func,
  onLogoutClick: PropTypes.func
}

export default Menubar
