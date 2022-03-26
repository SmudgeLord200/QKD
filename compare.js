//Retrieve the items from local storage
var newAliceArray = JSON.parse(localStorage.getItem("NewAliceArray"));
var newBobArray = JSON.parse(localStorage.getItem("NewBobArray"));
var newOverallAliceArray = JSON.parse(localStorage.getItem("NewOverallAliceArray"));
var newOverallBobArray = JSON.parse(localStorage.getItem("NewOverallBobArray"));
var newOverallAliceBasis = JSON.parse(localStorage.getItem("NewOverallAliceBasis"));
var newOverallBobBasis = JSON.parse(localStorage.getItem("NewOverallBobBasis"));
var newPStateArray = JSON.parse(localStorage.getItem("NewPStateArray"));

var p_state = { p_state_01: 1, p_state_02: 2}; //P state comparison

var Rectilinear = { Overall: "H/V", Horizontal: "Horizontal", Vertical: "Vertical" }; //Basis comparison
var Diagonal = { Overall: "P45/N45", P45: "P45", N45: "N45" }; //Basis comparison

document.getElementById("Alice").innerHTML = newAliceArray.join(' ');
document.getElementById("Bob").innerHTML = newBobArray.join(' ');
