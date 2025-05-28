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
  let errorMsg;

  switch (error.code) {
    case 'auth/email-already-in-use':
      errorMsg = '이미 사용 중인 이메일입니다.';
      break;
    case 'auth/invalid-email':
      errorMsg = '유효하지 않은 이메일 형식입니다.';
      break;
    case 'auth/weak-password':
      errorMsg = '비밀번호는 최소 6자리 이상이어야 합니다.';
      break;
    default:
      errorMsg = '회원가입에 실패했습니다. 다시 시도해주세요.';
  }

  alert(errorMsg);
});
