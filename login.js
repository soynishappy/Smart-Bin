// login.js

document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // 로그인 성공
      alert('로그인 성공!');
      // 로그인 후 이동할 페이지 (예: main.html)
      window.location.href = 'main.html';
    })
    .catch((error) => {
      alert('로그인 실패: ' + error.message);
    });
});
