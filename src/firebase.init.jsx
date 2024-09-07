// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAZ8OISgciW_r_xYyLCRbWLrwYUmyzbHQ",
  authDomain: "taskify088.firebaseapp.com",
  projectId: "taskify088",
  storageBucket: "taskify088.appspot.com",
  messagingSenderId: "361228263834",
  appId: "1:361228263834:web:784ba5f29f0a4283799a23",
  measurementId: "G-RZTWBQC93B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;