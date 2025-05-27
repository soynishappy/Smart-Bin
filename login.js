// 로그인 페이지 스크립트 (login.js)

// 자동 로그인 상태 확인
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // 이미 로그인 상태면 메인 페이지로 이동
    window.location.href = 'main.html';
  }
});

// 로그인 폼 제출 처리
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // 로그인 성공
      alert(`환영합니다, ${userCredential.user.email}님!`);
      window.location.href = 'main.html';
    })
    .catch((error) => {
      // 로그인 실패
      alert(`로그인 실패: ${error.message}`);
    });
});
