// air_purifier_running 변수 선언
var air_purifier_running = false;
var a = 0;
var b = 0;
var c = 0;
var d = 0;
var e = 0;

// sensor_data.pm2_5 값을 가져와서 상태를 표시하는 함수
function updatePM2_5Status() {
  var pm2_5ValueElement = document.getElementById("pm2_5_value");
  var pm2_5StatusElement = document.getElementById("pm2_5_status");
  var pm2_5Value = parseFloat(pm2_5ValueElement.innerText);
  if (pm2_5Value >= 0 && pm2_5Value <= 15) {
    pm2_5StatusElement.textContent = "좋음";
    pm2_5StatusElement.style.color = "blue";
    if(a == 1){

      stopAirPurifier();
      a = 0;
    }

  } else if (pm2_5Value >= 16 && pm2_5Value < 35) {
    pm2_5StatusElement.textContent = "보통";
    pm2_5StatusElement.style.color = "green";
    if(a == 1){
      stopAirPurifier();
      a = 0;
    }

  } else if (pm2_5Value >= 35 && pm2_5Value < 75) {
    pm2_5StatusElement.textContent = "나쁨";
    pm2_5StatusElement.style.color = "#FFD400"
    startAirPurifier();
    a = 1;

  } else if (pm2_5Value >= 75) {
    pm2_5StatusElement.textContent = "매우 나쁨";
    pm2_5StatusElement.style.color = "red";
    startAirPurifier();
    a = 1;
  }

}

// 페이지가 로드될 때마다 updatePM2_5Status 함수 실행
window.addEventListener("load", updatePM2_5Status);

// sensor_data.pm10 값을 가져와서 상태를 표시하는 함수
function updatePM10Status() {
  var pm10ValueElement = document.getElementById("pm10_value");
  var pm10StatusElement = document.getElementById("pm10_status");
  var pm10Value = parseFloat(pm10ValueElement.innerText);

  if (pm10Value >= 0 && pm10Value <= 30) {
    pm10StatusElement.textContent = "좋음";
    pm10StatusElement.style.color = "blue";
    if(b == 1){
      stopAirPurifier();
      b = 0;
    }

  } else if (pm10Value >= 31 && pm10Value <= 80) {
    pm10StatusElement.textContent = "보통";
    pm10StatusElement.style.color = "green";
    if(b == 1){
      stopAirPurifier();
      b = 0;
    }

  } else if (pm10Value >= 81 && pm10Value <= 150) {
    pm10StatusElement.textContent = "나쁨";
    pm10StatusElement.style.color = "#FFD400"
    startAirPurifier();
    b = 1;

  } else if (pm10Value >= 151) {
    pm10StatusElement.textContent = "매우 나쁨";
    pm10StatusElement.style.color = "red";
    startAirPurifier();
    b = 1;
  }

}

// 페이지가 로드될 때마다 updatePM10Status 함수 실행
window.addEventListener("load", updatePM10Status);

// sensor_data.o3 값을 가져와서 상태를 표시하는 함수
function updateO3Status() {
  var o3ValueElement = document.getElementById("o3_value");
  var o3StatusElement = document.getElementById("o3_status");

  var o3Value = parseFloat(o3ValueElement.innerText);

  if (o3Value >= 0 && o3Value < 0.03) {
    o3StatusElement.textContent = "좋음";
    o3StatusElement.style.color = "blue";
    if(c == 1){
      stopAirPurifier();
      c = 0;
    }

  } else if (o3Value >= 0.03 && o3Value < 0.09) {
    o3StatusElement.textContent = "보통";
    o3StatusElement.style.color = "green";
    if(c == 1){
      startAirPurifier();
      c = 0;
    }

  } else if (o3Value >= 0.09 && o3Value < 0.15) {
    o3StatusElement.textContent = "나쁨";
    o3StatusElement.style.color = "#FFD400"
    startAirPurifier();
    c = 1;

  } else if (o3Value >= 0.15) {
    o3StatusElement.textContent = "매우 나쁨";
    o3StatusElement.style.color = "red";
    startAirPurifier();
    c = 1;
  }

}

// 페이지가 로드될 때마다 updateO3Status 함수 실행
window.addEventListener("load", updateO3Status);

// sensor_data.co 값을 가져와서 상태를 표시하는 함수
function updateCOStatus() {
  var coValueElement = document.getElementById("co_value");
  var coStatusElement = document.getElementById("co_status");

  var coValue = parseFloat(coValueElement.innerText);

  if (coValue >= 0 && coValue < 2) {
    coStatusElement.textContent = "좋음";
    coStatusElement.style.color = "blue";
    if(d == 1){
      stopAirPurifier();
      d = 0;
    }

  } else if (coValue >= 2 && coValue < 9) {
    coStatusElement.textContent = "보통";
    coStatusElement.style.color = "green";
    if(d == 1){
      stopAirPurifier();
      d = 0;
    }

  } else if (coValue >= 9 && coValue < 15) {
    coStatusElement.textContent = "나쁨";
    coStatusElement.style.color = "#FFD400"
    startAirPurifier();
    d = 1;

  } else if (coValue >= 15) {
    coStatusElement.textContent = "매우 나쁨";
    coStatusElement.style.color = "red";
    startAirPurifier();
    d = 1;
  }
}

// 페이지가 로드될 때마다 updateCOStatus 함수 실행
window.addEventListener("load", updateCOStatus);

// sensor_data.co2 값을 가져와서 상태를 표시하는 함수
function updateCO2Status() {
  var co2ValueElement = document.getElementById("co2_value");
  var co2StatusElement = document.getElementById("co2_status");

  var co2Value = parseFloat(co2ValueElement.innerText);

  if (co2Value >= 0 && co2Value < 450) {
    co2StatusElement.textContent = "좋음";
    co2StatusElement.style.color = "blue";
    if(e == 1){
      stopAirPurifier();
      e = 0;
    }

  } else if (co2Value >= 450 && co2Value < 1000) {
    co2StatusElement.textContent = "보통";
    co2StatusElement.style.color = "green";
    if(e == 1){
      stopAirPurifier();
      e = 0;
    }

  } else if (co2Value >= 1000 && co2Value < 2000) {
    co2StatusElement.textContent = "나쁨";
    co2StatusElement.style.color = "#FFD400"
    startAirPurifier();
    e = 1;

  } else if (co2Value >= 2000) {
    co2StatusElement.textContent = "매우 나쁨";
    co2StatusElement.style.color = "red";
    startAirPurifier();
    e = 1;

  }
}

// 페이지가 로드될 때마다 updateCO2Status 함수 실행
window.addEventListener("load", updateCO2Status);

function startAirPurifier() {
  if (air_manual_operation !== 1) {
    // Ajax 요청을 통해 서버에 공기청정기를 작동시키는 요청을 보낼 수 있습니다.
    // 아래는 jQuery를 사용한 예시입니다.
    $.ajax({
      url: "/control_p100",
      method: "POST",
      data: { action: "공기청정기 작동" }, // 작동 명령을 서버로 전달합니다.
      success: function() {
        air_purifier_running = true; // 작동 상태로 변경
        updateAirPurifierStatus(); // 공기청정기 상태 업데이트
      }
    });
  }
}

function stopAirPurifier() {
  if (air_manual_operation !== 1) {
    // Ajax 요청을 통해 서버에 공기청정기를 작동시키는 요청을 보낼 수 있습니다.
    // 아래는 jQuery를 사용한 예시입니다.
    $.ajax({
      url: "/control_p100",
      method: "POST",
      data: { action: "공기청정기 중지" }, // 작동 명령을 서버로 전달합니다.
      success: function() {
        air_purifier_running = false; // 중지 상태로 변경
        updateAirPurifierStatus(); // 공기청정기 상태 업데이트

      }
    });
  }
}

// 공기청정기 상태 업데이트 함수
function updateAirPurifierStatus() {
  var airPurifierStatusElement = document.getElementById("air-purifier-status");
  if (air_purifier_running) {
    airPurifierStatusElement.textContent = "작동 중";
  } else {
    airPurifierStatusElement.textContent = "중지됨";

  }
}

// 수동 작동 상태 업데이트 함수
function updateAirManualOperation() {
  var airManualOperationElement = document.getElementById("air-manual-operation");
  if (air_manual_operation === 1) {
    airManualOperationElement.textContent = "수동작동 동작중";
  } else {
    airManualOperationElement.textContent = "수동작동 중지됨";
    stopAirPurifier();
  }
}

// 서버로부터 air_manual_operation 값을 가져오는 함수
function getAirManualOperation() {
  $.ajax({
    url: "/control_p100",
    method: "POST",
    data: { action: "get_air_manual_operation" },
    success: function(response) {
      // air_manual_operation 변수를 업데이트합니다.
      air_manual_operation = response.air_manual_operation;

      // air-manual-operation 요소를 업데이트합니다.
      updateAirManualOperation();
    }
  });
}

window.addEventListener("load", getAirManualOperation);