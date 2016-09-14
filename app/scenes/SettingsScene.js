import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';

import FirebaseAuthenticator from '../utils/FirebaseAuthenticator';
import Button from '../components/Button';

export default class SettingsScene extends Component {
  signOut() {
    FirebaseAuthenticator.signOut();
  }

  render() {
    return (
      <View style={styles.container}>
          <Button backgroundColor={'#e74c3c'} onPress={() => this.signOut()}>
            Logout
          </Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfcfc',
    marginTop: 65,
    padding: 5
  },

  loadingText: {
    marginTop: 25
  },
});
