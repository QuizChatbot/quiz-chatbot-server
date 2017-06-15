import { ref } from '../../config/firebase'

export const getDeveloper = () =>
  new Promise((resolve, reject) => {

    ref.child("Developer").orderByChild("scores").on('value', (snapshot) => {
      let users = [];
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