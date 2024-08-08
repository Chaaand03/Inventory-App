// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQNd2VkQTi1Bfw4UiXdR_W91wtP7il9P4",
  authDomain: "inventory-app-ebf9b.firebaseapp.com",
  projectId: "inventory-app-ebf9b",
  storageBucket: "inventory-app-ebf9b.appspot.com",
  messagingSenderId: "727567072174",
  appId: "1:727567072174:web:5ff55604b837618a06e63f",
  measurementId: "G-7HMCFKWF2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const firestore = getFirestore(app);
export { firestore };
// const db = firebase.firestore();
