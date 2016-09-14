import React, {Component} from 'react';

import {
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
  Text
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import GeoFire from 'geofire';

// Camera stuff
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob'
const Blob = RNFetchBlob.polyfill.Blob;

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

import FirebaseAuthenticator from '../utils/FirebaseAuthenticator';
import firebaseApp from '../config/firebase';

import Button from '../components/Button';

import {
  getTheme,
  MKTextField,
  MKColor
} from 'react-native-material-kit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfcfc',
    marginTop: 65,
    padding: 5
  },

  textfield: {
    height: 28,  // have to do it on iOS
    marginTop: 32,
  },
});

const Textfield = MKTextField.textfield()
  .withPlaceholder('Text...')
  .withStyle(styles.textfield)
  .build();

export default class AddPostScene extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      uploadedPhoto: false,
      initialPosition: 'unknown'
    };

    this.currentUser = FirebaseAuthenticator.currentUser();
    this.photoUrl = null;
  }

  componentDidMount() {
    console.info("DidMount");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.info(position);
        this.setState({initialPosition: position});
      },
      (error) => alert(error),
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000}
    );
  }

  addPost() {
    var dbRef = firebaseApp.database().ref('posts/').push();

    var geoFireRef = firebaseApp.database().ref('posts_geo/');
    var geoFire = new GeoFire(geoFireRef);

    var pos = this.state.initialPosition.coords;
    console.info(pos);

    dbRef.set({
      title: this.state.text,
      likeCount: 0,
      itemPhotos: [this.photoUrl],
      createdBy: this.currentUser.uid,
      creatorName: this.currentUser.displayName,
      creatorPhoto: this.currentUser.photoURL,
      createdAt: Date.now(),
      lat: pos.latitude,
      lng: pos.longitude
    });

    geoFire.set(dbRef.key, [pos.latitude, pos.longitude]);

    Actions.pop();
  }

  saveAndUploadImage(uri) {
    let wrappedUrl = RNFetchBlob.wrap(uri);
    Blob
      .build(wrappedUrl, {type: 'image/jpeg;'})
      .then((blob) => {
        console.log("Start upload");

        firebaseApp.storage()
          .ref('test')
          .child(`test-${Date.now()}.jpg`)
          .put(blob, {contentType: 'image/png'})
          .then((snapshot) => {
            console.log("Done uploading");
            var url = snapshot.downloadURL;

            this.photoUrl = url;
            this.setState({uploadedPhoto: true});

            blob.close();
          });
      });
  }

  resizeImage(uri) {
    console.log("Resize image: " + uri);
    ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 100)
      .then((resizedImageUri) => {
        this.saveAndUploadImage(resizedImageUri);
      })
  }

  openCameraDialog() {
    var options = {
      title: 'Select photo',
      noData: true
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either data...
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        const uri = response.uri;
        const source = {uri: uri.replace('file://', ''), isStatic: true};
        this.resizeImage(uri.replace('file://', ''));

        this.setState({
          avatarSource: source
        });
      }
    });
  }

  render() {
    return <View style={styles.container}>
      {this.state.avatarSource && <Image style={{width: 50, height: 200}} source={this.state.avatarSource}/>}
      <TouchableOpacity onPress={() => this.openCameraDialog()}>
        <Text>Add picture
        </Text>
      </TouchableOpacity>

      <Textfield
        onTextChange={(text) => {
          this.setState({text})
        }}
      />

      <View style={{marginTop: 15}}>
        {this.state.uploadedPhoto && <Button onPress={() => this.addPost()}>
          ADD POST
        </Button>}
      </View>
    </View>;
  }
}

