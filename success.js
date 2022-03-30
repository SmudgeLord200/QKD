var finalArray = JSON.parse(localStorage.getItem("finalArray"));
var display = document.getElementById("final");

display.innerHTML = finalArray.join(' ');