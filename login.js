// 로그인 상태 확인 및 자동 리디렉션 방지
firebase.auth().onAuthStateChanged(user => {
  const fromLogout = localStorage.getItem("justLoggedOut");
  if (user && !fromLogout) {
    // 자동 로그인
    window.location.href = "main.html";
  }
});

// 이메일 자동완성과 비밀번호 기억
window.addEventListener("DOMContentLoaded", () => {
  const savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || {};
  const emailList = document.getElementById("email-list");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  emailInput.addEventListener("input", () => {
    const email = emailInput.value;
    if (savedUsers[email]) {
      passwordInput.value = savedUsers[email];
    } else {
      passwordInput.value = "";
    }
  });
});

// 로그인 처리
document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const autoLogin = document.getElementById("auto-login").checked;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert(`환영합니다, ${userCredential.user.email}님!`);
      localStorage.removeItem("justLoggedOut");

      const savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || {};
      savedUsers[email] = password;
      localStorage.setItem("savedUsers", JSON.stringify(savedUsers));

      if (autoLogin) {
        localStorage.setItem("autoLogin", "true");
      } else {
        localStorage.removeItem("autoLogin");
      }

      window.location.href = "main.html";
    })
.catch(error => {
  if (
    error.code === "auth/user-not-found" ||
    error.code === "auth/wrong-password" ||
    error.code === "auth/invalid-login-credentials"
  ) {
    alert("이메일 또는 비밀번호를 확인해주세요.");
  } else {
    alert(`로그인 실패: ${error.message}`);
  }
});
