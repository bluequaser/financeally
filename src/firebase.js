import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqHV9gYB6ur48p2kkzKqmcBpCPzOxk_4c",
  authDomain: "finance-ally.firebaseapp.com",
  projectId: "finance-ally",
  storageBucket: "finance-ally.appspot.com",
  messagingSenderId: "580716954060",
  appId: "1:580716954060:web:0aaa9abfa1ad46dd2c1d69",
  measurementId: "G-5P39CRD7GL"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}