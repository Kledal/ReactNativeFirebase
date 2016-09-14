import * as firebase from 'firebase';

var firebaseConfig = {
  apiKey: "<API_KEY>",
  authDomain: "<PROJECT_ID>.firebaseapp.com",
  databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
  storageBucket: "<BUCKET>.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;
