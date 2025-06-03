// Firebase 구성 및 초기화
const firebaseConfig = {
  apiKey: "AIzaSyAVtB-5G932ZqNpn7a541p2iXZ_ZYGW-nU",
  authDomain: "smart-5c491.firebaseapp.com",
  projectId: "smart-5c491",
  storageBucket: "smart-5c491.appspot.com",
  messagingSenderId: "1002873500741",
  appId: "1:1002873500741:web:f3e9e142e00a6350d6df2c",
  measurementId: "G-YMSX9299M2",
  databaseURL: "https://smart-5c491-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);

// 로그인한 사용자 정보 가져오기
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    const uid = user.uid;
    const email = user.email;

    firebase.database().ref('users/' + uid).once('value')
      .then((snapshot) => {
        const data = snapshot.val();
        const points = data ? data.points : 0;
        document.getElementById('user-info').textContent = `환영합니다, ${email}님!`;
        document.getElementById('points').textContent = points;
      })
      .catch((error) => {
        document.getElementById('user-info').textContent = `환영합니다, ${email}님! (포인트 불러오기 실패)`;
        console.error('포인트 로딩 오류:', error);
      });

    fetchUserTrashLogs(uid);

  } else {
    alert("로그인이 필요합니다.");
    window.location.href = 'login.html';
  }
});

// 로그아웃 및 버튼 이벤트 등록
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById('logout')?.addEventListener('click', function() {
    firebase.auth().signOut().then(() => {
      alert("로그아웃되었습니다.");
      window.location.href = 'login.html';
    }).catch((error) => {
      alert("로그아웃 오류: " + error.message);
    });
  });

  // 입력한 날짜로 쓰레기 추가 버튼
document.getElementById("add-custom-trash")?.addEventListener("click", () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const uid = user.uid;
    const date = document.getElementById("custom-date").value;
    const type = document.getElementById("trash-type").value;
    const count = parseInt(document.getElementById("item-count").value);

    if (!date || isNaN(count) || count <= 0) {
      alert("날짜와 수량을 정확히 입력해 주세요.");
      return;
    }

    const weightPerItem = 10; // 가정값
    const totalWeight = count * weightPerItem;

    // 쓰레기 로그 저장
    firebase.database().ref('trash_logs/' + uid).push({
      type: type,
      weight: totalWeight,
      date: date
    }).then(() => {
      // 포인트 업데이트
      const pointRef = firebase.database().ref('users/' + uid + '/points');
      pointRef.once("value").then(snapshot => {
        const currentPoints = snapshot.exists() ? snapshot.val() : 0;
        const updatedPoints = currentPoints + count;
        pointRef.set(updatedPoints).then(() => {
          document.getElementById("points").textContent = updatedPoints;
          alert(`✅ 입력한 날짜로 쓰레기 데이터가 추가되었습니다! (+${count} 포인트)`);
          // ❗️ 포인트 반영 후 새로고침
          location.reload();
        });
      });
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
  const sortedDates = Object.keys(dailyData).sort().slice(-7);
  const values = sortedDates.map(date => dailyData[date].toFixed(2));

  const chartCanvas = document.getElementById("dailyChart");
  if (!chartCanvas) return;

  if (window.dailyChartInstance) {
    window.dailyChartInstance.destroy();
  }

  window.dailyChartInstance = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      labels: sortedDates,
      datasets: [{
        label: '일별 탄소 절감량 (kg CO₂)',
        data: values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 24,
        categoryPercentage: 0.8,
        barPercentage: 0.9
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'x',
      layout: {
        padding: { left: 0, right: 0 }
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 3.0,
          title: { display: true, text: 'kg CO₂' },
          ticks: {
            stepsize: 0.5,
            callback: function(value) {
        return value.toFixed(1);
            },
            font: {
              size: 16
            }
          }
        },
        x: {
          title: {
            display: true,
            text: '날짜',
            align: 'end'
          },
          ticks: {
            align: 'center',
            anchor: 'center',
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 16
            }
          },
          offset: true
        }
      },
      plugins: {
        legend: {
          align: 'start',
          labels: {
            font: {
              size: 16
            }
          }
        }
      }
    }
  });

  chartCanvas.parentElement.style.width = '100%';
  chartCanvas.parentElement.style.maxWidth = '420px';
  chartCanvas.parentElement.style.margin = '0 auto';
  chartCanvas.parentElement.style.height = '280px';
  chartCanvas.parentElement.style.padding = '0';
  chartCanvas.parentElement.style.boxSizing = 'border-box';
}
