const express = require('express');
const router = express.Router();

const firebase = require('firebase');
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
const firebaseapp = firebase.initializeApp(firebaseConfig);
const db = firebaseapp.firestore();

router.post('/', (req, res) => {
    const date = new Date();
    // console.log(req.body);
    const uid=req.body.user.uid;
    const userEmail=req.body.user.email;
    let userName="";
    const postContent=req.body.postContent;
    const track=req.body.track;
    let profileimage="";

    db.collection('users').doc(uid).get()
        .then(doc => {
            if (doc.exists) {
                // console.log("Document data:", doc.data());
                profileimage = doc.data().profileimage;
                userName=doc.data().username;
                // console.log(profileimage)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        })
        .catch(err=>{
            console.log(err)
        })
    
    setTimeout(() => {
        db.collection("music-posts").doc().set({
            user: { uid:uid,email: userEmail, username: userName, profileimage: profileimage },
            postContent: postContent,
            track: track,
            postDate: date
        })
            .then(() => {
                console.log("post success!")
                res.send("success");
            })
            .catch(function (error) {
                console.log("post error:", error)
                res.send("Error adding document: ", error);
            });
    }, 500);
    db.collection("users").doc(uid).update({
        posts: [{
            postContent: postContent,
            track: track,
            postDate: date
        }]
    })
        .then(() => {
            console.log("update success!")
        })
        .catch(function (error) {
            console.log("update error:", error)
        });

});

module.exports = router;
module.exports.firebaseapp = firebaseapp;