import React, {Component} from 'react';

import _ from 'lodash';
import {Actions} from 'react-native-router-flux';

import {Image, StyleSheet, ListView, ScrollView, View, Text} from 'react-native';
import {
  getTheme,
  MKSpinner
} from 'react-native-material-kit';
const theme = getTheme();

import GeoFire from 'geofire';

import firebaseApp from '../config/firebase';
import FirebaseAuthenticator from '../utils/FirebaseAuthenticator';

import Post from '../components/Post';

export default class HomeScene extends Component {
  constructor(props) {
    super(props);

    this.databaseRef = firebaseApp.database().ref("posts").orderByChild('createdAt');

    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        r1 !== r2
      }
    });

    this.state = {
      dataSource: this.dataSource.cloneWithRows([]),
      posts: null,
      currentUser: FirebaseAuthenticator.currentUser(),
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  listenForItems(databaseRef) {
    databaseRef.on('value', (snap) => {
      var posts = [];
      snap.forEach((child) => {
        var data = child.val();
        data.key = child.key;

        posts.push(data);
      });

      posts = posts.reverse();

      this.setState({
        dataSource: this.dataSource.cloneWithRows(posts),
        posts: posts
      });

    });
  }

  addItem() {
    let text = "test";
    this.databaseRef.push({title: text})
  }

  componentDidMount() {
    console.info("componentDidMount - HomeScene");
    this.listenForItems(this.databaseRef);
  }

  addPost() {
    Actions.addPost();

    //var geoFireRef = firebaseApp.database().ref('posts_geo/');
    //var geoFire = new GeoFire(geoFireRef);
    //var query = geoFire.query({
    //  center: [pos.latitude, pos.longitude],
    //  radius: 10
    //}).on('key_entered', function (key, location, distance) {
    //  console.info(arguments);
    //  query.cancel();
    //});
  }

  likePost(postRef) {
    var postRef = firebaseApp.database().ref(`posts/${postRef.key}`);

    var uid = this.state.currentUser.uid;
    postRef.transaction((post) => {
      if (post) {
        if (post.likes && post.likes[uid]) {
          post.likeCount--;
          post.likes[uid] = null;
        } else {
          post.likeCount++;
          if (!post.likes) {
            post.likes = {};
          }

          post.likes[uid] = true;
        }
      }
      return post;
    });
  }

  renderPost(post) {
    return (<View key={post.key} style={{flex: 1}}>
      <Post post={post} likePost={this.likePost.bind(this)} />
    </View>);
  }

  postsLoading() {
    return (
      <View style={{flex: 1, alignItems: 'center'}}>
        <MKSpinner strokeWidth={2} style={{marginTop: 25, marginBottom: 25}}/>
        <Text>
          Fetching data, please wait.
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.posts === null && this.postsLoading() }

        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(post) => this.renderPost(post)}
        />
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fbfcfc',
    backgroundColor: '#fff',
    marginTop: 65,
  }
});
