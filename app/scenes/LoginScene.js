import React, {Component} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {Actions} from 'react-native-router-flux';

import {LoginButton} from 'react-native-fbsdk';
import {MKSpinner} from 'react-native-material-kit';

import firebaseApp from '../config/firebase';
import FirebaseAuthenticator from '../utils/FirebaseAuthenticator';

export default class LoginScene extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticating: false
    };
  }
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
  }

  onLoginFinished(error, result) {
    console.log(arguments);

    if (error) {
      console.log(error);
      return;
    }

    if (result.isCancelled) {
      alert('Login cancelled');
      return;
    }

    this.setState({authenticating: true});

    FirebaseAuthenticator.authenticateWithFacebookToken(() => {
    });
  }

  logout() {
    firebaseApp.auth().signOut();
  }

  goToHome() {
    Actions.home({type: 'reset', currentUser: firebaseApp.auth().currentUser});
  }

  render() {
    if (this.state.authenticating) {
      return <View style={styles.container}>
        <MKSpinner strokeWidth={2} style={styles.spinner}/>
      </View>
    };

    return (
      <View style={styles.container}>
        <LoginButton
          readPermissions={["public_profile", "email"]}
          onLoginFinished={
            (error, result) => {
              this.onLoginFinished(error, result)
            }
          }
          onLogoutFinished={() => this.logout() }/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

