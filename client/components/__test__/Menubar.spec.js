import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { Menubar, renderLoginButton, renderLogoutButton } from '../Menubar'
import { Link } from 'react-router-dom'


describe('Menubar component test', () => {

  it('should always render leaderboard link', () => {
    const props = {
      firedux: {
        displayName: "Xiao Jia Ying"
      },
      auth: true
    }
    const Wrapper = shallow(<Menubar {...props} />)
    expect(Wrapper.contains(<Link to="/">Leaderboard</Link>)).toEqual(true)
  })

  it('should render login button if authed is false', () => {
    const props = {
      authed: false
    }
    const Wrapper = shallow(<Menubar {...props} />)
    expect(Wrapper.contains('Login with Facebook')).toEqual(true)
    expect(Wrapper.contains('Logout')).toEqual(false)
  })

  it('should render user name and logout button if authed is true', () => {
    const props = {
      firedux: {
        displayName: "Xiao Jia Ying"
      },
      authed: true
    }
    const authed = false
    const Wrapper = shallow(<Menubar {...props} />)
    expect(Wrapper.contains('Xiao Jia Ying')).toEqual(true)
    expect(Wrapper.contains('Logout')).toEqual(true)
  })

  // it('should render Login button if renderLoginButton function is called', () => {
  //   const func = () => { return }
  //   const Wrapper = shallow(<renderLoginButton onLoginClick={func} />)
  //   expect(Wrapper.contains(<button onClick={() => onLoginClick()}>Login with Facebook</button>)).toEqual(true)
  // })

  // it('should render Logout button if renderLogoutButton function is called', () => {
  //   const func = () => { return }
  //   const Wrapper = shallow(<renderLogoutButton onLogoutClick={func} />)
  //   expect(Wrapper.contains(<button onClick={() => onLogoutClick()}>Logout</button>)).toEqual(true)
  // })

})