var value = parseFloat(document.getElementById("o3-gauge").getAttribute("data-o3")); // 현재 값 가져오기

var gaugeOptions = {
  min: 0,
  max: 0.2,
  title: "오존",
  label: "단위: ppm",
  value: value, // 값 설정
  decimals: 3,
  gaugeWidthScale: 0.6,
  levelColors: [], // 초기화된 레벨 색상 배열
  levelColorsGradient: true
};

if (value > 0.15) {
  gaugeOptions.levelColors = ["#FF0000"]; // 값이 0.15을 초과하면 빨간색으로 설정
} else if (value > 0.09) {
  gaugeOptions.levelColors = ["#FFD400"]; // 값이 0.09부터 0.15 사이면 노란색으로 설정
} else if (value > 0.03) {
  gaugeOptions.levelColors = ["#00FF00"]; // 값이 0.03부터 0.09 사이면 초록색으로 설정
} else {
  gaugeOptions.levelColors = ["#0000FF"]; // 값이 0.03 이하면 파란색으로 설정
}
    var gauge = new JustGage({
      id: "o3-gauge",
      value: gaugeOptions.value,
      decimals: gaugeOptions.decimals,
      min: gaugeOptions.min,
      max: gaugeOptions.max,
      title: gaugeOptions.title,
      label: gaugeOptions.label,
      gaugeWidthScale: gaugeOptions.gaugeWidthScale,
      levelColors: gaugeOptions.levelColors,
      levelColorsGradient: gaugeOptions.levelColorsGradient
    });

    var ctx1 = document.getElementById("o3-chart").getContext("2d");
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
