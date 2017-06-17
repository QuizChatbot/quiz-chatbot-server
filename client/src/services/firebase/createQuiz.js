import firebase, { ref } from '../../config/firebase'

export const createQuiz = (state) =>
  new Promise((resolve, reject) => {
    const item = {
      owner: firebase.auth().currentUser.uid,
      subject: state.subject,
      question: "```" + state.question + "```",
      answers: [state.answer, state.choice1, state.choice2],
      skills: "es6",
      point: 10,
      createAt: Date(),
      lastEditAt: Date()
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