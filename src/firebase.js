import firebase from 'firebase/app'
import 'firebase/auth'

// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyD_g5fnlEH3j8ZZxPdUuYBre6r9FvKras8",
    authDomain: "curso-redux-72adb.firebaseapp.com",
    databaseURL: "https://curso-redux-72adb.firebaseio.com",
    projectId: "curso-redux-72adb",
    storageBucket: "curso-redux-72adb.appspot.com",
    messagingSenderId: "271354890191",
    appId: "1:271354890191:web:59a9f7c315fd03297134ba",
    measurementId: "G-MBXH4TYS2V"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  export function loginWithgoogle(){
      let provider = new firebase.auth.GoogleAuthProvider()
      return firebase.auth().signInWithPopup(provider)
      .then(snap=>snap.user)
  }

  export function signOutGoogle(){
    firebase.auth().signOut()
}