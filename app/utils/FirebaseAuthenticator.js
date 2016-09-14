import {LoginManager, AccessToken} from 'react-native-fbsdk';
import firebaseApp from '../config/firebase';
const auth = firebase.auth();
const provider = firebase.auth.FacebookAuthProvider;

export default {
  writeUserData() {
    var user = firebaseApp.auth().currentUser;
    if (user === null) return;

    const {uid, displayName, email, photoURL} = user;
    firebase.database().ref('users/' + uid).set({
      email: email,
      name: displayName,
      profile_picture: photoURL,
      last_login: Date.now()
    });
  },

  authenticateWithFacebookToken(callback) {
    return AccessToken.getCurrentAccessToken()
      .then(accessTokenData => {
        const credential = provider.credential(accessTokenData.accessToken);
        return auth.signInWithCredential(credential);
      })
      .then(credData => {
        this.writeUserData();
        callback();
      });
  },

  currentUser() {
    return firebaseApp.auth().currentUser;
  },

  signOut() {
    LoginManager.logOut();
    firebaseApp.auth().signOut();
  }
}