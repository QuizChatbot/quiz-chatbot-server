import firebase, { ref } from '../../config/firebase'

export const deleteQuiz = (quizId) =>
  new Promise((resolve, reject) => {
    const quizRef = firebase.database().ref(`/Quests/${quizId}`);
    quizRef.remove();
    alert('Delete succeeded');
  })