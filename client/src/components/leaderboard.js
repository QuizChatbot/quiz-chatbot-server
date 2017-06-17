import React, { Component } from 'react';
import logo from '../logo.svg';
import '../App.css';
import { Line } from 'rc-progress';
import { getDeveloper } from '../services/firebase/getDeveloper'

export default class Leaderboard extends Component {
  constructor() {
    super();
    this.state = {
      users: []
    }
  }

  componentDidMount() {
    getDeveloper().then(this.setState.bind(this));
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Chatbot Quiz - Leaderboard 2017</h2>
        </div>
        <div className="wrapper">
          <ul>
            {
              this.state.users.map((user, idx) => {
                return (
                  <div key={idx} style={{ width: "50%" }}>
                    <h2>
                      <div >
                        {idx + 1} {user.name} ES6 {user.grade} ( score : {user.score + ""} )
                        <Line percent={user.score} strokeWidth="4" strokeColor="#03a9f4" trailWidth="4" />
                      </div>
                    </h2>
                  </div>
                )
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}