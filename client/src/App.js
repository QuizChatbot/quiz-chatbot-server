import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import Leaderboard from './components/leaderboard'
import { AddQuiz } from './components/protected/addQuiz'
import { handleLogin, handleLogout, onStateChanged } from './helpers/handleAuth'

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
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
      isLoggedIn: false
    }
    onStateChanged(this);
  }

  render() {
    return (
      <Router>
        <div>
          <Link to="/">Leaderboard</Link><br />
          {
            this.state.isLoggedIn === false ? (
              <button onClick={() => {handleLogin(this)}}>Login</button>
            ) : (
              <div>
                <Link to="/addQuiz">Add Quiz</Link><br />
                <span> name: {this.state.isLoggedIn && this.state.user.displayName} </span><br />
                <button onClick={() => {handleLogout(this)}}>Log out</button>
              </div>
            )
          }
          
          <Route exact path="/" component={Leaderboard} />
          <PrivateRoute authed={this.state.isLoggedIn} path='/addQuiz' component={AddQuiz} />
          <Route render={() => <h3>No Match</h3>} />
        </div>
      </Router>
    );
  }
}