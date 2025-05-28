// register.js

document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const uid = user.uid;

      return firebase.database().ref('users/' + uid).set({
        email: email,
        points: 0
      });
    })
    .then(() => {
      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      alert('회원가입 실패: ' + error.message);
    });
});
