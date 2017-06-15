import firebase, { ref } from '../../config/firebase'

export const createQuiz = (state) =>
  new Promise((resolve, reject) => {
    const item = {
      owner: firebase.auth().currentUser.uid,
      subject: state.state.subject,
      question: "```"+state.state.question+"```",
      answers: [state.state.answer, state.state.choice1, state.state.choice2],
      skills: "es6",
      point: 10
    }

    ref.child('Quests').push(item);
    alert("Complete");

    resolve({
      subject: '',
      question: '',
      answer: '',
      choice1: '',
      choice2: ''
    });
  })