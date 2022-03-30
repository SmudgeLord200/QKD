var finalArray = JSON.parse(localStorage.getItem("finalArray"));
var display = document.getElementById("final");
var eve = JSON.parse(localStorage.getItem("Eve"));

display.innerHTML = finalArray.join(' ');