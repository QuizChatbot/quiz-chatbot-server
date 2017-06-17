import { ref } from '../../config/firebase'

export const getDeveloper = () =>
  new Promise((resolve, reject) => {
    let users = [];
    ref
      .child("Developer")
      .orderByChild("scores")
      .on('value', (snapshot) => {
        snapshot.forEach(function (child) {
          users.unshift({
            id: child,
            name: child.val().name,
            score: child.val().scores,
            grade: child.val().grades
          });
        })
        resolve({
          users
        });
      });
  })