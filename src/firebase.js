import firebase from "firebase";

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyDeFcxHsLwxLcDuL09AB-5wt3joaZGLrYI",
    authDomain: "instagram-clone-react-303c4.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-303c4.firebaseio.com",
    projectId: "instagram-clone-react-303c4",
    storageBucket: "instagram-clone-react-303c4.appspot.com",
    messagingSenderId: "938864344539",
    appId: "1:938864344539:web:b1c0a1e88099fe7caffbfe",
    measurementId: "G-HPF6C70W09"
});

const db=firebase.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export {db,auth,storage};
//way to set up firebase