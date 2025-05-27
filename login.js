// 자동 로그인 상태 확인
// 자동 로그인 및 로그인 상태 확인
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    window.location.href = 'main.html';
  } else {
    const justLoggedOut = localStorage.getItem("justLoggedOut");
    if (justLoggedOut) {
      localStorage.removeItem("justLoggedOut");
    } else {
      alert("로그인이 필요합니다.");
    }
  }
});

// 이메일 자동완성 및 비밀번호 자동 입력
window.addEventListener("DOMContentLoaded", () => {
  const savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || {};
  const emailList = document.getElementById("email-list");

  // 이메일 목록 채우기
  Object.keys(savedUsers).forEach(email => {
    const option = document.createElement("option");
    option.value = email;
    emailList.appendChild(option);
  });

  // 이메일 입력 시 자동으로 비밀번호 채우기
  document.getElementById("email").addEventListener("change", () => {
    const email = document.getElementById("email").value;
    if (savedUsers[email]) {
      document.getElementById("password").value = savedUsers[email];
    } else {
      document.getElementById("password").value = "";
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

      // 저장된 사용자 목록에 현재 이메일+비밀번호 저장
      const savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || {};
      savedUsers[email] = password;
      localStorage.setItem("savedUsers", JSON.stringify(savedUsers));

      // 자동 로그인 여부 저장
      if (autoLogin) {
        localStorage.setItem("autoLogin", "true");
      } else {
        localStorage.removeItem("autoLogin");
      }

      window.location.href = "main.html";
    })
    .catch(error => {
      alert(`로그인 실패: ${error.message}`);
    });
});
