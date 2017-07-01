import React, { Component, PropTypes } from 'react'
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Leaderboard from './Leaderboard.container'
import Menubar from './Menubar.container'
import MyQuiz from './MyQuiz.container'
import Page404 from './404.container'
import * as QuizActions from '../actions'

class App extends Component {
  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  componentDidMount() {
    this.props.actions.init()
  }

  handleLogin() {
    this.props.actions.login()
  }

  handleLogout() {
    this.props.actions.logout()
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Menubar onLoginClick={this.handleLogin} onLogoutClick={this.handleLogout} />
          <Switch>
            <Route exact path="/"
              component={(props) => <Leaderboard {...props} />} />
            <Route exact path="/myQuiz"
              component={(props) => <MyQuiz {...props} />} />
            <Route render={() => <Page404 />} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
export default connect(
  null,
  (dispatch) => {
    return { actions: bindActionCreators(QuizActions, dispatch) }
  }
)(App)
