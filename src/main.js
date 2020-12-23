import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap';
import '../node_modules/bootswatch/dist/lux/bootstrap.min.css';
import 'jquery';
import 'popper.js';
import firebase from 'firebase';
import store from './store'

var firebaseConfig = {
  apiKey: "AIzaSyD2aNn0OjqFGI70pXc8fFyPdM9Zf-SeAw8",
  authDomain: "triviamaster-44843.firebaseapp.com",
  projectId: "triviamaster-44843",
  storageBucket: "triviamaster-44843.appspot.com",
  messagingSenderId: "192058503293",
  appId: "1:192058503293:web:8ea3099564f722cc520114",
  measurementId: "G-EJRGTZ6WCS",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    store.commit('updatedUser', {user});
  }
  createApp(App).use(store).use(router).mount('#app')
});


