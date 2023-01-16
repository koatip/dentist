import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
// Készítsd el a saját config.js fájlodat a config.example.js fájl alapján
import firebaseConfig from "./firebase/config";
import {services} from "./firebase/utils";

import Fakerator from "fakerator";

const fakerator = Fakerator("hu-HU");

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

firebase
  .auth()
  .signInAnonymously()
  .then(() => {
    console.log("signed in");
  })
  .catch((error) => {
    console.error(error);
  });

firebase.auth().onAuthStateChanged(async (user) => {
  const promises = [];

  if (user) {
    for (let index = 0; index <= 10; index++) {
      const generatedUser = fakerator.entity.user();
      const appointment = {
        fullName: `${generatedUser.lastName} ${generatedUser.firstName}`,
        email: generatedUser.email,
        service: services[generateRandomInt(0, 2)],
        isUrgent: generateRandomInt(0, 1) !== 0,
        appointment: generateRandomDate(),
        isDeleted: false
      };

      const writePromise = db
        .collection("dentist")
        .doc()
        .set(appointment)
        .then(() => {
          console.log("Document written");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
      promises.push(writePromise);
    }

    Promise.all(promises).then(() => {
      process.exit(0);
    });
  }
});

function generateRandomInt(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateRandomDate() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + generateRandomInt(1,7));
  const hour = generateRandomInt(9,18);
  endDate.setHours(hour);
  return endDate;
}
