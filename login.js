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

  // 자동 로그인 체크박스 상태 확인
  const autoLoginChecked = document.getElementById('auto-login').checked;

  // 로그인 상태 유지 방식 설정
  const persistence = autoLoginChecked
    ? firebase.auth.Auth.Persistence.LOCAL    // 브라우저 닫아도 로그인 유지
    : firebase.auth.Auth.Persistence.SESSION; // 탭 닫으면 로그아웃

  firebase.auth().setPersistence(persistence)
    .then(() => {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    })
    .then((userCredential) => {
      alert(`환영합니다, ${userCredential.user.email}님!`);
      window.location.href = 'main.html';
    })
    .catch((error) => {
      alert(`로그인 실패: ${error.message}`);
    });
});
