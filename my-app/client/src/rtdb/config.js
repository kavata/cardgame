
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { get, getDatabase, ref, set } from "firebase/database";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDzCibis46qL8A9CW5KaWya4fiR1p6z6fI",
  authDomain: "lovers-61c25.firebaseapp.com",
  databaseURL: "https://lovers-61c25-default-rtdb.firebaseio.com",
  projectId: "lovers-61c25",
  storageBucket: "lovers-61c25.appspot.com",
  messagingSenderId: "814502568820",
  appId: "1:814502568820:web:b5536ea2a71dd673620221",
  measurementId: "G-D60763D5KH"
};

const app = initializeApp(firebaseConfig);


// Constante pour realtime Database 
export const db = getDatabase(app);
//Constante pour authentification
export  const auth = getAuth(app);
export const  storage  = getStorage(app);









