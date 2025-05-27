// Firebase SDK를 HTML에 넣었다고 가정하고, 아래 코드에서 auth 객체가 이미 초기화된 상태라고 할게.

// DOM 요소 가져오기
const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault(); // 폼 제출 시 새로고침 방지

  const email = signupForm['email'].value;
  const password = signupForm['password'].value;

  // Firebase 이메일/비밀번호 회원가입 함수 호출
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      // 회원가입 성공 후 로그인 페이지로 이동
      window.location.href = 'login.html';
    })
    .catch((error) => {
      alert('회원가입 중 오류가 발생했습니다: ' + error.message);
    });
});
