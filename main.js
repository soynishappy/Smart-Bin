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

    // 🔽 탄소 절감량 계산 및 그래프 그리기
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

    // 총 탄소 절감량 표시
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

  // 기존 차트 파괴 (중복 방지)
  if (window.dailyChartInstance) {
    window.dailyChartInstance.destroy();
  }

  window.dailyChartInstance = new Chart(chartCanvas, {
    type: 'bar', // 막대 그래프로 변경
    data: {
      labels: sortedDates,
      datasets: [{
        label: '일별 탄소 절감량 (kg CO₂)',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
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

document.addEventListener("DOMContentLoaded", () => {
  const addTrashBtn = document.getElementById("test-add-trash");
  if (addTrashBtn) {
    addTrashBtn.addEventListener("click", () => {
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
  }
});
