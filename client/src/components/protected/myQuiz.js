import React, { Component } from 'react'
import { getQuizzes } from '../../services/firebase/getQuizzes'

export default class MyQuiz extends Component {
  constructor() {
    super();
    this.state = {
      quizzes: []
    }
  }

  componentDidMount() {
    getQuizzes(this).then(this.setState.bind(this));
    // ref.child("Quests")
    //   .orderByChild("owner")
    //   .equalTo(firebase.auth().currentUser.uid)
    //   // .orderBy("lastEditAt")
    //   .on('value', (snapshot) => {
    //     let quizzes = [];
    //     snapshot.forEach(function (child) {
    //       quizzes.unshift({
    //         id: child.key,
    //         question: child.val().question,
    //         subject: child.val().subject,
    //         answer: child.val().answers[0],
    //         choice1: child.val().answers[1],
    //         choice2: child.val().answers[2]
    //       });
    //     })

    //     this.setState({
    //       quizzes: quizzes
    //     })
    //   });
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
                <button onClick={() => this.removeItem(quiz.id)}>Remove Quiz</button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}