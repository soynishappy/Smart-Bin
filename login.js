console.log("login.js 로드됨");

firebase.auth().onAuthStateChanged(user => {
  console.log("auth 상태 변경:", user);
  if (user) {
    window.location.href = 'main.html';
  }
});

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("로그인 폼 제출됨");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const autoLogin = document.getElementById("auto-login").checked;

  console.log("입력값:", email, password, autoLogin);

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert(`환영합니다, ${userCredential.user.email}님!`);

      if (autoLogin) {
        localStorage.setItem("autoLogin", "true");
      } else {
        localStorage.removeItem("autoLogin");
      }

      window.location.href = "main.html";
    })
    .catch(error => {
      console.error("로그인 오류:", error);
      alert("이메일 또는 비밀번호를 확인해주세요.");
    });
});
