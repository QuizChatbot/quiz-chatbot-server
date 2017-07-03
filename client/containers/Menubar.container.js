
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import withFiredux from '../libs/withFiredux'

const AuthenInfomationComponent = withFiredux(({ firedux, authed, onLoginClick, onLogoutClick }) => {
  return (<div>
    <Link to="/">Leaderboard</Link><br />
    {!authed
      ? (<button onClick={() => onLoginClick()}>Login with Facebook</button>)
      : (<div>
        <span> name: {firedux.displayName} </span><br />
        <Link to="/myQuiz">My Quiz</Link><br />
        <button onClick={() => onLogoutClick()}>Logout</button>
      </div>)}
  </div>
  )
})

export default connect(
  (state) => ({
    authed: state.app.authed,
  })
)(AuthenInfomationComponent) 