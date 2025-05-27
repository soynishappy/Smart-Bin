// 로그인한 사용자 정보 가져오기
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    const uid = user.uid;
    const email = user.email;

    // Realtime Database에서 포인트 불러오기
    firebase.database().ref('users/' + uid).once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        const points = data ? data.points : 0;
        const userInfo = `이메일: ${email}, 포인트: ${points}`;
        document.getElementById('user-info').textContent = userInfo;
      })
      .catch((error) => {
        document.getElementById('user-info').textContent = `이메일: ${email} (포인트 불러오기 실패)`;
        console.error('포인트 로딩 오류:', error);
      });
  } else {
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
