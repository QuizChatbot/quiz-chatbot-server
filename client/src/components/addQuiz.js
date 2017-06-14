import React, { Component } from 'react'
import firebase, { ref } from '../config/firebase.js';

export class AddQuiz extends Component {

  constructor() {
    super();
    this.state = {
      owner: '',
      subject: '',
      question: '',
      answer: '',
      choice1: '',
      choice2: ''

    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = ref.child('Quests');
    const item = {
      subject: this.state.subject,
      question: this.state.question,
      answers: [this.state.answer, this.state.choice1, this.state.choice2],
      skills: "es6",
      point: 10
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        item.owner = user.uid;
      } else {
        item.owner = "anonymous";
      }
    });

    itemsRef.push(item);
    alert("Complete");

    this.setState({
      subject: '',
      question: '',
      answer: '',
      choice1: '',
      choice2: ''
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          Subject: <input type="text" name="subject" placeholder="subject" onChange={this.handleChange} value={this.state.subject} /><br />
          Question: <input type="text" name="question" placeholder="question" onChange={this.handleChange} value={this.state.question} /><br />
          Answer: <input type="text" name="answer" placeholder="answer" onChange={this.handleChange} value={this.state.answer} /><br />
          Choice1: <input type="text" name="choice1" placeholder="choice1" onChange={this.handleChange} value={this.state.choice1} /><br />
          Choice2: <input type="text" name="choice2" placeholder="choice2" onChange={this.handleChange} value={this.state.choice2} /><br />
          <button>Add Quiz</button>
        </form>
      </div>
    )
  }
}