import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAI7HhOjJ02jfY0K8oENtKEqlz0FbWDjms",
  authDomain: "arc-project-74046.firebaseapp.com",
  databaseURL: "https://arc-project-74046-default-rtdb.firebaseio.com",
  projectId: "arc-project-74046",
  storageBucket: "arc-project-74046.appspot.com",
  messagingSenderId: "968891082364",
  appId: "1:968891082364:web:eaefe8df7099d82bd7cbf9",
};

// if (firebase.apps.length === 0) {
//   firebase.initializeApp(firebaseConfig);
// }
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

console.log(db);

export { db };
