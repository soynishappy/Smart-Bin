// 로그인 상태 확인 및 자동 로그인 처리
firebase.auth().onAuthStateChanged(user => {
  const justLoggedOut = localStorage.getItem("justLoggedOut");

  if (user) {
    window.location.href = 'main.html';
  } else {
    if (justLoggedOut === "true") {
      localStorage.removeItem("justLoggedOut"); // 로그아웃 후 들어온 경우는 메시지 띄우지 않음
    } else {
      // 진짜 비로그인 상태일 때만 메시지 출력
      alert("로그인이 필요합니다.");
    }
  }
});

// 이메일 자동완성 및 비밀번호 자동 입력
window.addEventListener("DOMContentLoaded", () => {
  const savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || {};
  const emailList = document.getElementById("email-list");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  // 이메일 목록 생성
  Object.keys(savedUsers).forEach(email => {
    const option = document.createElement("option");
    option.value = email;
    emailList.appendChild(option);
  });

  // 이메일 입력 시 비밀번호 자동 입력
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

      // 사용자 정보 저장
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

