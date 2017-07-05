import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { Menubar, LoginButton, LogoutButton } from '../Menubar'
import { Link } from 'react-router-dom'

describe('Menubar component test', () => {

  it('should always render leaderboard link', () => {
    const Wrapper = shallow(<Menubar />)
    expect(Wrapper.contains(<Link to="/">Leaderboard</Link>)).toEqual(true)
  })

  it('should render login button if authed is false', () => {
    const props = {
      authed: false
    }
    const Wrapper = shallow(<Menubar {...props} />)
    expect(Wrapper.contains(<LoginButton onLoginClick={undefined} />)).toEqual(true)
    expect(Wrapper.contains(<LogoutButton onLogoutClick={undefined} />)).toEqual(false)
  })

  it('should render user name and logout button if authed is true', () => {
    const props = {
      firedux: {
        displayName: "Xiao Jia Ying"
      },
      authed: true
    }
    const Wrapper = shallow(<Menubar {...props} />)
    expect(Wrapper.contains(<span>name: Xiao Jia Ying</span>)).toEqual(true)
    expect(Wrapper.contains(<LogoutButton onLogoutClick={undefined} />)).toEqual(true)
  })

  it('LoginButton should render login button', () => {
    const onLoginClick = () => { }
    const Wrapper = shallow(<LoginButton onLoginClick={onLoginClick} />)
    expect(Wrapper.contains('Login with Facebook')).toEqual(true)
    expect(Wrapper.find('button')).toHaveLength(1)
    expect(Wrapper.contains(<button onClick={onLoginClick}>Login with Facebook</button>)).toEqual(true)
  })

  it('LogoutButton should render Logout button', () => {
    const onLogoutClick = () => { }
    const Wrapper = shallow(<LogoutButton onLogoutClick={onLogoutClick} />)
    expect(Wrapper.contains('Logout')).toEqual(true)
    expect(Wrapper.find('button')).toHaveLength(1)
    expect(Wrapper.contains(<button onClick={onLogoutClick}>Logout</button>)).toEqual(true)
  })

})