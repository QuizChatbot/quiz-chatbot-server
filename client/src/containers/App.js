import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Leaderboard from './Leaderboard.container'
import Menubar from './Menubar.container'
import MyQuiz from './MyQuiz.container'
import Page404 from './404.container'
import * as QuizActions from '../actions'

function PrivateRoute ({ component: Component, authed }) {
  return (
    <Route
      render={props =>
        (authed === true
          ? <Component {...props} />
          : <Redirect
            to={{ pathname: '/', state: { from: props.location } }}
            />)}
    />
  )
}

class App extends Component {
  constructor () {
    super()
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount () {
    this.props.actions.init()
  }

  handleLogin = () => this.props.actions.login()

  handleLogout = () => this.props.actions.logout()

  render () {
    return (
      <BrowserRouter>
        <div>
          <Menubar
            onLoginClick={this.handleLogin}
            onLogoutClick={this.handleLogout}
          />
          <Switch>
            <Route
              exact
              path='/'
              component={props => <Leaderboard {...props} />}
            />
            <PrivateRoute
              authed={this.props.authed}
              path='/myquiz'
              component={props => <MyQuiz {...props} />}
            />
            <Route render={() => <Page404 />} />
          </Switch>
        </div>
      </BrowserRouter>
    )
  }
}
export default connect(
  state => ({
    authed: state.app.authed
  }),
  dispatch => {
    return { actions: bindActionCreators(QuizActions, dispatch) }
  }
)(App)
