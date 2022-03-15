var canvas = document.getElementById("canvas_bb84_1");

canvas.width = 1000;

var c = canvas.getContext("2d");

var x = 220;
var radius = 15;
var color = "#0095DD";
var changeImg1 = false;
var changeImg2 = false;
var count = 0;

function draw() {

    //draw pol filter
    c.drawImage(p_fil, 100, 30, 100, 100);
    c.drawImage(p_fil_flip, 810, 30, 100, 100);

    //draw p det
    c.drawImage(p_det_flip, 10, 30, 100, 100);
    c.drawImage(p_det, 900, 30, 100, 100);

    //draw p
    c.beginPath();
    c.arc(x, 80, radius, 0, Math.PI * 2, false);
    c.fillStyle = color;
    c.fill();
    c.closePath();
}

var dx = 4;
function update() {
    if (x + radius > 810 || x - radius < 200) {
        dx = -dx;
        color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
    }

    if (x + radius > 810) {
        changeImg1 = true;
        count = 0;
    } else if (x - radius < 200) {
        changeImg2 = true;
        count = 1;
    }

    if (changeImg1 == true) {
        c.drawImage(p_fil_r_flip, 100, 30, 100, 100);
    } 

    if (changeImg2 == true) {
        c.drawImage(p_fil_r, 810, 30, 100, 100);
    }
    
    x += dx;

    if (count == 0) {c.drawImage(p_fil_flip, 810, 30, 100, 100);}
    if (count == 1) {c.drawImage(p_fil, 100, 30, 100, 100);}
}

var p_det = new Image();
var p_det_flip = new Image();
var p_fil = new Image();
var p_fil_flip = new Image();
var p_fil_r = new Image();
var p_fil_r_flip = new Image();

function animate() {
    p_det.src = "photon_detector.jpg";
    p_det_flip.src = "photon_detector_flip.jpg"
    p_fil.src = "p_filter_02.jpg";
    p_fil_flip.src = "p_filter_02_flip.jpg";
    p_fil_r.src = "p_filter_02_r.jpg";
    p_fil_r_flip.src = "p_filter_02_r_flip.jpg";

    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    update();
}

animate();