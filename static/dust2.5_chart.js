var value = parseInt(document.getElementById("dust2.5-gauge").getAttribute("data-pm2_5")); // 현재 값 가져오기

var gaugeOptions = {
  min: 0,
  max: 300,
  title: "초미세먼지",
  label: "단위: 1㎍/㎥",
  value: value, // 값 설정
  gaugeWidthScale: 0.6,
  levelColors: [], // 초기화된 레벨 색상 배열
  levelColorsGradient: true
};

if (value > 75) {
  gaugeOptions.levelColors = ["#FF0000"]; // 값이 75를 초과하면 빨간색으로 설정
} else if (value > 35) {
  gaugeOptions.levelColors = ["#FFD400"]; // 값이 36부터 75 사이면 노란색으로 설정
} else if (value > 15) {
  gaugeOptions.levelColors = ["#00FF00"]; // 값이 16부터 35 사이면 초록색으로 설정
} else {
  gaugeOptions.levelColors = ["#0000FF"]; // 값이 15 이하면 파란색으로 설정
}

    var gauge = new JustGage({
      id: "dust2.5-gauge",
      value: gaugeOptions.value,
      min: gaugeOptions.min,
      max: gaugeOptions.max,
      title: gaugeOptions.title,
      label: gaugeOptions.label,
      gaugeWidthScale: gaugeOptions.gaugeWidthScale,
      levelColors: gaugeOptions.levelColors,
      levelColorsGradient: gaugeOptions.levelColorsGradient
    });

    var ctx1 = document.getElementById("dust2.5-chart").getContext("2d");
    var data = {
      labels: ["현재"],
      datasets: [
        {
          label: "초미세먼지",
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          borderColor: "rgba(255, 0, 0, 1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255, 0, 0, 0.4)",
          hoverBorderColor: "rgba(255, 0, 0, 1)",
          data: [50]
        }
      ]
    };
    var options = {
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: 100,
            stepSize: 20
          }
        }]
      }
    };
    var dustChart = new Chart(ctx1, {
      type: 'bar',
      data: data,
      options: options
    });

