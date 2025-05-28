// main.js 전체 수정 버전

// DOM 요소 로딩 이후 실행되도록 래핑
document.addEventListener("DOMContentLoaded", () => {
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

      // 탄소 절감량 계산 및 그래프 그리기
      fetchUserTrashLogs(uid);

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

  // 쓰레기 데이터 추가 버튼 이벤트
  document.getElementById("test-add-trash").addEventListener("click", () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const uid = user.uid;
      firebase.database().ref('trash_logs/' + uid).push({
        type: "plastic",
        weight: 100,
        date: new Date().toISOString().slice(0, 10)
      }).then(() => {
        alert("✅ 쓰레기 데이터가 추가되었습니다!");
        location.reload();
      }).catch((err) => {
        alert("❌ Firebase 쓰기 실패: " + err.message);
      });
    } else {
      alert("로그인이 필요합니다.");
    }
  });
});

// 탄소 절감량 계산 및 날짜별 그래프
function fetchUserTrashLogs(userId) {
  const ref = firebase.database().ref("trash_logs/" + userId);
  const CO2_FACTORS = {
    plastic: 0.0025,
    can: 0.0092,
    glass: 0.0014,
    paper: 0.0017
  };

  const dailyTotals = {};
  let totalCO2 = 0;

  ref.once("value").then(snapshot => {
    snapshot.forEach(child => {
      const { type, weight, date } = child.val();
      const co2 = (CO2_FACTORS[type] || 0) * weight;
      totalCO2 += co2;

      if (!dailyTotals[date]) {
        dailyTotals[date] = co2;
      } else {
        dailyTotals[date] += co2;
      }
    });

    const totalSpan = document.getElementById("total-carbon");
    if (totalSpan) {
      totalSpan.textContent = totalCO2.toFixed(2);
    }

    renderDailyChart(dailyTotals);
  });
}

function renderDailyChart(dailyData) {
  const sortedDates = Object.keys(dailyData).sort();
  const values = sortedDates.map(date => dailyData[date].toFixed(2));

  const chartCanvas = document.getElementById("dailyChart");
  if (!chartCanvas) return;

  new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: sortedDates,
      datasets: [{
        label: '일별 탄소 절감량 (kg CO₂)',
        data: values,
        fill: false,
        borderColor: 'green',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'kg CO₂' }
        },
        x: {
          title: { display: true, text: '날짜' }
        }
      }
    }
  });
}
