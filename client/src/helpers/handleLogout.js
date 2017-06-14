import { firebaseAuth } from '../config/firebase.js';

export const handleLogout = () =>
  new Promise((resolve, reject) => {
    firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        firebaseAuth.signOut().then(function () {
          resolve({
            user: null,
            auth: false
          });
        });
      }
    });
  })