//initialize firebase and import the auth method and the initalization method 
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// I put the config in the discord for easy setup - REZA
const firebaseConfig = {
    apiKey: "AIzaSyAN1C-3Cvk2uDSZFFPxlYz9REG8vvZGTGE",
    authDomain: "comp380-project.firebaseapp.com",
    projectId: "comp380-project",
    storageBucket: "comp380-project.firebasestorage.app",
    messagingSenderId: "600625641164",
    appId: "1:600625641164:web:08ae615ac03593930d7469",
    measurementId: "G-Z4CSFDJFNB"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
