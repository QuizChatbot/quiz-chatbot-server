import React, { Component } from 'react'
import { getQuizzes } from '../../services/firebase/getQuizzes'
import { deleteQuiz } from '../../services/firebase/deleteQuiz'
import firebase, { ref } from '../../config/firebase'

export default class MyQuiz extends Component {
  constructor() {
    super();
    this.state = {
      quizzes: []
    }
  }

  componentDidMount() {
    ref.child("Quests")
      .orderByChild("owner")
      .equalTo(firebase.auth().currentUser.uid)
      // .orderBy("lastEditAt")
      .on('value', (snapshot) => {
        getQuizzes(snapshot.val(), this).then(this.setState.bind(this));
      })
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.quizzes.map((quiz) => {
            return (
              <li key={quiz.id}>
                <h3>subject: {quiz.subject}</h3>
                <p>question: {quiz.question}</p>
                <p>answer: {quiz.answer}</p>
                <p>choice1: {quiz.choice1}</p>
                <p>choice2: {quiz.choice2}</p>
                <button onClick={() => deleteQuiz(quiz.id)}>Remove Quiz</button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}