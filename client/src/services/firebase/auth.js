import firebase, { firebaseAuth } from '../../config/firebase.js';
import { AUTH } from '../helpers/enum.js'

export function login() {
  let provider = new firebase.auth.FacebookAuthProvider();
  return firebaseAuth.signInWithPopup(provider).then(function (result) {
    // var token = result.credential.accessToken;
    let res = result.user;
    return {
      user: {
        uid: res.uid,
        email: res.email,
        displayName: res.displayName,
        photoURL: res.photoURL,
      },
      authed: true,
      authState: AUTH.SUCCESS
    };
  });
}

export function logout() {
  return firebaseAuth.signOut().then(function () {
    return {
      user: null,
      authed: false,
      authState: AUTH.FAIL
    };
  });
}

export function validateUser() {
  return new Promise((resolve, reject) => {
    return firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          authed: true,
          authState: AUTH.SUCCESS
        })
      } else {
        resolve({
          user: null,
          authed: false,
          authState: AUTH.FAIL
        })
      }
    });
  })
}