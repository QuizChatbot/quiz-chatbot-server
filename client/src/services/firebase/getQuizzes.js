import firebase, { ref } from '../../config/firebase'

export const getQuizzes = (snapshot) =>
  new Promise((resolve, reject) => {
    let quizzes = [];
    Object.keys(snapshot).map(function (objectKey, index) {
      var value = snapshot[objectKey];
      quizzes.unshift({
        id: objectKey,
        question: value.question,
        subject: value.subject,
        answer: value.answers[0],
        choice1: value.answers[1],
        choice2: value.answers[2]
      });
    });
    resolve({
      quizzes
    });
  })