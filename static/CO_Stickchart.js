// 데이터 요청 및 그래프 업데이트 함수
function fetchDataAndUpdateChart() {
  fetch('/sensor_data')
    .then(response => response.json())
    .then(data => {
      // 데이터 가공
      const labels = [];
      const coValues = [];
      const backgroundColors = [];

      // 초기 데이터 설정
      for (let i = Math.max(0, data.length - 10); i < data.length; i++) {
        labels.unshift(data[i].day);
        coValues.unshift(data[i].co);
        backgroundColors.unshift(getBackgroundColor(data[i].co));
      }

      // 그래프 생성 또는 업데이트
      if (!chart) {
        var ctx = document.getElementById('co-chart').getContext('2d');
        chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'CO',
              data: coValues,
              backgroundColor: backgroundColors
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
                max: 30
              }
            }
          }
        });
      } else {
        chart.data.labels = labels;
        chart.data.datasets[0].data = coValues;
        chart.data.datasets[0].backgroundColor = backgroundColors;
        chart.update();
      }

      // 매우 나쁨인 경우 경고 메시지 출력
      if (coValues.length > 0 && coValues[coValues.length - 1] > 15) {
        alert('이산화탄소 수치가 매우 나쁨입니다. 환기하십시오.');
      }
    });
}

// 최초 실행
let chart; // 그래프 객체를 저장할 변수
fetchDataAndUpdateChart();

// 일정 간격으로 데이터 업데이트
setInterval(fetchDataAndUpdateChart, 10000); // 10초마다 데이터 업데이트

// 배경색상 설정 함수
function getBackgroundColor(value) {
  if (value <= 2) {
    return 'rgba(0, 128, 255, 0.8)';
  } else if (value <= 9) {
    return 'rgba(0, 255, 0, 0.8)';
  } else if (value <= 15) {
    return 'rgba(255, 255, 0, 0.8)';
  } else {
    return 'rgba(255, 0, 0, 0.8)';
  }
}
