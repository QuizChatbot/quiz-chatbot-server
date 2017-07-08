import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'

const paperStyle = {
  width: '80%',
  display: 'table',
  padding: '10px',
  margin: 'auto'
}

const menuStyle = {
  width: '60%',
  display: 'table-cell',
  textAlign: 'left'
}

const loginStyle = {
  width: '40%',
  display: 'table-cell',
  textAlign: 'right'
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
      <div style={{ textAlign: 'center' }}>
        <Paper style={paperStyle} zDepth={1} rounded={false}>
          <div style={menuStyle}>
            <FlatButton
              label='LEADERBOARD'
              containerElement={<Link to='/' />}
              style={{ verticalAlign: 'bottom' }}
            />
            <FlatButton
              label='PLAY QUIZ'
              href='https://www.facebook.com/messages/t/122419575009686'
              target='_blank'
            />
            <FlatButton
              label='MY QUIZ'
              disabled={!authed}
              containerElement={<Link to='/myquiz' />}
              style={{ verticalAlign: 'bottom' }}
            />
          </div>
          {!authed
            ? <div style={loginStyle}>
              <LoginButton onLoginClick={onLoginClick} />
            </div>
            : <div style={loginStyle}>
              <Avatar
                src={firedux.photoURL}
                style={{
                  textAlign: 'center',
                  verticalAlign: 'bottom'
                }}
                />
              <span>{firedux.displayName} {' '}</span>
              <LogoutButton
                onLogoutClick={onLogoutClick}
                style={{ display: 'inline' }}
                />
            </div>}
        </Paper>
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
