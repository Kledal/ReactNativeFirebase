import React, {Component} from 'react';
import {Scene, Router, Actions} from 'react-native-router-flux';

import LoginScene from './scenes/LoginScene';
import HomeScene from './scenes/HomeScene';
import AddPostScene from './scenes/AddPostScene';
import BootScene from './scenes/BootScene';
import SettingsScene from './scenes/SettingsScene';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="boot" initial={true} component={BootScene} hideNavBar />
          <Scene key="login" component={LoginScene} hideNavBar title="Login"/>
          <Scene key="home" leftTitle="Create" onLeft={() => Actions.addPost()} component={HomeScene} title="Welcome" rightTitle="Settings" onRight={() => { Actions.settings() }} />
          <Scene key="settings" title="Settings" direction="vertical" component={SettingsScene} editMode />

          <Scene key="addPost" editMode direction="vertical" component={AddPostScene}/>
        </Scene>
      </Router>
    );
  }
}
