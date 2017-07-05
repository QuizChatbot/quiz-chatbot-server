import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'

export const LoginButton = ({ onLoginClick }) => (
  <button onClick={() => onLoginClick()}>Login with Facebook</button>
)

export const LogoutButton = ({ onLogoutClick }) => (
  <button onClick={() => onLogoutClick()}>Logout</button>
)

export class Menubar extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { firedux, authed, onLoginClick, onLogoutClick } = this.props
    return (<div>
      <Link to="/">Leaderboard</Link><br />
      <a href="https://www.facebook.com/messages/t/122419575009686" target="_blank">Play Quiz</a>
      {!authed
        ? <LoginButton onLoginClick={onLoginClick} />
        : (<div>
          <span>name: {firedux.displayName}</span>
          <br />
          <Link to="/myquiz">My Quiz</Link><br />
          <LogoutButton onLogoutClick={onLogoutClick} />
        </div>)
      }
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