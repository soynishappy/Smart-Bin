// 자동 로그인 상태 확인
firebase.auth().onAuthStateChanged(user => {
  const justLoggedOut = localStorage.getItem("justLoggedOut");
  if (user && !justLoggedOut) {
    window.location.href = "main.html";
  } else {
    // 로그아웃 상태에서 다시 들어온 경우, 상태 초기화
    localStorage.removeItem("justLoggedOut");
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
