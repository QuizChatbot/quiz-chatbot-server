import firebase, { ref } from '../../config/firebase'

export const getQuizzes = () =>
  new Promise((resolve, reject) => {
    ref.child("Quests")
      .orderByChild("owner")
      .equalTo(firebase.auth().currentUser.uid)
      // .orderBy("lastEditAt")
      .on('value', (snapshot) => {
        let quizzes = [];
        snapshot.forEach(function (child) {
          quizzes.unshift({
            id: child.key,
            question: child.val().question,
            subject: child.val().subject,
            answer: child.val().answers[0],
            choice1: child.val().answers[1],
            choice2: child.val().answers[2]
          });
        })

        resolve({
          quizzes
        });
      });
  }) 