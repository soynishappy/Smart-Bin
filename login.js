// 자동 로그인 상태 확인
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // 이미 로그인 상태면 메인 페이지로 이동
    window.location.href = 'main.html';
  } else {
    const justLoggedOut = localStorage.getItem("justLoggedOut");
    if (justLoggedOut) {
      // 로그아웃 직후면 알림 없이 justLoggedOut 플래그 제거
      localStorage.removeItem("justLoggedOut");
      // 알림 띄우지 않고 대기 (또는 아무 것도 안 함)
    } else {
      alert("로그인이 필요합니다.");
    }
  }
});


// 로그인 폼 제출 처리
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const autoLoginChecked = document.getElementById("auto-login").checked;

  firebase.auth().setPersistence(
    autoLoginChecked
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION
  ).then(() => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }).then((userCredential) => {
    alert(`환영합니다, ${userCredential.user.email}님!`);
    window.location.href = "main.html";
  }).catch((error) => {
    alert(`로그인 실패: ${error.message}`);
  });
});
