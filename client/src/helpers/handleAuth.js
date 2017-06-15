import firebase, { firebaseAuth } from '../config/firebase.js';

var provider = new firebase.auth.FacebookAuthProvider();
export function handleLogin(state) {
  return firebaseAuth.signInWithPopup(provider).then(function (result) {
    // var token = result.credential.accessToken;
    state.setState({
      user: {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      },
      isLoggedIn: true
    });
  });
}

export function handleLogout(state) {
  return firebaseAuth.signOut().then(function () {
    state.setState({
      user: null,
      isLoggedIn: false
    });
  });
}

export function onStateChanged(state) {
  return firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      state.setState({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        isLoggedIn: true
      })
    } else {
      state.setState({
        user: null,
        isLoggedIn: false
      })
    }
  });
}