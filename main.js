// main.js

// 로그인한 사용자 정보 가져오기
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // 로그인된 사용자 정보 표시
    const userInfo = `이메일: ${user.email}`;
    document.getElementById('user-info').textContent = userInfo;
  } else {
    // 로그인 안 된 경우 로그인 페이지로 이동
    alert("로그인이 필요합니다.");
    window.location.href = 'login.html';
  }
});

// 로그아웃 기능
document.getElementById('logout').addEventListener('click', function() {
  firebase.auth().signOut().then(() => {
    alert("로그아웃되었습니다.");
    window.location.href = 'login.html';
  }).catch((error) => {
    alert("로그아웃 오류: " + error.message);
  });
});
