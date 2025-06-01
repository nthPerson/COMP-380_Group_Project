//initialize firebase and import the auth method and the initalization method 
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// I put the config in the discord for easy setup - REZA
const firebaseConfig = {
    apiKey: "REPLACE WITH API KEY",
    authDomain: "comp380-project.firebaseapp.com",
    projectId: "comp380-project",
    storageBucket: "comp380-project.firebasestorage.app",
    messagingSenderId: "600625641164",
    appId: "REPLACE WITH APP ID",
    measurementId: "G-Z4CSFDJFNB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
