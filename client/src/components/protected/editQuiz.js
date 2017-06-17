import React, { Component } from 'react'
import firebase, { ref } from '../../config/firebase'
import { editQuiz } from '../../services/firebase/createQuiz'

var quizId
export const getQuizId = (qId) => {
  quizId = qId
console.log(quizId)
}

export default class EditQuiz extends Component {
  constructor() {
    super();
    this.state = {
      quizId: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    ref.child("Quests/"+this.state.quizId)
      .on('value', (snapshot) => {
        console.log(snapshot.val());
      })
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    // createQuiz(this).then(this.setState.bind(this));
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          Subject: <input type="text" name="subject" onChange={this.handleChange} value={this.state.subject} /><br />
          Question: <input type="text" name="question" onChange={this.handleChange} value={this.state.question} /><br />
          Answer: <input type="text" name="answer" onChange={this.handleChange} value={this.state.answer} /><br />
          Choice1: <input type="text" name="choice1" onChange={this.handleChange} value={this.state.choice1} /><br />
          Choice2: <input type="text" name="choice2" onChange={this.handleChange} value={this.state.choice2} /><br />
          <button>Add Quiz</button>
        </form>
      </div>
    )
  }
}