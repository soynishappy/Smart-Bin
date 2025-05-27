// register.js

document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // ✅ 회원가입 성공 시 실행
      const user = userCredential.user;
      const uid = user.uid;

      // ✅ Realtime Database에 사용자 정보 저장
      firebase.database().ref('users/' + uid).set({
        email: email,
        points: 0
      });

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      window.location.href = 'login.html';
    })
    .catch((error) => {
      alert('회원가입 실패: ' + error.message);
    });
});
