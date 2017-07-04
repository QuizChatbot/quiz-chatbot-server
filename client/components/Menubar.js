import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'

export class Menubar extends Component {
  constructor(props, context) {
    super(props, context)
  }

  render() {
    return (<div>
      <Link to="/">Leaderboard</Link><br />
      {!this.props.authed
        ? (<button onClick={() => this.props.onLoginClick()}>Login with Facebook</button>)
        : (<div>
          <span> name: {this.props.firedux.displayName} </span><br />
          <Link to="/myquiz">My Quiz</Link><br />
          <button onClick={() => this.props.onLogoutClick()}>Logout</button>
        </div>)}
    </div>
    )
  }
}

Menubar.PropTypes = {
  firedux: PropTypes.object.isRequired,
  authed: PropTypes.bool.isRequired,
  onLoginClick: PropTypes.func.isRequired,
  onLogoutClick: PropTypes.func.isRequired
}

export default Menubar