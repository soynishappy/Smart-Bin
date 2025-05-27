// login.js

document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert('로그인 성공!');
      window.location.href = 'main.html'; // ✅ 이게 실행돼야 main.html로 이동
    })
    .catch((error) => {
      alert('로그인 실패: ' + error.message);
    });
});
