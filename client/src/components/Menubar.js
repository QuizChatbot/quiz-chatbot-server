import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import NevigationMenu from 'material-ui/svg-icons/navigation/menu'

const PaperMenu = styled(Paper)`
  width:100%;
  max-width: 1024px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  margin: auto;
  position: relative;
  padding: 10px 10px;
  @media screen and (max-width: 760px){ 
    padding: 10px;

  }
`
const MenuContainer = styled.div`
  flex: 1 0 auto;
  @media screen and (max-width: 760px){
    display: ${props => (props.visible ? 'flex' : 'none')};
    position: absolute;
    background:white;
    flex-direction:column;
    bottom:-20px;
    width:100%;
    z-index:9;
    transform: translateY(100%);
  }
`
const LoginContainer = styled.div`
  flex: 0 1 auto;
`
const Hamberger = styled.div`
  display: none;
  @media screen and (max-width: 760px) {
    display: block;
  }
`
export const LoginButton = ({ onLoginClick }) => (
  <RaisedButton label='Login with Facebook' primary onTouchTap={onLoginClick} />
)

export const LogoutButton = ({ onLogoutClick }) => (
  <RaisedButton label='Logout' primary onTouchTap={onLogoutClick} />
)

export class Menubar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isShowMenu: false
    }
  }
  render () {
    const { firedux, authed, onLoginClick, onLogoutClick } = this.props
    const unshowMenu = () =>
      setTimeout(() => {
        this.setState({ isShowMenu: false })
      }, 300)

    return (
      <div style={{ textAlign: 'center' }}>
        <PaperMenu zDepth={1} rounded={false}>
          <Hamberger
            onClick={() =>
              this.setState({ isShowMenu: !this.state.isShowMenu })}
          >
            <IconButton>
              <NevigationMenu />
            </IconButton>
          </Hamberger>
          <MenuContainer visible={this.state.isShowMenu}>
            <FlatButton
              containerElement={<Link to='/' />}
              label='LEADERBOARD'
              rippleColor='black'
              onTouchTap={unshowMenu}
              style={{ verticalAlign: 'bottom' }}
            />
            <FlatButton
              label='PLAY QUIZ'
              rippleColor='cyan'
              onTouchTap={unshowMenu}
              href='https://www.facebook.com/messages/t/122419575009686'
              target='_blank'
            />
            <FlatButton
              containerElement={<Link to='/myquiz' />}
              label='MY QUIZ'
              rippleColor='black'
              disabled={!authed}
              onTouchTap={unshowMenu}
              style={{ verticalAlign: 'bottom' }}
            />
          </MenuContainer>
          {!authed
            ? <LoginContainer>
              <LoginButton onLoginClick={onLoginClick} />
            </LoginContainer>
            : <LoginContainer>
              <Avatar
                src={firedux.photoURL}
                style={{
                  textAlign: 'center',
                  verticalAlign: 'bottom'
                }}
                />
              <span>{' '}{firedux.displayName}{' '}</span>
              <LogoutButton
                onLogoutClick={onLogoutClick}
                style={{ display: 'inline' }}
                />
            </LoginContainer>}
        </PaperMenu>
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
