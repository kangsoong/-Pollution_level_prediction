var value = parseInt(document.getElementById("co2-gauge").getAttribute("data-co2")); // 현재 값 가져오기

var gaugeOptions = {
  min: 0,
  max: 3000,
  title: "이산화탄소",
  label: "단위: ppm",
  value: value, // 값 설정
  gaugeWidthScale: 0.6,
  levelColors: [], // 초기화된 레벨 색상 배열
  levelColorsGradient: true
};

if (value > 2000) {
  gaugeOptions.levelColors = ["#FF0000"]; // 값이 2000을 초과하면 빨간색으로 설정
} else if (value > 1000) {
  gaugeOptions.levelColors = ["#FFD400"]; // 값이 1000부터 2000 사이면 노란색으로 설정
} else if (value > 450) {
  gaugeOptions.levelColors = ["#00FF00"]; // 값이 450부터 1000 사이면 초록색으로 설정
} else {
  gaugeOptions.levelColors = ["#0000FF"]; // 값이 450 이하면 파란색으로 설정
}

    var gauge = new JustGage({
      id: "co2-gauge",
      value: gaugeOptions.value,
      min: gaugeOptions.min,
      max: gaugeOptions.max,
      title: gaugeOptions.title,
      label: gaugeOptions.label,
      gaugeWidthScale: gaugeOptions.gaugeWidthScale,
      levelColors: gaugeOptions.levelColors,
      levelColorsGradient: gaugeOptions.levelColorsGradient
    });

    var ctx1 = document.getElementById("co2-roundchart").getContext("2d");
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
