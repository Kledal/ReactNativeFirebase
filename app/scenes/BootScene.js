import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {Actions} from 'react-native-router-flux';
import {MKSpinner} from 'react-native-material-kit';

import firebaseApp from '../config/firebase';

export default class BootScene extends Component {
  componentDidMount() {
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user) {
        console.info("User is now signed in..");
        this.goToHome();
      } else {
        console.info("User is no longer sign in..");
        this.goToLogin();
      }
    });
  }

  goToLogin() {
    Actions.login({type: 'reset'})
  }

  goToHome() {
    Actions.home({type: 'reset'});
  }

  render() {
    return (
      <View style={styles.container}>
        <MKSpinner strokeWidth={2} style={styles.spinner}/>
        <Text style={styles.loadingText}>
          Please wait...
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  loadingText: {
    marginTop: 25
  },
  spinner: {}
});
