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
    expect(Wrapper.contains(<Link to="/">Leaderboard</Link>)).toMatchSnapshot()
  })

  it('should render login button if authed is false', () => {
    const props = {
      auth: false
    }
    const Wrapper = shallow(<Menubar {...props} />)
    expect(Wrapper.contains('Login with Facebook')).toMatchSnapshot()
    expect(Wrapper.contains('Logout')).toMatchSnapshot()
  })

  it('should render user name and logout button if authed is true', () => {
    const props = {
      firedux: {
        displayName: "Xiao Jia Ying"
      },
      auth: true
    }
    const Wrapper = shallow(<Menubar {...props} />)
    expect(Wrapper.contains('Login with Facebook')).toMatchSnapshot()
    expect(Wrapper.contains('name: Xiao Jia Ying')).toMatchSnapshot()
    expect(Wrapper.contains('Logout')).toMatchSnapshot()
  })

  it('should render Login button if renderLoginButton function is called', () => {
    const func = () => { return }
    const Wrapper = shallow(<renderLoginButton onLoginClick={func} />)
    expect(Wrapper.contains(<button onClick={() => onLoginClick()}>Login with Facebook</button>)).toMatchSnapshot()
  })

  it('should render Logout button if renderLogoutButton function is called', () => {
    const func = () => { return }
    const Wrapper = shallow(<renderLogoutButton onLogoutClick={func} />)
    expect(Wrapper.contains(<button onClick={() => onLogoutClick()}>Logout</button>)).toMatchSnapshot()
  })

})