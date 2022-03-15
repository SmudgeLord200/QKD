var alice, bob, eve, line, photon, pol_H_A, pol_H_B, pol_V_A, pol_V_B, pol_P45_A, pol_P45_B, pol_N45_A, pol_N45_B, pol_H_E1, pol_H_E2, pol_V_E1, pol_V_E2, pol_P45_E1, pol_P45_E2, pol_N45_E1, pol_N45_E2;
var eve_display = false; //whether to summon Eve or not
var eve_state = false; //false: no eavesdrop, true: has eavesdrop
var alice_45 = false, bob_45 = false; //false: Rectilinear, true: Diagonal
var Alice = [], Bob = [], Eve = []; //Initialize three arrays for storing bit sequences
var h = 0, v = 0, p45 = 0, n45 = 0; //Bit orientation
var xR = 0, yR = 0, xD = 0, yD = 0, eR = 0, eD = 0, d = 0; //Random parameters for basis
var aB = 0, bB = 0, eB = 0; //Randoms for Alice's and Bob's and Eve's in random basis
var bitsToPush = false, bits_value = 0;

var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

function draw() {
    alice = new component(80, 100, "Alice.jpg", 10, 20, "image");
    bob = new component(80, 100, "Bob.jpg", 1140, 20, "image");
    eve = new component(80, 100, "Eve.jpg", 550, 20, "image");
    line = new component(1050, 1, "black", 90, 70);
    photon = new component(30, 30, "red", 90, 60);

    //Polarization Bases of Alice and Bob
    pol_H_A = new component(90, 100, "Pol-H.png", 100, 10, "image");
    pol_H_B = new component(90, 100, "Pol-H.png", 1030, 10, "image");
    pol_V_A = new component(90, 100, "Pol-V.png", 100, 10, "image");
    pol_V_B = new component(90, 100, "Pol-V.png", 1030, 10, "image");
    pol_P45_A = new component(90, 100, "Pol-P45.png", 100, 10, "image");
    pol_P45_B = new component(90, 100, "Pol-P45.png", 1030, 10, "image");
    pol_N45_A = new component(90, 100, "Pol-N45.png", 100, 10, "image");
    pol_N45_B = new component(90, 100, "Pol-N45.png", 1030, 10, "image");

    //Polarization Bases of Eve
    pol_H_E1 = new component(90, 100, "Pol-H.png", 450, 10, "image");
    pol_H_E2 = new component(90, 100, "Pol-H.png", 650, 10, "image");
    pol_V_E1 = new component(90, 100, "Pol-V.png", 450, 10, "image");
    pol_V_E2 = new component(90, 100, "Pol-V.png", 640, 10, "image");
    pol_P45_E1 = new component(90, 100, "Pol-P45.png", 150, 10, "image");
    pol_P45_E2 = new component(90, 100, "Pol-P45.png", 150, 10, "image");
    pol_N45_E1 = new component(90, 100, "Pol-N45.png", 150, 10, "image");
    pol_N45_E2 = new component(90, 100, "Pol-N45.png", 150, 10, "image");
}

//This is the method of how the images are drawn
function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function () {
        if (type == "image") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}


//This is the control for animation in the canvas and the related functions
function update() {

    //then draw the image into it
    alice.update();
    bob.update();
    line.update();

    //Toggle between the display of Eve
    document.getElementById("eavesdrop").onclick = function () {
        if (!eve_display) {
            document.getElementById("eavesdrop").innerHTML = "Stop Eavdesdropping"; //change the button text
            eve_display = true; //display Eve in the canvas
            eve_state = true; //Has eavesdropping
        } else {
            document.getElementById("eavesdrop").innerHTML = "Eavdesdrop"; //chnage the button text
            eve_display = false; //remove Eve from the canvas
            eve_state = false; //No eavesdropping
        }
    }

    //Then, we draw Eve
    if (eve_display == true) {
        eve.update();
        pol_V_E1.update();
        pol_V_E2.update();
    }


    //Toggle between the radio buttons on the polarization base selection
    //aliceOptHV, aliceOpt45, randomP, fixedP, bobOptHV, bobOpt45
    //If random polarization base is checked, all other selection buttons are disabled
    document.getElementById("randomP").onclick = function () {
        document.getElementById("aliceOptHV").disabled = true;
        document.getElementById("aliceOpt45").disabled = true;
        document.getElementById("bobOptHV").disabled = true;
        document.getElementById("bobOpt45").disabled = true;
    }

    //If fixed polarization base is checked, all other selection buttons are released
    document.getElementById("fixedP").onclick = function () {
        document.getElementById("aliceOptHV").disabled = false;
        document.getElementById("aliceOpt45").disabled = false;
        document.getElementById("bobOptHV").disabled = false;
        document.getElementById("bobOpt45").disabled = false;
    }

    //Show the corresponding image according to the selected radio button
    if (document.getElementById("aliceOptHV").checked) {
        pol_V_A.update();
    } else {
        alice_45 = true; //Diagonal basis
        pol_P45_A.update();
    }

    if (document.getElementById("bobOptHV").checked) {
        pol_V_B.update();
    } else {
        bob_45 = true; //Diagonal basis
        pol_P45_B.update();
    }

    //Polarization State Assignment
    if (document.getElementById("1").checked) {
        h = 1;
        v = 0;
        p45 = 1;
        n45 = 0;
    } else {
        h = 0;
        v = 1;
        p45 = 0;
        n45 = 1;
    }

    document.getElementById("single").onclick = function () {

        //Fixed Basis
        if (document.getElementById("fixedP").checked) {

            //Rectilinear Basis
            if (alice_45 === false && bob_45 === false) {
                //Radnomly switch between horizontal and vertical basis
                //alice switch between xR
                xR = Math.floor(Math.random() * 2);
                //0 is V, 1 is A 
                if (xR == 0) {
                    pol_V_A.update();
                    Alice.push(v);
                    console.log("Alice Vertical: ", Alice);
                } else {
                    pol_H_A.update();
                    Alice.push(h);
                    console.log("Alice Horizontal: ", Alice);
                }

                //Eve
                if (eve_state === true) {
                    //Radnomly switch between Rectilinear and Diagonal Basis
                    eB = Math.floor(Math.random() * 2);
                    //If Eve has different basis with Alice, the photon will be converted, i.e., a wrong photon has born                            

                    //0 is H/V, 1 is P45/N45
                    //Eve chooses Diagonal basis the wrong basis, result in a wrong photon to Bob
                    if (eB == 1) {
                        //d: it will be randomly deflected in one of the two directions in another polarization state
                        d = Math.floor(Math.random() * 2);
                        if (d == 0) {
                            //P45
                            bitsToPush = true;
                            bits_value = p45;
                            console.log("Eve's here: ", p45);
                            Eve.push(bits_value);
                        } else {
                            //N45
                            bitsToPush = true;
                            bits_value = n45;
                            console.log("Eve's here: ", n45);
                            Eve.push(bits_value);
                        }
                    } else {
                        eR = Math.floor(Math.random() * 2);
                        //0 is H, 1 is V
                        if (eR == 0) {
                            pol_H_E1.update();
                            pol_H_E2.update();
                            Eve.push(h);
                        } else {
                            pol_V_E1.update();
                            pol_V_E2.update();
                            Eve.push(v);
                        }
                    }
                }

                //bob switch between yR
                yR = Math.floor(Math.random() * 2);
                //0 is V, 1 is A
                if (yR == 0) {
                    pol_V_B.update();
                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {
                        Bob.push(v);
                    }
                    console.log("Bob Vertical: ", Bob);
                } else {
                    pol_H_B.update();
                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {
                        Bob.push(h);
                    }
                    console.log("Bob Horizontal: ", Bob);
                }

                bitsToPush = false;
                //Assign corresponding bit value to both arrays
                //Display the bit sequence to the tables                        
            }

            //Diagonal Basis
            else if (alice_45 === true && bob_45 === true) {
                //Radnomly switch between P45 and N45 basis
                //Assign corresponding bit value to both arrays
                //Display the bit sequence to the tables
                //alice switch between xD
                xD = Math.floor(Math.random() * 2);
                //0 is P45, 1 is N45 
                if (xD == 0) {
                    pol_P45_A.update();
                    Alice.push(p45);
                    console.log("Alice P45: ", Alice)
                } else {
                    pol_N45_A.update();
                    Alice.push(n45);
                    console.log("Alice N45: ", Alice)
                }

                //Eve
                if (eve_state === true) {
                    //Radnomly switch between Rectilinear and Diagonal Basis
                    eB = Math.floor(Math.random() * 2);
                    //If Eve has different basis with Alice, the photon will be converted, i.e., a wrong photon has born                            

                    //0 is H/V, 1 is P45/N45
                    //Eve chooses Diagonal basis the wrong basis, result in a wrong photon to Bob
                    if (eB == 0) {
                        //d: it will be randomly deflected in one of the two directions in another polarization state
                        d = Math.floor(Math.random() * 2);
                        if (d == 0) {
                            //H
                            bitsToPush = true;
                            bits_value = h;
                            console.log("Eve's here: ", h);
                        } else {
                            //V
                            bitsToPush = true;
                            bits_value = v;
                            console.log("Eve's here: ", v);
                        }
                    } else {
                        eD =  Math.floor(Math.random() * 2);
                        //0 is p45, 1 is n45
                        if (eD == 0) {
                            pol_P45_E1.update();
                            pol_P45_E2.update();
                            Eve.push(p45);
                        } else {
                            pol_N45_E1.update();
                            pol_N45_E2.update();
                            Eve.push(n45);
                        }                                
                    }
                }

                //bob switch between yD
                yD = Math.floor(Math.random() * 2);
                if (yD == 0) {
                    pol_P45_B.update();
                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {
                        Bob.push(p45);
                    }
                    console.log("Bob P45: ", Bob);
                } else {
                    pol_H_B.update();
                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {
                        Bob.push(n45);
                    }
                    console.log("Bob N45: ", Bob);
                }

                bitsToPush = false;

            }

            //If the two bases are not equal
            else {

                //Alice: H/V, Bob: P45/N45
                if (alice_45 === false && bob_45 === true) {
                    //alice swicth between xR
                    xR = Math.floor(Math.random() * 2);
                    //0 is V, 1 is A 
                    if (xR == 0) {
                        pol_V_A.update();
                        Alice.push(v);
                        console.log("Alice Vertical: ", Alice)
                    } else {
                        pol_H_A.update();
                        Alice.push(h);
                        console.log("Alice Horizontal: ", Alice)
                    }


                    //Eve
                    if (eve_state === true) {
                        //Radnomly switch between Rectilinear and Diagonal Basis
                        eB = Math.floor(Math.random() * 2);
                        //If Eve has different basis with Alice, the photon will be converted, i.e., a wrong photon has born                            

                        //0 is H/V, 1 is P45/N45
                        //Eve chooses Diagonal basis the wrong basis, result in a wrong photon to Bob
                        if (eB == 1) {
                            //d: it will be randomly deflected in one of the two directions in another polarization state
                            d = Math.floor(Math.random() * 2);
                            if (d == 0) {
                                //P45
                                bitsToPush = true;
                                bits_value = p45;
                                console.log("Eve's here: ", p45);
                            } else {
                                //N45
                                bitsToPush = true;
                                bits_value = n45;
                                console.log("Eve's here: ", n45);
                            }
                        }
                    }

                    //bob switch between yD
                    yD = Math.floor(Math.random() * 2);
                    if (yD == 0) {
                        pol_P45_B.update();
                        if (bitsToPush === true) {
                            Bob.push(bits_value);
                        } else {
                            Bob.push(p45);
                        }
                        console.log("Bob P45: ", Bob);
                    } else {
                        pol_H_B.update();
                        if (bitsToPush === true) {
                            Bob.push(bits_value);
                        } else {
                            Bob.push(n45);
                        }
                        console.log("Bob N45: ", Bob);
                    }

                    bitsToPush = false;
                }

                //Alice: P45/N45, Bob: H/V
                else {

                    //alice switch between xD
                    xD = Math.floor(Math.random() * 2);
                    //0 is P45, 1 is N45 
                    if (xD == 0) {
                        pol_P45_A.update();
                        //console.log("P45");
                        Alice.push(p45);
                        console.log("Alice P45: ", Alice)
                    } else {
                        pol_N45_A.update();
                        //console.log("N45");
                        Alice.push(n45);
                        console.log("Alice N45: ", Alice)
                    }

                    //Eve
                    if (eve_state === true) {
                        //Radnomly switch between Rectilinear and Diagonal Basis
                        eB = Math.floor(Math.random() * 2);
                        //If Eve has different basis with Alice, the photon will be converted, i.e., a wrong photon has born                            

                        //0 is H/V, 1 is P45/N45
                        //Eve chooses Diagonal basis the wrong basis, result in a wrong photon to Bob
                        if (eB == 0) {
                            //d: it will be randomly deflected in one of the two directions in another polarization state
                            d = Math.floor(Math.random() * 2);
                            if (d == 0) {
                                //H
                                bitsToPush = true;
                                bits_value = h;
                                console.log("Eve's here: ", h);
                            } else {
                                //V
                                bitsToPush = true;
                                bits_value = v;
                                console.log("Eve's here: ", v);
                            }
                        }
                    }

                    //bob switch between yR
                    yR = Math.floor(Math.random() * 2);
                    if (yR == 0) {
                        pol_V_B.update();
                        if (bitsToPush === true) {
                            Bob.push(bits_value);
                        } else {
                            Bob.push(v);
                        }
                        console.log("Bob Vertical: ", Bob);
                    } else {
                        pol_H_B.update();
                        if (bitsToPush === true) {
                            Bob.push(bits_value);
                        } else {
                            Bob.push(h);
                        }
                        console.log("Bob Horizontal: ", Bob);
                    }

                    bitsToPush = false;
                }
                //Radnomly switch between their own basis
                //Assign corresponding bit value to both arrays
                //Display the bit sequence to the tables      
            }
        }
        //Random Basis
        else {
            //Randomly switch between Rectilinear and Diagonal Basis
            //Assign corresponding bit value to both arrays
            //Display the bit sequence to the tables 

            //Radnom Alice Basis
            aB = Math.floor(Math.random() * 2);
            //0 is H/V, 1 is P45/N45
            //Alice: H/V
            if (aB == 0) {
                //Radnomly switch between horizontal and vertical basis
                xR = Math.floor(Math.random() * 2);
                //0 is V, 1 is A 
                if (xR == 0) {
                    pol_V_A.update();
                    //console.log("Vertical");
                    Alice.push(v);
                    console.log("Alice Vertical: ", Alice)
                } else {
                    pol_H_A.update();
                    //console.log("Horizontal");
                    Alice.push(h);
                    console.log("Alice Horizontal: ", Alice)
                }

                //Eve
                if (eve_state === true) {
                    //Radnomly switch between Rectilinear and Diagonal Basis
                    eB = Math.floor(Math.random() * 2);
                    //If Eve has different basis with Alice, the photon will be converted, i.e., a wrong photon has born                            

                    //0 is H/V, 1 is P45/N45
                    //Eve chooses Diagonal basis the wrong basis, result in a wrong photon to Bob
                    if (eB == 1) {
                        //d: it will be randomly deflected in one of the two directions in another polarization state
                        d = Math.floor(Math.random() * 2);
                        if (d == 0) {
                            //P45
                            bitsToPush = true;
                            bits_value = p45;
                            console.log("Eve's here: ", h);
                        } else {
                            //N45
                            bitsToPush = true;
                            bits_value = n45;
                            console.log("Eve's here: ", v);
                        }
                    } else {
                        eR =  Math.floor(Math.random() * 2);
                        //0 is h, 1 is v
                        if (eR == 0) {
                            pol_H_E1.update();
                            pol_H_E2.update();
                            Eve.push(h);
                        } else {
                            pol_V_E1.update();
                            pol_V_E2.update();
                            Eve.push(v);
                        }                                
                    }
                }
            }
            //Alice: P45/N45
            else {
                xD = Math.floor(Math.random() * 2);
                //0 is P45, 1 is N45 
                if (xD == 0) {
                    pol_P45_A.update();
                    Alice.push(p45);
                    console.log("Alice P45: ", Alice)
                } else {
                    pol_N45_A.update();
                    Alice.push(n45);
                    console.log("Alice N45: ", Alice)
                }

                //Eve
                if (eve_state === true) {
                    //Radnomly switch between Rectilinear and Diagonal Basis
                    eB = Math.floor(Math.random() * 2);
                    //If Eve has different basis with Alice, the photon will be converted, i.e., a wrong photon has born                            

                    //0 is H/V, 1 is P45/N45
                    //Eve chooses Diagonal basis the wrong basis, result in a wrong photon to Bob
                    if (eB == 0) {
                        //d: it will be randomly deflected in one of the two directions in another polarization state
                        d = Math.floor(Math.random() * 2);
                        if (d == 0) {
                            //H
                            bitsToPush = true;
                            bits_value = h;
                            console.log("Eve's here: ", h);
                        } else {
                            //V
                            bitsToPush = true;
                            bits_value = v;
                            console.log("Eve's here: ", v);
                        }
                    } else {
                        eD =  Math.floor(Math.random() * 2);
                        //0 is p45, 1 is n45
                        if (eD == 0) {
                            pol_P45_E1.update();
                            pol_P45_E2.update();
                            Eve.push(p45);
                        } else {
                            pol_N45_E1.update();
                            pol_N45_E2.update();
                            Eve.push(n45);
                        }
                    }
                }
            }

            //Random Bob Basis
            bB = Math.floor(Math.random() * 2);
            //0 is H/V, 1 is P45/N45
            if (bB == 0) {
                //bob switch between yR
                yR = Math.floor(Math.random() * 2);
                if (yR == 0) {
                    pol_V_B.update();
                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {Bob.push(v);}
                    console.log("Bob Vertical: ", Bob);
                } else {
                    pol_H_B.update();
                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {Bob.push(h);}
                    console.log("Bob Horizontal: ", Bob);
                }

                bitsToPush = false;
            }
            //Bob: P45/N45 
            else {
                //bob switch between yD
                yD = Math.floor(Math.random() * 2);
                if (yD == 0) {
                    pol_P45_B.update();
                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {Bob.push(p45);}
                    console.log("Bob P45: ", Bob);
                } else {
                    pol_N45_B.update();
                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {Bob.push(n45);}
                    console.log("Bob N45: ", Bob);
                }

                bitsToPush = false;
            }
        }
    }

    //Draw the photon to the canvas
    photon.update();
    //photon.x += 1;
}

function animate() {
    window.requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();
    update();
}