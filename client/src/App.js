import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
import { login, logout, validateUser } from './services/firebase/auth'
import Leaderboard from './components/leaderboard'
import AddQuiz from './components/protected/addQuiz'
import MyQuiz from './components/protected/myQuiz'
import EditQuiz from './components/protected/editQuiz'
import { AUTH } from './services/helpers/enum.js'

function PrivateRoute({ component: Component, authed, authState, ...rest }) {
  return (
    <Route
      {...rest}
      render={function (props) {
        switch (authState) {
          case AUTH.CHECKING: {
            return <div> {'Verifying session'}</div>
          }
          case AUTH.SUCCESS: {
            return <Component {...props} />
          }
          case AUTH.FAIL: {
            return <div>{'Need to signin'}</div>
          }
          default: return <div />
        }
      }}
    />
  )
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/' />}
    />
  )
}

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      authed: false,
      authState: AUTH.CHECKING,
    }

    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    validateUser().then((res) => this.setState(res));
  }

  componentWillUnmount() {
    // this.removeListener()
  }

  handleLogin() {
    login().then((res) => this.setState(res));
  }

  handleLogout() {
    logout().then((res) => this.setState(res));
  }

  render() {
    // if (this.state.authState === AUTH.CHECKING) {
    //   return <div> {'Loading...'} {this.state.authState} </div>
    // }
    return (
      <BrowserRouter>
        <div>
          <Link to="/">Leaderboard</Link><br />
          {!this.state.authed ? (
            <button onClick={this.handleLogin}>Login{this.state.authed} </button>
          ) : (
              <div>
                <Link to="/myQuiz">My Quiz</Link><br />
                <Link to="/addQuiz">Add Quiz</Link><br />
                <span> name: {this.state.authed && this.state.user.displayName} </span><br />
                <button onClick={this.handleLogout}>Log out</button>
              </div>
            )
          }
          <Switch>
            <Route exact path="/" component={Leaderboard} />
            <PrivateRoute
              authState={this.state.authState}
              authed={this.state.authed} path='/addQuiz'
              component={AddQuiz} />
            <PrivateRoute
              authState={this.state.authState}
              authed={this.state.authed}
              path='/myQuiz'
              component={MyQuiz} />
            <PrivateRoute
              authState={this.state.authState}
              authed={this.state.authed}
              path='/editQuiz'
              component={EditQuiz} />
            <Route render={() => <h3>No Match</h3>} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}