var value = parseInt(document.getElementById("dust-gauge").getAttribute("data-pm10")); // 현재 값 가져오기

var gaugeOptions = {
  min: 0,
  max: 300,
  title: "미세먼지",
  label: "단위: 3㎍/㎥",
  value: value, // 값 설정
  gaugeWidthScale: 0.6,
  levelColors: [], // 초기화된 레벨 색상 배열
  levelColorsGradient: true
};

if (value > 150) {
  gaugeOptions.levelColors = ["#FF0000"]; // 값이 150을 초과하면 빨간색으로 설정
} else if (value > 80) {
  gaugeOptions.levelColors = ["#FFD400"]; // 값이 80부터 150 사이면 노란색으로 설정
} else if (value > 30) {
  gaugeOptions.levelColors = ["#00FF00"]; // 값이 30부터 80 사이면 초록색으로 설정
} else {
  gaugeOptions.levelColors = ["#0000FF"]; // 값이 30 이하면 파란색으로 설정
}


    var gauge = new JustGage({
      id: "dust-gauge",
      value: gaugeOptions.value,
      min: gaugeOptions.min,
      max: gaugeOptions.max,
      title: gaugeOptions.title,
      label: gaugeOptions.label,
      gaugeWidthScale: gaugeOptions.gaugeWidthScale,
      levelColors: gaugeOptions.levelColors,
      levelColorsGradient: gaugeOptions.levelColorsGradient
    });

    var ctx1 = document.getElementById("dust-roundchart").getContext("2d");
    var options = {
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: 200,
            stepSize: 40
          }
        }]
      }
    };
    var dustChart = new Chart(ctx1, {
      type: 'bar',
      data: data,
      options: options
    });
