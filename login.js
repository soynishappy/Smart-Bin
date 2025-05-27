document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      alert('로그인 성공!');
      window.location.href = 'main.html';
    })
    .catch((error) => {
      alert('로그인 실패: ' + error.message);
    });
});
