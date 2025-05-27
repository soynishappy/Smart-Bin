// 자동 로그인 상태 확인
firebase.auth().onAuthStateChanged(user => {
  if (user) {
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
      // ✅ localStorage에 이메일 저장
      localStorage.setItem('userEmail', email);

      alert(`환영합니다, ${userCredential.user.email}님!`);
      window.location.href = 'main.html';
    })
    .catch((error) => {
      alert(`로그인 실패: ${error.message}`);
    });
});

// ✅ 페이지 로드시 이메일 자동입력
window.onload = () => {
  const savedEmail = localStorage.getItem('userEmail');
  if (savedEmail) {
    document.getElementById('email').value = savedEmail;
  }
};
