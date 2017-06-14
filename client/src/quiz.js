import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { ref } from './config/firebase.js';
import { Line } from 'rc-progress';

class App extends Component {

  constructor() {
    super();
    this.state = { users: [] }
  }

  componentDidMount() {
    ref.child("Developer").on('value', (snapshot) => {
      let developer = snapshot.val();
      let newState = [];
      for (let user in developer) {
        newState.push({
          id: user,
          name: developer[user].name,
          score: developer[user].scores,
          grade: developer[user].grades
        });
      }

      var sortByScore = newState.slice(0);
      sortByScore.sort(function (a, b) {
        return b.score - a.score;
      });

      this.setState({
        users: sortByScore
      });

    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>  </h2>
        </div>

        <div className="wrapper">
          <ul>
            {this.state.users.map((user, idx) => {
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
            })}
          </ul>
        </div>

      </div>
    );
  }
}

export default App;
