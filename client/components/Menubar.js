import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'

export function renderLoginButton(onLoginClick) {
  return (<button onClick={() => onLoginClick()}>Login with Facebook</button>)
}

export function renderLogoutButton(onLogoutClick) {
  return (<button onClick={() => onLogoutClick()}>Logout</button>)
}

export class Menubar extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    const { firedux, authed, onLoginClick, onLogoutClick } = this.props
    return (<div>
      <Link to="/">Leaderboard</Link><br />
      {!authed
        ? (renderLoginButton(onLoginClick))
        : (<div>
          <span> name: {firedux.displayName} </span><br />
          <Link to="/myquiz">My Quiz</Link><br />
          {renderLogoutButton(onLogoutClick)}
        </div>)
      }
    </div>
    )
  }
}

Menubar.PropTypes = {
  firedux: PropTypes.object.isRequired,
  authed: PropTypes.bool.isRequired,
  onLoginClick: PropTypes.func,
  onLogoutClick: PropTypes.func
}

export default Menubar