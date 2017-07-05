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

  // it('should render Login button if renderLoginButton function is called', () => {
  //   const func = () => { return }
  //   const Wrapper = shallow(<renderLoginButton onLoginClick={func} />)
  //   //expect(Wrapper.text()).toEqual('Login with Facebook')
  //   expect(Wrapper.contains(<button>Login with Facebook</button>)).toEqual(true)
  // })

  // it('should render Logout button if renderLogoutButton function is called', () => {
  //   const func = () => { return }
  //   const Wrapper = shallow(<renderLogoutButton onLogoutClick={func} />)
  //   expect(Wrapper.contains(<button onClick={() => onLogoutClick()}>Logout</button>)).toEqual(true)
  // })

})