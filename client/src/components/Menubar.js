import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'

const style = {
  textAlign: 'center',
  display: 'inline-block'
}

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
        <Paper style={style} zDepth={1} rounded={false}>

          <FlatButton label='LEADERBOARD' containerElement={<Link to='/' />} />
          <FlatButton
            style={{ verticalAlign: 'top' }}
            label='PLAY QUIZ'
            href='https://www.facebook.com/messages/t/122419575009686'
            target='_blank'
          />
          <FlatButton
            label='MY QUIZ'
            disabled={!authed}
            containerElement={<Link to='/myquiz' />}
          />
        </Paper>
        {!authed
          ? <LoginButton onLoginClick={onLoginClick} />
          : <div>
            <span>name: {firedux.displayName}</span>
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
