var alice_45 = false, bob_45 = false; //false: Rectilinear, true: Diagonal
var eve_state = false, eve_display = false; //false: no eavesdrop, true: has eavesdrop
var Alice = [], Bob = [], Eve = []; //Initialize three arrays for storing bit sequences
var h = 0, v = 0, p45 = 0, n45 = 0; //Bit orientation
var xR = 0, yR = 0, xD = 0, yD = 0, eR = 0, eD = 0, d = 0; //Random parameters for basis
var aB = 0, bB = 0, eB = 0; //Randoms for Alice's and Bob's and Eve's in random basis
var bitsToPush = false, bits_value = 0; //Bits to push to Bob's array after Eve is here

var Rectilinear = { Overall: "H/V", Horizontal: "Horizontal", Vertical: "Vertical" }; //Basis comparison
var Diagonal = { Overall: "P45/N45", P45: "P45", N45: "N45" }; //Basis comparison

var a_basis = [];
var b_basis = [];
var e_basis = [];

var pol_H_A, pol_H_B, pol_V_A, pol_V_B, pol_P45_A, pol_P45_B, pol_N45_A, pol_N45_B, pol_H_E1, pol_H_E2, pol_V_E1, pol_V_E2, pol_P45_E1, pol_P45_E2, pol_N45_E1, pol_N45_E2;

//Alice
pol_V_A = document.getElementById("alice_v");
pol_H_A = document.getElementById("alice_h");
pol_P45_A = document.getElementById("alice_p45");
pol_N45_A = document.getElementById("alice_n45");

//Bob
pol_V_B = document.getElementById("bob_v");
pol_H_B = document.getElementById("bob_h");
pol_P45_B = document.getElementById("bob_p45");
pol_N45_B = document.getElementById("bob_n45");

//Eve
pol_V_E1 = document.getElementById("eve_v_1");
pol_V_E2 = document.getElementById("eve_v_2");

pol_H_E1 = document.getElementById("eve_h_1");
pol_H_E2 = document.getElementById("eve_h_2");

pol_P45_E1 = document.getElementById("eve_p45_1");
pol_P45_E2 = document.getElementById("eve_p45_2");

pol_N45_E1 = document.getElementById("eve_n45_1");
pol_N45_E2 = document.getElementById("eve_n45_2");


//Polarization Base Settings
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

//Show the corresponding image according to the selected radio buttons
document.getElementById("aliceOptHV").onclick = function () {
    alice_45 = false;

    //Show Vertical by default
    pol_V_A.style.visibility = "visible";
    pol_H_A.style.visibility = "hidden";
    pol_P45_A.style.visibility = "hidden";
    pol_N45_A.style.visibility = "hidden";

}

//Show the corresponding image according to the selected radio buttons
document.getElementById("aliceOpt45").onclick = function () {
    alice_45 = true;

    //Show P45 by default
    pol_V_A.style.visibility = "hidden";
    pol_H_A.style.visibility = "hidden";
    pol_P45_A.style.visibility = "visible";
    pol_N45_A.style.visibility = "hidden";
}

//Show the corresponding image according to the selected radio buttons
document.getElementById("bobOptHV").onclick = function () {
    bob_45 = false;

    //Show Vertical by default
    pol_V_B.style.visibility = "visible";
    pol_H_B.style.visibility = "hidden";
    pol_P45_B.style.visibility = "hidden";
    pol_N45_B.style.visibility = "hidden";
}

//Show the corresponding image according to the selected radio buttons
document.getElementById("bobOpt45").onclick = function () {
    bob_45 = true;

    //Show P45 by default
    pol_V_B.style.visibility = "hidden";
    pol_H_B.style.visibility = "hidden";
    pol_P45_B.style.visibility = "visible";
    pol_N45_B.style.visibility = "hidden";
}

//Whether to summon Eve or not
document.getElementById("eavesdrop").onclick = function () {

    if (!eve_display) {
        document.getElementById("eavesdrop").innerHTML = "Stop Eavdesdropping"; //change the button text

        //Show Vertical by feault
        document.getElementById("eve").style.visibility = "visible";
        pol_H_E1.style.visibility = "hidden";
        pol_H_E2.style.visibility = "hidden";
        pol_V_E1.style.visibility = "visible";
        pol_V_E2.style.visibility = "visible";
        pol_P45_E1.style.visibility = "hidden";
        pol_P45_E2.style.visibility = "hidden";
        pol_N45_E1.style.visibility = "hidden";
        pol_N45_E2.style.visibility = "hidden";

        eve_display = true; //display Eve in the div
        eve_state = true; //Has eavesdropping

    } else {
        document.getElementById("eavesdrop").innerHTML = "Eavdesdrop"; //chnage the button text

        document.getElementById("eve").style.visibility = "hidden";
        pol_H_E1.style.visibility = "hidden";
        pol_H_E2.style.visibility = "hidden";
        pol_V_E1.style.visibility = "hidden";
        pol_V_E2.style.visibility = "hidden";
        pol_P45_E1.style.visibility = "hidden";
        pol_P45_E2.style.visibility = "hidden";
        pol_N45_E1.style.visibility = "hidden";
        pol_N45_E2.style.visibility = "hidden";

        eve_display = false; //remove Eve from the div
        eve_state = false; //No eavesdropping
    }
}

//Polarization State Assignment
var p_state_array = []; //Save the p state of every bit in the transmission
var p_state = 0;
document.getElementById("1").onclick = function () {
    p_state = 1;

    h = 1;
    v = 0;
    p45 = 1;
    n45 = 0;
}

//Polarization State Assignment
document.getElementById("2").onclick = function () {
    p_state = 2;

    h = 0;
    v = 1;
    p45 = 0;
    n45 = 1;
}

function css_ani() {
    document.getElementById("circle").classList.remove("circle-active");
    setTimeout(() => {
        document.getElementById("circle").classList.add("circle-active");
    }, 1);
}

//Fire photon
var i = 0, j = 0, k = 0; //Alice Eve Bob basis array counter
var aCount = 0, bCount = 0, eCount = 0;
var overallA = [];
var overallB = [];
var overallE = [];
function fire() {

    //Fixed Basis
    if (document.getElementById("fixedP").checked) {

        //Rectilinear Basis
        if (alice_45 === false && bob_45 === false) {
            //Radnomly switch between horizontal and vertical basis
            //alice switch between xR
            xR = Math.floor(Math.random() * 2);
            //0 is V, 1 is H 
            if (xR == 0) {
                //V
                pol_V_A.style.visibility = "visible";
                pol_H_A.style.visibility = "hidden";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "hidden";

                css_ani();
                Alice.push(v);
                console.log("Alice Vertical: ", Alice);
                overallA[aCount] = Rectilinear.Overall;
                aCount++;
                a_basis[i] = Rectilinear.Vertical;
                i++;

            } else {
                //H
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "visible";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "hidden";

                css_ani();
                Alice.push(h);
                console.log("Alice Horizontal: ", Alice);
                overallA[aCount] = Rectilinear.Overall;
                aCount++;
                a_basis[i] = Rectilinear.Horizontal;
                i++;
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
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "visible";
                        pol_P45_E2.style.visibility = "visible";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        bitsToPush = true;
                        bits_value = p45;
                        Eve.push(bits_value);
                        console.log("Eve's here: ", p45);
                        overallE[eCount] = Diagonal.Overall;
                        eCount++;
                        e_basis[j] = Diagonal.P45;
                        j++;

                    } else {
                        //N45
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "visible";
                        pol_N45_E2.style.visibility = "visible";

                        bitsToPush = true;
                        bits_value = n45;
                        Eve.push(bits_value);
                        console.log("Eve's here: ", n45);
                        overallE[eCount] = Diagonal.Overall;
                        eCount++;
                        e_basis[j] = Diagonal.N45;
                        j++;
                    }
                } else {
                    eR = Math.floor(Math.random() * 2);
                    //0 is H, 1 is V
                    if (eR == 0) {
                        //H
                        pol_H_E1.style.visibility = "visible";
                        pol_H_E2.style.visibility = "visible";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        Eve.push(h);
                        console.log("Eve's here and guess correctly: ", h);
                        overallE[eCount] = Rectilinear.Overall;
                        eCount++;
                        e_basis[j] = Rectilinear.Horizontal;
                        j++;

                    } else {
                        //V
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "visible";
                        pol_V_E2.style.visibility = "visible";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        Eve.push(v);
                        console.log("Eve's here and guess correctly: ", v);
                        overallE[eCount] = Rectilinear.Overall;
                        eCount++;
                        e_basis[j] = Rectilinear.Vertical;
                        j++;
                    }
                }
            }

            //bob switch between yR
            yR = Math.floor(Math.random() * 2);
            //0 is V, 1 is H
            if (yR == 0) {
                //V
                pol_V_B.style.visibility = "visible";
                pol_H_B.style.visibility = "hidden";
                pol_P45_B.style.visibility = "hidden";
                pol_N45_B.style.visibility = "hidden";

                if (bitsToPush === true) {
                    Bob.push(bits_value);
                } else {
                    Bob.push(v);
                }
                console.log("Bob Vertical: ", Bob);
                overallB[bCount] = Rectilinear.Overall;
                bCount++;
                b_basis[k] = Rectilinear.Vertical;
                k++;

            } else {
                //H
                pol_V_B.style.visibility = "hidden";
                pol_H_B.style.visibility = "visible";
                pol_P45_B.style.visibility = "hidden";
                pol_N45_B.style.visibility = "hidden";

                if (bitsToPush === true) {
                    Bob.push(bits_value);
                } else {
                    Bob.push(h);
                }
                console.log("Bob Horizontal: ", Bob);
                overallB[bCount] = Rectilinear.Overall;
                bCount++;
                b_basis[k] = Rectilinear.Horizontal;
                k++;
            }

            bitsToPush = false;
                     
        }

        //Diagonal Basis
        else if (alice_45 === true && bob_45 === true) {
            //Radnomly switch between P45 and N45 basis
            //alice switch between xD
            xD = Math.floor(Math.random() * 2);
            //0 is P45, 1 is N45 
            if (xD == 0) {
                //P45
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "hidden";
                pol_P45_A.style.visibility = "visible";
                pol_N45_A.style.visibility = "hidden";

                css_ani();
                Alice.push(p45);
                console.log("Alice P45: ", Alice);
                overallA[aCount] = Diagonal.Overall;
                aCount++;
                a_basis[i] = Diagonal.P45;
                i++;

            } else {
                //N45
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "hidden";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "visible";

                css_ani();
                Alice.push(n45);
                console.log("Alice N45: ", Alice);
                overallA[aCount] = Diagonal.Overall;
                aCount++;
                a_basis[i] = Diagonal.N45;
                i++;
            }

            //Eve
            if (eve_state === true) {
                //Radnomly switch between Rectilinear and Diagonal Basis
                eB = Math.floor(Math.random() * 2);
                //If Eve has different basis with Alice, the photon will be converted, i.e., a wrong photon has born                            

                //Eve chooses Diagonal basis the wrong basis, result in a wrong photon to Bob
                //0 is H/V, 1 is P45/N45
                if (eB == 0) {
                    //d: it will be randomly deflected in one of the two directions in another polarization state
                    d = Math.floor(Math.random() * 2);
                    if (d == 0) {
                        //H
                        pol_H_E1.style.visibility = "visible";
                        pol_H_E2.style.visibility = "visible";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        bitsToPush = true;
                        bits_value = h;
                        Eve.push(bits_value);
                        console.log("Eve's here: ", h);
                        overallE[eCount] = Rectilinear.Overall;
                        eCount++;
                        e_basis[j] = Rectilinear.Horizontal;
                        j++;

                    } else {
                        //V
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "visible";
                        pol_V_E2.style.visibility = "visible";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        bitsToPush = true;
                        bits_value = v;
                        Eve.push(bits_value);
                        console.log("Eve's here: ", v);
                        overallE[eCount] = Rectilinear.Overall;
                        eCount++;
                        e_basis[j] = Rectilinear.Vertical;
                        j++;
                    }
                } else {
                    eD = Math.floor(Math.random() * 2);
                    //0 is p45, 1 is n45
                    if (eD == 0) {
                        //P45
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "visible";
                        pol_P45_E2.style.visibility = "visible";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        Eve.push(p45);
                        console.log("Eve's here and guess correctly: ", p45);
                        overallE[eCount] = Diagonal.Overall;
                        eCount++;
                        e_basis[j] = Diagonal.P45;
                        j++;

                    } else {
                        //N45
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "visible";
                        pol_N45_E2.style.visibility = "visible";

                        Eve.push(n45);
                        console.log("Eve's here and guess correctly: ", n45);
                        overallE[eCount] = Diagonal.Overall;
                        eCount++;
                        e_basis[j] = Diagonal.N45;
                        j++;
                    }
                }
            }

            //bob switch between yD
            yD = Math.floor(Math.random() * 2);
            //0 is P45, 1 is N45
            if (yD == 0) {
                //P45
                pol_V_B.style.visibility = "hidden";
                pol_H_B.style.visibility = "hidden";
                pol_P45_B.style.visibility = "visible";
                pol_N45_B.style.visibility = "hidden";

                if (bitsToPush === true) {
                    Bob.push(bits_value);
                } else {
                    Bob.push(p45);
                }
                console.log("Bob P45: ", Bob);
                overallB[bCount] = Diagonal.Overall;
                bCount++;
                b_basis[k] = Diagonal.P45;
                k++;

            } else {
                //N45
                pol_V_B.style.visibility = "hidden";
                pol_H_B.style.visibility = "hidden";
                pol_P45_B.style.visibility = "hidden";
                pol_N45_B.style.visibility = "visible";

                if (bitsToPush === true) {
                    Bob.push(bits_value);
                } else {
                    Bob.push(n45);
                }
                console.log("Bob N45: ", Bob);
                overallB[bCount] = Diagonal.Overall;
                bCount++;
                b_basis[k] = Diagonal.N45;
                k++;
            }

            bitsToPush = false;
        }

        //If the two bases are not equal
        else {

            //Alice: H/V, Bob: P45/N45
            if (alice_45 === false && bob_45 === true) {
                //alice swicth between xR
                xR = Math.floor(Math.random() * 2);
                //0 is V, 1 is H 
                if (xR == 0) {
                    //V
                    pol_V_A.style.visibility = "visible";
                    pol_H_A.style.visibility = "hidden";
                    pol_P45_A.style.visibility = "hidden";
                    pol_N45_A.style.visibility = "hidden";

                    css_ani();
                    Alice.push(v);
                    console.log("Alice Vertical: ", Alice);
                    overallA[aCount] = Rectilinear.Overall;
                    aCount++;
                    a_basis[i] = Rectilinear.Vertical;
                    i++;

                } else {
                    //H
                    pol_V_A.style.visibility = "hidden";
                    pol_H_A.style.visibility = "visible";
                    pol_P45_A.style.visibility = "hidden";
                    pol_N45_A.style.visibility = "hidden";

                    css_ani();
                    Alice.push(h);
                    console.log("Alice Horizontal: ", Alice);
                    overallA[aCount] = Rectilinear.Overall;
                    aCount++;
                    a_basis[i] = Rectilinear.Horizontal;
                    i++;
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
                            pol_H_E1.style.visibility = "hidden";
                            pol_H_E2.style.visibility = "hidden";
                            pol_V_E1.style.visibility = "hidden";
                            pol_V_E2.style.visibility = "hidden";
                            pol_P45_E1.style.visibility = "visible";
                            pol_P45_E2.style.visibility = "visible";
                            pol_N45_E1.style.visibility = "hidden";
                            pol_N45_E2.style.visibility = "hidden";

                            bitsToPush = true;
                            bits_value = p45;
                            Eve.push(bits_value);
                            console.log("Eve's here: ", p45);
                            overallE[eCount] = Diagonal.Overall;
                            eCount++;
                            e_basis[j] = Diagonal.P45;
                            j++;

                        } else {
                            //N45
                            pol_H_E1.style.visibility = "hidden";
                            pol_H_E2.style.visibility = "hidden";
                            pol_V_E1.style.visibility = "hidden";
                            pol_V_E2.style.visibility = "hidden";
                            pol_P45_E1.style.visibility = "hidden";
                            pol_P45_E2.style.visibility = "hidden";
                            pol_N45_E1.style.visibility = "visible";
                            pol_N45_E2.style.visibility = "visible";

                            bitsToPush = true;
                            bits_value = n45;
                            Eve.push(bits_value);
                            console.log("Eve's here: ", n45);
                            overallE[eCount] = Diagonal.Overall;
                            eCount++;
                            e_basis[j] = Diagonal.N45;
                            j++;
                        }
                    } else {
                        eR = Math.floor(Math.random() * 2);
                        //0 is H, 1 is V
                        if (eR == 0) {
                            //H
                            pol_H_E1.style.visibility = "visible";
                            pol_H_E2.style.visibility = "visible";
                            pol_V_E1.style.visibility = "hidden";
                            pol_V_E2.style.visibility = "hidden";
                            pol_P45_E1.style.visibility = "hidden";
                            pol_P45_E2.style.visibility = "hidden";
                            pol_N45_E1.style.visibility = "hidden";
                            pol_N45_E2.style.visibility = "hidden";

                            Eve.push(h);
                            console.log("Eve's here and guess correctly: ", h);
                            overallE[eCount] = Rectilinear.Overall;
                            eCount++;
                            e_basis[j] = Rectilinear.Horizontal;
                            j++;

                        } else {
                            //V
                            pol_H_E1.style.visibility = "hidden";
                            pol_H_E2.style.visibility = "hidden";
                            pol_V_E1.style.visibility = "visible";
                            pol_V_E2.style.visibility = "visible";
                            pol_P45_E1.style.visibility = "hidden";
                            pol_P45_E2.style.visibility = "hidden";
                            pol_N45_E1.style.visibility = "hidden";
                            pol_N45_E2.style.visibility = "hidden";

                            Eve.push(v);
                            console.log("Eve's here and guess correctly: ", v);
                            overallE[eCount] = Rectilinear.Overall;
                            eCount++;
                            e_basis[j] = Rectilinear.Vertical;
                            j++;
                        }
                    }
                }

                //bob switch between yD
                yD = Math.floor(Math.random() * 2);
                if (yD == 0) {
                    //P45
                    pol_V_B.style.visibility = "hidden";
                    pol_H_B.style.visibility = "hidden";
                    pol_P45_B.style.visibility = "visible";
                    pol_N45_B.style.visibility = "hidden";

                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {
                        Bob.push(p45);
                    }
                    console.log("Bob P45: ", Bob);
                    overallB[bCount] = Diagonal.Overall;
                    bCount++;
                    b_basis[k] = Diagonal.P45;
                    k++;

                } else {
                    //N45
                    pol_V_B.style.visibility = "hidden";
                    pol_H_B.style.visibility = "hidden";
                    pol_P45_B.style.visibility = "hidden";
                    pol_N45_B.style.visibility = "visible";

                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {
                        Bob.push(n45);
                    }
                    console.log("Bob N45: ", Bob);
                    overallB[bCount] = Diagonal.Overall;
                    bCount++;
                    b_basis[k] = Diagonal.N45;
                    k++;
                }

                bitsToPush = false;
            }

            //Alice: P45/N45, Bob: H/V
            else {

                //alice switch between xD
                xD = Math.floor(Math.random() * 2);
                //0 is P45, 1 is N45 
                if (xD == 0) {
                    //P45
                    pol_V_A.style.visibility = "hidden";
                    pol_H_A.style.visibility = "hidden";
                    pol_P45_A.style.visibility = "visible";
                    pol_N45_A.style.visibility = "hidden";

                    css_ani();
                    Alice.push(p45);
                    console.log("Alice P45: ", Alice);
                    overallA[aCount] = Diagonal.Overall;
                    aCount++;
                    a_basis[i] = Diagonal.P45;
                    i++;

                } else {
                    //N45
                    pol_V_A.style.visibility = "hidden";
                    pol_H_A.style.visibility = "hidden";
                    pol_P45_A.style.visibility = "hidden";
                    pol_N45_A.style.visibility = "visible";

                    css_ani();
                    Alice.push(n45);
                    console.log("Alice N45: ", Alice);
                    overallA[aCount] = Diagonal.Overall;
                    aCount++;
                    a_basis[i] = Diagonal.N45;
                    i++;
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
                            pol_H_E1.style.visibility = "visible";
                            pol_H_E2.style.visibility = "visible";
                            pol_V_E1.style.visibility = "hidden";
                            pol_V_E2.style.visibility = "hidden";
                            pol_P45_E1.style.visibility = "hidden";
                            pol_P45_E2.style.visibility = "hidden";
                            pol_N45_E1.style.visibility = "hidden";
                            pol_N45_E2.style.visibility = "hidden";

                            bitsToPush = true;
                            bits_value = h;
                            Eve.push(bits_value);
                            console.log("Eve's here: ", h);
                            overallE[eCount] = Rectilinear.Overall;
                            eCount++;
                            e_basis[j] = Rectilinear.Horizontal;
                            j++;

                        } else {
                            //V
                            pol_H_E1.style.visibility = "hidden";
                            pol_H_E2.style.visibility = "hidden";
                            pol_V_E1.style.visibility = "visible";
                            pol_V_E2.style.visibility = "visible";
                            pol_P45_E1.style.visibility = "hidden";
                            pol_P45_E2.style.visibility = "hidden";
                            pol_N45_E1.style.visibility = "hidden";
                            pol_N45_E2.style.visibility = "hidden";

                            bitsToPush = true;
                            bits_value = v;
                            Eve.push(bits_value);
                            console.log("Eve's here: ", v);
                            overallE[eCount] = Rectilinear.Overall;
                            eCount++;
                            e_basis[j] = Rectilinear.Vertical;
                            j++;
                        }
                    } else {
                        eD = Math.floor(Math.random() * 2);
                        //0 is p45, 1 is n45
                        if (eD == 0) {
                            //P45
                            pol_H_E1.style.visibility = "hidden";
                            pol_H_E2.style.visibility = "hidden";
                            pol_V_E1.style.visibility = "hidden";
                            pol_V_E2.style.visibility = "hidden";
                            pol_P45_E1.style.visibility = "visible";
                            pol_P45_E2.style.visibility = "visible";
                            pol_N45_E1.style.visibility = "hidden";
                            pol_N45_E2.style.visibility = "hidden";

                            Eve.push(p45);
                            console.log("Eve's here and guess correctly: ", p45);
                            overallE[eCount] = Diagonal.Overall;
                            eCount++;
                            e_basis[j] = Diagonal.P45;
                            j++;

                        } else {
                            //N45
                            pol_H_E1.style.visibility = "hidden";
                            pol_H_E2.style.visibility = "hidden";
                            pol_V_E1.style.visibility = "hidden";
                            pol_V_E2.style.visibility = "hidden";
                            pol_P45_E1.style.visibility = "hidden";
                            pol_P45_E2.style.visibility = "hidden";
                            pol_N45_E1.style.visibility = "visible";
                            pol_N45_E2.style.visibility = "visible";

                            Eve.push(n45);
                            console.log("Eve's here and guess correctly: ", n45);
                            overallE[eCount] = Diagonal.Overall;
                            eCount++;
                            e_basis[j] = Diagonal.N45;
                            j++;
                        }
                    }
                }

                //bob switch between yR
                yR = Math.floor(Math.random() * 2);
                if (yR == 0) {
                    //V
                    pol_V_B.style.visibility = "visible";
                    pol_H_B.style.visibility = "hidden";
                    pol_P45_B.style.visibility = "hidden";
                    pol_N45_B.style.visibility = "hidden";

                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {
                        Bob.push(v);
                    }
                    console.log("Bob Vertical: ", Bob);
                    overallB[bCount] = Rectilinear.Overall;
                    bCount++;
                    b_basis[k] = Rectilinear.Vertical;
                    k++;

                } else {
                    //H
                    pol_V_B.style.visibility = "hidden";
                    pol_H_B.style.visibility = "visible";
                    pol_P45_B.style.visibility = "hidden";
                    pol_N45_B.style.visibility = "hidden";

                    if (bitsToPush === true) {
                        Bob.push(bits_value);
                    } else {
                        Bob.push(h);
                    }
                    console.log("Bob Horizontal: ", Bob);
                    overallB[bCount] = Rectilinear.Overall;
                    bCount++;
                    b_basis[k] = Rectilinear.Horizontal;
                    k++;
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
            //0 is V, 1 is H 
            if (xR == 0) {
                //V
                pol_V_A.style.visibility = "visible";
                pol_H_A.style.visibility = "hidden";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "hidden";

                css_ani();
                Alice.push(v);
                console.log("Alice Vertical: ", Alice);
                overallA[aCount] = Rectilinear.Overall;
                aCount++;
                a_basis[i] = Rectilinear.Vertical;
                i++;

            } else {
                //H
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "visible";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "hidden";

                css_ani();
                Alice.push(h);
                console.log("Alice Horizontal: ", Alice);
                overallA[aCount] = Rectilinear.Overall;
                aCount++;
                a_basis[i] = Rectilinear.Horizontal;
                i++;
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
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "visible";
                        pol_P45_E2.style.visibility = "visible";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        bitsToPush = true;
                        bits_value = p45;
                        Eve.push(bits_value);
                        console.log("Eve's here: ", p45);
                        overallE[eCount] = Diagonal.Overall;
                        eCount++;
                        e_basis[j] = Diagonal.P45;
                        j++;

                    } else {
                        //N45
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "visible";
                        pol_N45_E2.style.visibility = "visible";

                        bitsToPush = true;
                        bits_value = n45;
                        Eve.push(bits_value);
                        console.log("Eve's here: ", n45);
                        overallE[eCount] = Diagonal.Overall;
                        eCount++;
                        e_basis[j] = Diagonal.N45;
                        j++;
                    }
                } else {
                    eR = Math.floor(Math.random() * 2);
                    //0 is H, 1 is V
                    if (eR == 0) {
                        //H
                        pol_H_E1.style.visibility = "visible";
                        pol_H_E2.style.visibility = "visible";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        Eve.push(h);
                        console.log("Eve's here and guess correctly: ", h);
                        overallE[eCount] = Rectilinear.Overall;
                        eCount++;
                        e_basis[j] = Rectilinear.Horizontal;
                        j++;

                    } else {
                        //V
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "visible";
                        pol_V_E2.style.visibility = "visible";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        Eve.push(v);
                        console.log("Eve's here and guess correctly: ", v);
                        overallE[eCount] = Rectilinear.Overall;
                        eCount++;
                        e_basis[j] = Rectilinear.Vertical;
                        j++;
                    }
                }
            }
        }
        //Alice: P45/N45
        else {
            xD = Math.floor(Math.random() * 2);
            //0 is P45, 1 is N45 
            if (xD == 0) {
                //P45'
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "hidden";
                pol_P45_A.style.visibility = "visible";
                pol_N45_A.style.visibility = "hidden";

                css_ani();
                Alice.push(p45);
                console.log("Alice P45: ", Alice);
                overallA[aCount] = Diagonal.Overall;
                aCount++;
                a_basis[i] = Diagonal.P45;
                i++;

            } else {
                //N45
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "hidden";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "visible";

                css_ani();
                Alice.push(n45);
                console.log("Alice N45: ", Alice);
                overallA[aCount] = Diagonal.Overall;
                aCount++;
                a_basis[i] = Diagonal.N45;
                i++;
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
                        pol_H_E1.style.visibility = "visible";
                        pol_H_E2.style.visibility = "visible";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        bitsToPush = true;
                        bits_value = h;
                        Eve.push(bits_value);
                        console.log("Eve's here: ", h);
                        overallE[eCount] = Rectilinear.Overall;
                        eCount++;
                        e_basis[j] = Rectilinear.Horizontal;
                        j++;

                    } else {
                        //V
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "visible";
                        pol_V_E2.style.visibility = "visible";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        bitsToPush = true;
                        bits_value = v;
                        Eve.push(bits_value);
                        console.log("Eve's here: ", v);
                        overallE[eCount] = Rectilinear.Overall;
                        eCount++;
                        e_basis[j] = Rectilinear.Vertical;
                        j++;
                    }
                } else {
                    eD = Math.floor(Math.random() * 2);
                    //0 is p45, 1 is n45
                    if (eD == 0) {
                        //P45
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "visible";
                        pol_P45_E2.style.visibility = "visible";
                        pol_N45_E1.style.visibility = "hidden";
                        pol_N45_E2.style.visibility = "hidden";

                        Eve.push(p45);
                        console.log("Eve's here and guess correctly: ", p45);
                        overallE[eCount] = Diagonal.Overall;
                        eCount++;
                        e_basis[j] = Diagonal.P45;
                        j++;

                    } else {
                        //N45
                        pol_H_E1.style.visibility = "hidden";
                        pol_H_E2.style.visibility = "hidden";
                        pol_V_E1.style.visibility = "hidden";
                        pol_V_E2.style.visibility = "hidden";
                        pol_P45_E1.style.visibility = "hidden";
                        pol_P45_E2.style.visibility = "hidden";
                        pol_N45_E1.style.visibility = "visible";
                        pol_N45_E2.style.visibility = "visible";

                        Eve.push(n45);
                        console.log("Eve's here and guess correctly: ", n45);
                        overallE[eCount] = Diagonal.Overall;
                        eCount++;
                        e_basis[j] = Diagonal.N45;
                        j++;
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
                //V
                pol_V_B.style.visibility = "visible";
                pol_H_B.style.visibility = "hidden";
                pol_P45_B.style.visibility = "hidden";
                pol_N45_B.style.visibility = "hidden";

                if (bitsToPush === true) {
                    Bob.push(bits_value);
                } else { Bob.push(v); }
                console.log("Bob Vertical: ", Bob);
                overallB[bCount] = Rectilinear.Overall;
                bCount++;
                b_basis[k] = Rectilinear.Vertical;
                k++;

            } else {
                //H
                pol_V_B.style.visibility = "hidden";
                pol_H_B.style.visibility = "visible";
                pol_P45_B.style.visibility = "hidden";
                pol_N45_B.style.visibility = "hidden";

                if (bitsToPush === true) {
                    Bob.push(bits_value);
                } else { Bob.push(h); }
                console.log("Bob Horizontal: ", Bob);
                overallB[bCount] = Rectilinear.Overall;
                bCount++;
                b_basis[k] = Rectilinear.Horizontal;
                k++;
            }

            bitsToPush = false;
        }
        //Bob: P45/N45 
        else {
            //bob switch between yD
            yD = Math.floor(Math.random() * 2);
            if (yD == 0) {
                //P45
                pol_V_B.style.visibility = "hidden";
                pol_H_B.style.visibility = "hidden";
                pol_P45_B.style.visibility = "visible";
                pol_N45_B.style.visibility = "hidden";

                if (bitsToPush === true) {
                    Bob.push(bits_value);
                } else { Bob.push(p45); }
                console.log("Bob P45: ", Bob);
                overallB[bCount] = Diagonal.Overall;
                bCount++;
                b_basis[k] = Diagonal.P45;
                k++;

            } else {
                //N45
                pol_V_B.style.visibility = "hidden";
                pol_H_B.style.visibility = "hidden";
                pol_P45_B.style.visibility = "hidden";
                pol_N45_B.style.visibility = "visible";

                if (bitsToPush === true) {
                    Bob.push(bits_value);
                } else { Bob.push(n45); }
                console.log("Bob N45: ", Bob);
                overallB[bCount] = Diagonal.Overall;
                bCount++;
                b_basis[k] = Diagonal.N45;
                k++;
            }

            bitsToPush = false;
        }
    }
 
    //Display the results to corresponding tables
    displayTable();
    displaySameBaseTable();
}

//Fast forward 15 Photons
function fast15Photons() {
    for (var fast = 0; fast < 15; fast++) {
        fire();
    }
}

//Send Continuously
var x = false;
var interval;
document.getElementById("continuous").onclick = function () {

    if (!x) {
        document.getElementById("continuous").innerHTML = "Stop"; //change the button text
        document.getElementById("single").disabled = true; //Disable the send single photons button

        interval = setInterval(fire, 2000);
        x = true;

    } else {
        document.getElementById("continuous").innerHTML = "Send Continuously"; //change the button text
        document.getElementById("single").disabled = false; //Enable the send single photons button

        clearInterval(interval);
        x = false;
    }
}

//Display the bit details in the table
var table1 = document.getElementById("bitsDetailsTable"); //get the table
var row1, rowCount1 = 1; //var and counter for rows
var cellA, cellB, cellE, cellCountA = 1, cellCountE = 2, cellCountB = 3, sameBaseCount = 4, resultBitCount = 5; //var and counter for ABE cells
var sameBase, resultBit;
var a = 0, b = 0, e = 0; //counter for ABE bit array
var overallCountA = 0, overallCountB = 0, overallCountE = 0; //counter for ABE Overall Basis
var m = 0, n = 0;
function displayTable() {

    //Display Alice Bob Eve bits details
    row1 = table1.rows[rowCount1];
    cellA = row1.cells[cellCountA];
    cellE = row1.cells[cellCountE];
    cellB = row1.cells[cellCountB];
    sameBase = row1.cells[sameBaseCount];
    resultBit = row1.cells[resultBitCount];

    //Toggle between the background color animation class
    row1.classList.remove("tr");
    setTimeout(() => {
        row1.classList.add("tr");
    }, 1);

    //Alice
    cellA.innerHTML = overallA[overallCountA] + ": " + Alice[a];

    //Eve
    if (eve_state == true) {
        cellE.innerHTML = overallE[overallCountE] + ": " + Eve[e];
        overallCountE++;
        e++;
    }

    //Bob
    cellB.innerHTML = overallB[overallCountB] + ": " + Bob[b];

    //Same base?
    if (overallA[overallCountA] == overallB[overallCountB]) {
        sameBase.innerHTML = "Yes";
    } else { sameBase.innerHTML = "No"; }

    //Result Bit
    switch (b_basis[m]) {
        case Rectilinear.Horizontal: if (a_basis[n] == b_basis[m] && Bob[b] !== h) {
            resultBit.classList.remove("resultBit");
            setTimeout(() => {
                resultBit.classList.add("resultBit");
            }, 1);
        } break;
        case Rectilinear.Vertical: if (a_basis[n] == b_basis[m] && Bob[b] !== v) {
            resultBit.classList.remove("resultBit");
            setTimeout(() => {
                resultBit.classList.add("resultBit");
            }, 1);
        } break;
        case Diagonal.P45: if (a_basis[n] == b_basis[m] && Bob[b] !== p45) {
            resultBit.classList.remove("resultBit");
            setTimeout(() => {
                resultBit.classList.add("resultBit");
            }, 1);
        } break;
        case Diagonal.N45: if (a_basis[n] == b_basis[m] && Bob[b] !== n45) {
            resultBit.classList.remove("resultBit");
            setTimeout(() => {
                resultBit.classList.add("resultBit");
            }, 1);
        } break;
        default: break;
    }
    resultBit.innerHTML = Bob[b];

    //Increase and reset the counters
    overallCountA++; overallCountB++;
    a++; b++; m++; n++;

    rowCount1++;
    if (rowCount1 > 5) { rowCount1 = 1; }
}

//Display the bits of same base of AB
var table2 = document.getElementById("bitsSameBaseTable");
var row2, rowCount2 = 1;
var cell1, cell2, cell1Count = 0, cell2Count = 1;
var c = 0, dd = 0, z = 0, y = 0, g = 0, f = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, w = 0, aa = 0, bb = 0, p_count = 0, p_state_count = 0;
var newAlice = [], newBob = [];
var newOverallA = [], newOverallB = [], new_a_basis = [], new_b_basis = [];
document.getElementById("compare").disabled = true;
function displaySameBaseTable() {

    row2 = table2.rows[rowCount2];
    cell1 = row2.cells[cell1Count];
    cell2 = row2.cells[cell2Count];


    if (overallA[c] == overallB[dd]) {
        cell1.innerHTML += Alice[z] + "\n";
        cell2.innerHTML += Bob[y] + "\n";

        newAlice[g] = Alice[z];
        newBob[f] = Bob[y];

        newOverallA[o] = overallA[u];
        newOverallB[p] = overallB[w];

        new_a_basis[s] = a_basis[aa];
        new_b_basis[t] = b_basis[bb];

        p_state_array[p_state_count] = p_state;
        p_state_count++; 

        g++; f++; o++; p++; s++; t++; 

        p_count++;
    }
    c++; dd++; u++; w++; z++; y++; aa++; bb++;

    //Enable the compare buttons when the number of same base bits reach 30
    if (p_count >= 30) {
        document.getElementById("compare").disabled = false;
        //Store and send the corresponding variables to the next page
        document.getElementById("compare").onclick = function () { 
            document.location = '/compareBits.html'; 
            localStorage.setItem("NewAliceArray", JSON.stringify(newAlice));
            localStorage.setItem("NewBobArray", JSON.stringify(newBob));
            localStorage.setItem("NewOverallAliceArray", JSON.stringify(newOverallA));
            localStorage.setItem("NewOverallBobArray", JSON.stringify(newOverallB));
            localStorage.setItem("NewAliceBasis", JSON.stringify(new_a_basis));
            localStorage.setItem("NewBobBasis", JSON.stringify(new_b_basis));
            localStorage.setItem("NewPStateArray", JSON.stringify(p_state_array));
        }
    }
}

//Clear everything
function clearEverything() {
    //Restore and Clear everything to default settings
    if (document.getElementById("1").checked) { document.getElementById("1").checked = false; } //Uncheck the pol state
    if (document.getElementById("2").checked) { document.getElementById("2").checked = false; } //Uncheck the pol state

    //Restore back to default fixed pol base settings
    if (document.getElementById("randomP").checked) {
        document.getElementById("randomP").checked = false;
        document.getElementById("fixedP").checked = true;
        document.getElementById("aliceOptHV").disabled = false;
        document.getElementById("aliceOpt45").disabled = false;
        document.getElementById("bobOptHV").disabled = false;
        document.getElementById("bobOpt45").disabled = false;
    }

    //Clear Eve
    if (document.getElementById("eavesdrop").innerHTML = "Stop Eavesdropping") {
        eve_state = false;
        eve_display = false;

        document.getElementById("eve").style.visibility = "hidden";
        pol_H_E1.style.visibility = "hidden";
        pol_H_E2.style.visibility = "hidden";
        pol_V_E1.style.visibility = "hidden";
        pol_V_E2.style.visibility = "hidden";
        pol_P45_E1.style.visibility = "hidden";
        pol_P45_E2.style.visibility = "hidden";
        pol_N45_E1.style.visibility = "hidden";
        pol_N45_E2.style.visibility = "hidden";

        document.getElementById("eavesdrop").innerHTML = "Eavesdrop";
    }

    //Clear all the arrays
    Alice = []; Bob = []; overallA = []; overallB = []; overallE = []; a_basis = []; b_basis = []; e_basis = [];
    newAlice = []; newBob = []; newOverallA = []; newOverallB = []; new_a_basis = []; new_b_basis = []; p_state_array = [];

    //Clear arrays counters
    i = 0; j = 0; k = 0;
    aCount = 0; bCount = 0; eCount = 0; p_state_count = 0; p_state = 0;

    //Clear fire() parameters
    h = 0; v = 0; p45 = 0; n45 = 0;
    xR = 0; yR = 0; xD = 0; yD = 0; eR = 0; eD = 0; d = 0;
    aB = 0; bB = 0; eB = 0;
    bitsToPush = false; bits_value = 0;
    alice_45 = false; bob_45 = false;

    //Alice Bob default display
    pol_V_A.style.visibility = "visible";
    pol_H_A.style.visibility = "hidden";
    pol_P45_A.style.visibility = "hidden";
    pol_N45_A.style.visibility = "hidden";

    pol_V_B.style.visibility = "visible";
    pol_H_B.style.visibility = "hidden";
    pol_P45_B.style.visibility = "hidden";
    pol_N45_B.style.visibility = "hidden";

    if (document.getElementById("aliceOpt45").checked == true || document.getElementById("bobOpt45").checked == true) {
        document.getElementById("aliceOpt45").checked = false;
        document.getElementById("aliceOptHV").checked = true;
        document.getElementById("bobOpt45").checked = false;
        document.getElementById("bobOptHV").checked = true;
    }

    //Clear the bit details table display
    for (var ii = 1; ii < table1.rows.length; ii++) {

        for (var hh = 1; hh < 6; hh++) { 
            table1.rows[ii].cells[hh].innerHTML = ""; 
        }
    }

    rowCount1 = 1;
    cellCountA = 1; cellCountE = 2; cellCountB = 3; sameBaseCount = 4; resultBitCount = 5;
    a = 0; b = 0; e = 0; m = 0; n = 0;
    overallCountA = 0; overallCountB = 0; overallCountE = 0;

    //Clear same base table display
    cell1.innerHTML = "";
    cell2.innerHTML = "";
    cell1Count = 0; cell2Count = 1;
    rowCount2 = 1;
    c = 0; dd = 0; z = 0; y = 0; g = 0; f = 0; o = 0; p = 0; q = 0; r = 0; s = 0; t = 0; u = 0; w = 0; aa = 0; bb = 0; p_count = 0;

    document.getElementById("compare").disabled = true;
}

/* for (i = 0; i < newOverallA.length; i++) {
    if (newOverallA[i] == newOverallB[i]) {
        console.log(i + ": Yes");
    } else {
        console.log(i + ": No");
    }
} */

/* for (i = 0; i < new_a_basis.length; i++) {
    if (new_a_basis[i] == new_b_basis[i]) {
        console.log(i + ": Yes");
    } else {
        console.log(i + ": No");
    }
} */