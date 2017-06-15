import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Leaderboard from './components/leaderboard'
import { AddQuiz } from './components/addQuiz'
import { handleLogin, handleLogout, onStateChanged } from './helpers/handleAuth'

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      user: null,
      auth: false
    }
    onStateChanged(this);
  }

  render() {
    return (
      <Router>
        <div>
          <Link to="/">Leaderboard</Link><br />
          {
            this.state.auth === false ? (
              <button onClick={() => {handleLogin(this)}}>Login</button>
            ) : (
              <div>
                <Link to="/addQuiz">Add Quiz</Link><br />
                <span> name: {this.state.auth && this.state.user.displayName} </span><br />
                <button onClick={() => {handleLogout(this)}}>Log out</button>
              </div>
            )
          }
          <Route exact path="/" component={Leaderboard} />
          <Route path="/addQuiz" component={AddQuiz} />
        </div>
      </Router>
    );
  }
}