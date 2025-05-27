const firebaseConfig = {
  apiKey: "AIzaSyBu9OykAAv8Afwt68O3rImcd4kx0oNJj64",
  authDomain: "project1-47e8e.firebaseapp.com",
  databaseURL: "https://project1-47e8e-default-rtdb.firebaseio.com",
  projectId: "project1-47e8e",
  storageBucket: "project1-47e8e.firebasestorage.app",
  messagingSenderId: "1028297928817",
  appId: "1:1028297928817:web:a74021767ebd432bd52bd0",
  measurementId: "G-54P8BR7YF6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_ID",
  appId: "YOUR_APP_ID"
};

// 초기화
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  auth.createUserWithEmailAndPassword(username + "@example.com", password)
    .then((userCredential) => {
      const user = userCredential.user;
      db.ref('users/' + user.uid).set({
        username: username
      });
      alert("가입 완료!");
    })
    .catch((error) => {
      alert("에러: " + error.message);
    });
});
