import firebase from '../../config/firebase'
import { getQuizzes } from './getQuizzes'

export const deleteQuiz = (qid) =>
  new Promise((resolve, reject) => {
    const quizRef = firebase.database().ref(`/Quests/${qid}`);
    quizRef.remove();
    alert('Delete succeeded');
    getQuizzes().then((res) => resolve(res.quizzes))
  })