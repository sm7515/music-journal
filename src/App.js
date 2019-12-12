import React from 'react';
import { Route, BrowserRouter as Router, Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import axios  from 'axios';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebase from "firebase/app";
import "firebase/auth";
import './firebaseui-styling.global.css';

import Login from './pages/Login'
import Feed from './pages/Feed'
import UserProfile from './pages/UserProfile'
import Navbar from './components/NavBar'
import Signup from './pages/Signup'
import Account from './components/Account'
import Archive from './components/Archive'
import Footer from './components/Footer'
import Users from './pages/Users'
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyDVkoaIkaTNQ2Cc1BRppDNoZXwqmZ4lKSY",
  authDomain: "final-proj-cb8cf.firebaseapp.com",
  databaseURL: "https://final-proj-cb8cf.firebaseio.com",
  projectId: "final-proj-cb8cf",
  storageBucket: "final-proj-cb8cf.appspot.com",
  messagingSenderId: "397252492401",
  appId: "1:397252492401:web:c314ce3bf303e65874afd0",
  measurementId: "G-ELC9RPNL7X"
};

const provider = new firebase.auth.GoogleAuthProvider();
// console.log(provider)
function App() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  let [initialized,setInitialized]=useState(false)
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: '/'
  };
  
  useEffect(() => {
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
      setInitialized(true);
      provider.setCustomParameters({
        prompt: 'select_account'
      });
    }

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  })

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        setUser(user);
        console.log(user)
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  function signUpFunction(e) {
    e.preventDefault();
    let email = e.currentTarget.signupEmail.value;
    let password = e.currentTarget.signupPassword.value;

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        // console.log(response.user);
        setLoggedIn(true);
        axios.post(`https://musicjournal-api.herokuapp.com/user`, {
          uid: response.user.uid,
          email: response.user.email
        })
          .then(res => {
            // console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        setError(errorMessage);
        console.log(errorCode, errorMessage);
      });
  }

  function loginFunction(e) {
    e.preventDefault();
    let email = e.currentTarget.loginEmail.value;
    let password = e.currentTarget.loginPassword.value;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
        setLoggedIn(true);
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        setError(errorMessage);
        console.log(errorCode, errorMessage);
      });
  }

  function logoutFunction() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        setLoggedIn(false);
        setUser({});
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        setError(errorMessage);
        console.log(errorCode, errorMessage);
      });
  }

  // console.log(loggedIn)

  return (
    <div className="App">
      {!loggedIn&&error!==""? 
          <span className="error">
            {error}
          </span>
          :""}
      <Navbar loggedin={loggedIn} logoutFunction={logoutFunction} user={user} app={firebase.apps.length && firebase.apps[0]}/>
      {initialized && !loggedIn && <StyledFirebaseAuth className="google-btn" uiConfig={uiConfig} firebaseAuth={firebase.auth()} uiCallback={ui => ui.disableAutoSignIn()} />}
      <Footer />
      <Router>
        <Route exact path='/' >
          {loggedIn ? <Feed user={user} /> : <Redirect to="/login" />}
        </Route>
        <Route exact path='/userprofile' >
          {loggedIn ? <UserProfile user={user} /> : <Redirect to="/login" />}
        </Route>
        <Route exact path='/userprofile/account' >
          {loggedIn ? <Account user={user} app={firebase.apps.length&&firebase.apps[0]}/> : <Redirect to="/login" />}
        </Route>
        <Route  exact  path='/userprofile/archive' >
          {loggedIn ? <Archive user={user}/>  : <Redirect to="/login" />}
        </Route>
        <Route path='/users/' >
          {loggedIn ? <Users /> : <Redirect to="/login" />}
        </Route>
        <Route path='/feed' >
          {loggedIn ? <Feed user={user}/> : <Redirect to="/login" />}
        </Route>
        <Route path='/login'>
          {loggedIn ? <Feed user={user} /> : <Login loginFunction={loginFunction} />}
        </Route>
        <Route path='/signup'>
          {loggedIn ? <Feed user={user} /> :<Signup signUpFunction={signUpFunction} />}
        </Route>
      </Router>

    </div>
  );
}

export default App;