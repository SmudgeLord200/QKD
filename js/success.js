var finalArray = JSON.parse(localStorage.getItem("finalArray"));
var display = document.getElementById("final");
var eve = JSON.parse(localStorage.getItem("Eve"));
var dialog1 = document.getElementById("msgBox1");
var dialog2 = document.getElementById("msgBox2");

display.innerHTML = finalArray.join(' ');

if (eve == true) {
    //dialog1.style.visibility = "hidden";
    dialog2.style.visibility = "visible";

} else {
    dialog1.style.visibility = "visible";
    //dialog2.style.visibility = "hidden";
}

document.getElementById("playAgain").onclick = function() {
    document.location= "/gameMainPage.html";
    localStorage.removeItem("finalArray");
    localStorage.removeItem("Eve");
    localStorage.removeItem("NewAliceArray");
    localStorage.removeItem("NewBobArray");
    localStorage.removeItem("NewOverallAliceArray");
    localStorage.removeItem("NewOverallBobArray");
    localStorage.removeItem("NewAliceBasis");
    localStorage.removeItem("NewBobBasis");
    localStorage.removeItem("NewPStateArray");
}

document.getElementById("exit").onclick = function() {
    document.location= "/mainPage.html";
    localStorage.removeItem("finalArray");
    localStorage.removeItem("Eve");
    localStorage.removeItem("NewAliceArray");
    localStorage.removeItem("NewBobArray");
    localStorage.removeItem("NewOverallAliceArray");
    localStorage.removeItem("NewOverallBobArray");
    localStorage.removeItem("NewAliceBasis");
    localStorage.removeItem("NewBobBasis");
    localStorage.removeItem("NewPStateArray");
}