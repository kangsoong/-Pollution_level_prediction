var value = parseFloat(document.getElementById("co-gauge").getAttribute("data-co")); // 현재 값 가져오기

var gaugeOptions = {
  min: 0,
  max: 30,
  title: "일산화탄소",
  label: "단위: ppm",
  value: value, // 값 설정
  decimals: 3,
  gaugeWidthScale: 0.6,
  levelColors: [], // 초기화된 레벨 색상 배열
  levelColorsGradient: true
};

if (value >= 15) {
  gaugeOptions.levelColors = ["#FF0000"]; // 값이 15를 초과하면 빨간색으로 설정
} else if (value > 9) {
  gaugeOptions.levelColors = ["#FFD400"]; // 값이 9부터 15 사이면 노란색으로 설정
} else if (value > 2) {
  gaugeOptions.levelColors = ["#00FF00"]; // 값이 2부터 9 사이면 초록색으로 설정
} else {
  gaugeOptions.levelColors = ["#0000FF"]; // 값이 2 이하면 파란색으로 설정
}


    var gauge = new JustGage({
      id: "co-gauge",
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

    var ctx1 = document.getElementById("co-roundchart").getContext("2d");
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
