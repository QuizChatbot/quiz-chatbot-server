import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import Leaderboard from './components/leaderboard'
import { AddQuiz } from './components/addQuiz'
import firebase, { firebaseAuth } from './config/firebase.js'

import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap'
import ReactDOM from 'react-dom'

// import { handleLogout } from './helpers/handleLogout'
// import { handleLogin } from './helpers/handleLogin'

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      auth: null
    }
    this.loginWithFacebook = this.loginWithFacebook.bind(this);
    this.logOut = this.logOut.bind(this);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          auth: true
        })
      } else {
        this.setState({
          user: null,
          auth: false
        })
      }

    });

  }

  loginWithFacebook() {
    // firebaseAuth().onAuthStateChanged((user) =>
    //   handleLogin(user).then(this.setState.bind(this))
    // );
    var provider = new firebase.auth.FacebookAuthProvider();
    firebaseAuth.signInWithPopup(provider).then(function (result) {
      // var token = result.credential.accessToken;
      this.setState({
        user: {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        },
        auth: true
      });
    }.bind(this));
  }

  logOut() {
    // firebaseAuth().onAuthStateChanged((user) =>
    // handleLogout().then(this.setState.bind(this))
    // );
    firebaseAuth.signOut().then(function () {
      this.setState({
        user: null,
        auth: false
      });
    }.bind(this));
  }

  render() {
    return (
      <Router>
        <div>
        
          <Navbar inverse collapseOnSelect>

            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">Quiz Chatbot</a>
              </Navbar.Brand>
            </Navbar.Header>

            <Nav>
              <NavItem href="/">Leaderboard</NavItem>

              {
                this.state.auth === false ? (
                  <Nav>
                    <NavItem onClick={this.loginWithFacebook}>Login with Facebook</NavItem>
                  </Nav>
                )
                :
                (
                  <Nav pullRight="true">
                    <NavItem href="/addQuiz">Add Quiz</NavItem>
                    <NavDropdown title={this.state.auth && this.state.user.displayName} id="nav-dropdown">
                      <MenuItem eventKey={3.1}>Profile</MenuItem>
                      <MenuItem divider />
                      <MenuItem eventKey={3.2}>Log out</MenuItem>
                    </NavDropdown>
                  </Nav>
                )
              }

            </Nav>
          </Navbar>

          <Route exact path="/" component={Leaderboard} />
          <Route path="/addQuiz" component={AddQuiz} />
        </div>
      </Router>
    );
  }
}