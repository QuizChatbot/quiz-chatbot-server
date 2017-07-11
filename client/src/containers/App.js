import React, { Component } from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Leaderboard from './Leaderboard.container'
import Menubar from './Menubar.container'
import Footer from '../components/Footer'
import MyQuiz from './MyQuiz.container'
import Page404 from './404.container'
import * as QuizActions from '../actions'

// Theme
import { deepOrange500 } from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

// Font
import 'typeface-roboto'

// Click handler
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

// Styles
const styles = {
  container: {
    textAlign: 'center'
    // paddingTop: 200
  }
}

// Theme
const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
})

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
      <MuiThemeProvider muiTheme={muiTheme}>
        <BrowserRouter>
          <div style={styles.container}>
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
            <br />
            <Footer />
          </div>
        </BrowserRouter>
      </MuiThemeProvider>
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
