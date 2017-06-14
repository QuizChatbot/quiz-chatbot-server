import firebase, { firebaseAuth } from '../config/firebase.js';

var provider = new firebase.auth.FacebookAuthProvider();

export const handleLogin = (user) => {
firebaseAuth.signInWithPopup(provider).then(function (result) {
  // var token = result.credential.accessToken;
  this.setState({
    user: {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    },
    auth: true
  });
}.bind(this));
}