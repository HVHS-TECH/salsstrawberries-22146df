console.log('%c fb_io.mjs', 'color: blue; background-color: white;');

//**************************************************************/
// Import all external constants & functions required
/**************************************************************/
// Import all the methods you want to call from the firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { query, orderByChild, limitToFirst, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";



//**************************************************************/
// Firebase Configuration
/**************************************************************/
const firebaseConfig = {
  apiKey: "AIzaSyA8viBZ-gKBknRREyTiDinnugjj6Rjrog0",
  authDomain: "comp-2025-dylan-f.firebaseapp.com",
  databaseURL: "https://comp-2025-dylan-f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "comp-2025-dylan-f",
  storageBucket: "comp-2025-dylan-f.firebasestorage.app",
  messagingSenderId: "133223974410",
  appId: "1:133223974410:web:d1cde3ac980749bde601f3",
  measurementId: "G-WHVZ7GW4CF"
};


// Initialize Firebase app globally
const FB_GAMEAPP = initializeApp(firebaseConfig);
const analytics = getAnalytics(FB_GAMEAPP);
const FB_GAMEDB = getDatabase(FB_GAMEAPP);
/************************************************************8 */
var currentUser = null;
var userId = null;
var userEmail = "";

export {
  fb_initialise,
  fb_login,
  fb_WriteRec,
  fb_ReadRec,
  writeEmail,
  TopFruitList,
};


/******************************************************/
// fb_initialise()
// Called by index.html on page load
// Initialise Firebase app
// Input: n/a
// Return: n/a
/******************************************************/
function fb_initialise() {
  console.log('%c fb_initialise(): ', 'color: ' + COL_C + '; background-color: ' + COL_B + ';');
  console.info(FB_GAMEDB);
}
/******************************************************/
// fb_login()
// Called by index.html on page load
// Log in to Firebase app
// Input: n/a
// Return: n/a
/******************************************************/
function fb_login() {
  TopFruitList();
  const AUTH = getAuth();
  const PROVIDER = new GoogleAuthProvider();
  PROVIDER.setCustomParameters({
    prompt: 'select_account'
  });
  signInWithPopup(AUTH, PROVIDER)
    .then((result) => {
      currentUser = result.user;
      userId = currentUser.uid;
      if (currentUser) {
        console.log("User Signed In", currentUser);
        document.getElementById('fbUsername').innerText = currentUser.displayName || "Unknown User";
      } else {
        console.warn("No user returned after sign-in.");
        document.getElementById('fbUsername').innerText = "Login worked with no data available";
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      document.getElementById('fbUsername').innerText = "The Login has failed";
    });
}


/******************************************************/
// fb_WriteRec
// Called by index.html on page load
// Write a record to the realtime database
// Input: n/a
// Return: n/a
/******************************************************/
function fb_WriteRec() {
  const NAME = document.getElementById("name").value.trim();
  const FAVOURITEFRUIT = document.getElementById("favoriteFruit").value.trim();
  const FRUITQUANTITY = document.getElementById("fruitQuantity").value.trim();


  if (!NAME || !FAVOURITEFRUIT || !FRUITQUANTITY) {
    alert("Please fill out all fields.");
    return;
  }



  const recordPath = "users/" + userId;
  const data = {
    name: NAME,
    favouritefruit: FAVOURITEFRUIT,
    fruitamount: FRUITQUANTITY
  };

  const DATAREF = ref(FB_GAMEDB, recordPath); // Create the reference
  set(DATAREF, data)
    .then(() => {
      console.log("Data Successfully written");
      document.getElementById("p_fbWriteRec").innerText = "Data written to " + recordPath;

    })
    .catch((error) => {
      console.error("Error writing data:", error);
      document.getElementById("p_fbWriteRec").innerText = "Failed to write to " + recordPath;

    });


    TopFruitList();
}



/******************************************************/
// fb_ReadRec
// Called by index.html on page load
// read a record on the realtime database
// Input: n/a
// Return: User Info
/******************************************************/
function fb_ReadRec() {
  const recordPath = "users/" + userId;
  const DATAREF = ref(FB_GAMEDB, recordPath); // Create the reference

  return get(DATAREF).then((snapshot) => {
    var userData = snapshot.val();
    if (userData != null) {
      console.log(userData)
      return (userData)
    } else {
      console.log("No data at " + recordPath)
    }
  }).catch((error) => {
    throw error
  });
}




/******************************************************/
// writeEmail
// Called by index.html on page load
// Write email customised to user
// Input: n/a
// Return: User Info
/******************************************************/
function writeEmail() {
  if (!currentUser) {
    alert("You must be logged in!");
  } else {
    fb_ReadRec().then((userData) => {
      userEmail = `
        <div style="background: #fff0f5; border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
          <p>Hey, ${userData.name},</p>
          <p>Thank you for taking part in our survey, here at Sal's Strawberry Saloon.</p>
          <p>Based on your answers, we will be sending you personalized packages including your favourite ${userData.favouritefruit}/s we heard you love!</p>
          <p>At the moment, we want to offer you a deal to get fresh ${userData.favouritefruit}/s ${userData.fruitamount}x a week!!</p>
          <p><em>The Sal’s Strawberry Saloon Team</em></p>
        </div>`;
      document.getElementById("theEmail").innerHTML = userEmail;
    }).catch((error) => {
      console.warn(error);
    });
  } 
}



/******************************************************/
// TopFruitList
// Called by index.html on page load
// Display the top fruits being requested
// Input: n/a
// Return: User Info
/******************************************************/

function TopFruitList() {
  console.log("TopFruitList() called");  // Check that function is triggered

  const USERS_REF = ref(FB_GAMEDB, "users/");
console.log("Attempting to access:", USERS_REF);

  onValue(USERS_REF, (snapshot) => {
  console.log("Snapshot received:", snapshot.val());

    const fruitCount = {};

    snapshot.forEach(child => {
      const userData = child.val();
      console.log("User data from DB:", userData);  // Log each user record

      const fruit = userData.favouritefruit;
      if (fruit) {
        fruitCount[fruit] = (fruitCount[fruit] || 0) + 1;
      }
    });

    console.log("Fruit count object:", fruitCount);  // Check counting worked

    const topFruits = Object.entries(fruitCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    console.log("Top fruits array:", topFruits);  // What are top fruits now?

    const list = document.getElementById("fruitsList");
    if (!list) {
      console.error("No element with id 'fruitsList' found!");
      return;
    }
    list.innerHTML = ""; 

    topFruits.forEach(([fruit, count]) => {
      console.log(`Adding list item: ${fruit} (${count})`); // What is being added?

      const li = document.createElement("li");
      li.textContent = `${fruit} (${count})`;
      list.appendChild(li);
    });

    console.log("Fruit list updated in DOM.");
  });
}
