import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Link, Redirect, Switch } from 'react-router-dom'
import { handleLogin, handleLogout, onStateChanged } from './helpers/handleAuth'
import Leaderboard from './components/leaderboard'
import AddQuiz from './components/protected/addQuiz'
import MyQuiz from './components/protected/myQuiz'
import EditQuiz from './components/protected/editQuiz'
import firebase, { ref } from './config/firebase'

const AUTH = {
  CHECKING: 'CHECKING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL'
}



function PrivateRoute({ component: Component, authed, authState, ...rest }) {
  console.log(authed);
  if (!authed) {
    console.log('redirect to root path')
  }
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

  // return (
  //   <Route
  //     {...rest}
  //     render={(props) => authed === true
  //       ? <Component {...props} />
  //       : <div>{'You need to sign on'}</div>}
  //       // : <Redirect to={{ pathname: '/', state: { from: props.location } }} />}
  //   />
  // )
}

function PublicRoute({ component: Component, authed, ...rest }) {
  if (!authed) {
    console.log('redirect to roote')
  }
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
  }

  componentWillMount() {
    console.log("willmount")
    console.log("currentUser:", firebase.auth().currentUser)
  }

  componentDidMount() {
    // onStateChanged(this);
    console.log("didmount")
    console.log("currentUser:", firebase.auth().currentUser)
    const _this = this
    this.removeListener = firebase.auth()
      .onAuthStateChanged((user) => {
        console.log("currentUser:", firebase.auth().currentUser)
        console.log(this.state.authed)
        console.log(_this.state.authed)
        if (user) {
          console.log("have user")
          _this.setState({
            user: {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            },
            authed: true,
            authState: AUTH.SUCCESS
          })

          console.log(this.state.authed)
          console.log(_this.state.authed)

        } else {
          console.log("don't have user")
          _this.setState({
            user: null,
            authed: false,
            authState: AUTH.FAIL
          })
        }

      });
  }

  componentWillUnmount() {
    this.removeListener()
  }

  render() {
    console.log('render')
    // if (this.state.authState === AUTH.CHECKING) {
    //   return <div> {'Loading...'} {this.state.authState} </div>
    // }
    return (
      <BrowserRouter>
        <div>
          <Link to="/">Leaderboard</Link><br />
          {!this.state.authed ? (
            <button onClick={() => { handleLogin(this) }}>Login{this.state.authed} </button>
          ) : (
              <div>
                <Link to="/myQuiz">My Quiz</Link><br />
                <Link to="/addQuiz">Add Quiz</Link><br />
                <span> name: {this.state.authed && this.state.user.displayName} </span><br />
                <button onClick={() => { handleLogout(this) }}>Log out</button>
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