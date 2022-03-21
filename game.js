var alice_45 = false, bob_45 = false; //false: Rectilinear, true: Diagonal
var eve_state = false, eve_display = false; //false: no eavesdrop, true: has eavesdrop
var Alice = [], Bob = [], Eve = []; //Initialize three arrays for storing bit sequences
var h = 0, v = 0, p45 = 0, n45 = 0; //Bit orientation
var xR = 0, yR = 0, xD = 0, yD = 0, eR = 0, eD = 0, d = 0; //Random parameters for basis
var aB = 0, bB = 0, eB = 0; //Randoms for Alice's and Bob's and Eve's in random basis
var bitsToPush = false, bits_value = 0; //Bits to push to Bob's array after Eve is here

var Rectilinear = { Overall: "H/V", Horizontal: "Horizontal", Vertical: "Vertical" }; //Basis comparison
var Diagonal = { Overall: "P45/N45", P45: "P45", N45: "N45" }; //Basis comparison

var a_basis = Array(5).fill(''); //Basis Array all parties, maximum size is 5 since there are 5 rows in the table
var b_basis = Array(5).fill(''); //Basis Array all parties, maximum size is 5 since there are 5 rows in the table
var e_basis = Array(5).fill(''); //Basis Array all parties, maximum size is 5 since there are 5 rows in the table

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
document.getElementById("1").onclick = function () {
    h = 1;
    v = 0;
    p45 = 1;
    n45 = 0;
}

//Polarization State Assignment
document.getElementById("2").onclick = function () {
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
var overallA, overallB, overallE;
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
                overallA = Rectilinear.Overall;
                a_basis[i] = Rectilinear.Vertical;
                i++;
                if (i > 4) { i = 0; }
                displayTable();

            } else {
                //H
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "visible";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "hidden";

                css_ani();
                Alice.push(h);
                console.log("Alice Horizontal: ", Alice);
                overallA = Rectilinear.Overall;
                a_basis[i] = Rectilinear.Horizontal;
                i++;
                if (i > 4) { i = 0; }
                displayTable();
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
                        console.log("Eve's here: ", p45);
                        Eve.push(bits_value);
                        overallE = Diagonal.Overall;
                        e_basis[j] = Diagonal.P45;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();

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
                        console.log("Eve's here: ", n45);
                        Eve.push(bits_value);
                        overallE = Diagonal.Overall;
                        e_basis[j] = Diagonal.N45;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();
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

                        console.log("Eve's here and guess correctly");
                        Eve.push(h);
                        overallE = Rectilinear.Overall;
                        e_basis[j] = Rectilinear.Horizontal;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();

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

                        console.log("Eve's here and guess correctly");
                        Eve.push(v);
                        overallE = Rectilinear.Overall;
                        e_basis[j] = Rectilinear.Vertical;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();
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
                overallB = Rectilinear.Overall;
                b_basis[k] = Rectilinear.Vertical;
                k++;
                if (k > 4) { k = 0; }
                displayTable();

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
                overallB = Rectilinear.Overall;
                b_basis[k] = Rectilinear.Horizontal;
                k++;
                if (k > 4) { k = 0; }
                displayTable();
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
                //P45
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "hidden";
                pol_P45_A.style.visibility = "visible";
                pol_N45_A.style.visibility = "hidden";

                css_ani();
                Alice.push(p45);
                console.log("Alice P45: ", Alice);
                overallA = Diagonal.Overall;
                a_basis[i] = Diagonal.P45;
                i++;
                if (i > 4) { i = 0; }
                displayTable();

            } else {
                //N45
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "hidden";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "visible";

                css_ani();
                Alice.push(n45);
                console.log("Alice N45: ", Alice);
                overallA = Diagonal.Overall;
                a_basis[i] = Diagonal.N45;
                i++;
                if (i > 4) { i = 0; }
                displayTable();
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
                        console.log("Eve's here: ", h);
                        Eve.push(bits_value);
                        overallE = Rectilinear.Overall;
                        e_basis[j] = Rectilinear.Horizontal;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();

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
                        console.log("Eve's here: ", v);
                        Eve.push(bits_value);
                        overallE = Rectilinear.Overall;
                        e_basis[j] = Rectilinear.Vertical;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();
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

                        console.log("Eve's here and guess correctly");
                        Eve.push(p45);
                        overallE = Diagonal.Overall;
                        e_basis[j] = Diagonal.P45;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();

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

                        console.log("Eve's here and guess correctly");
                        Eve.push(n45);
                        overallE = Diagonal.Overall;
                        e_basis[j] = Diagonal.N45;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();
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
                overallB = Diagonal.Overall;
                b_basis[k] = Diagonal.P45;
                k++;
                if (k > 4) { k = 0; }
                displayTable();

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
                overallB = Diagonal.Overall;
                b_basis[k] = Diagonal.N45;
                k++;
                if (k > 4) { k = 0; }
                displayTable();
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
                    overallA = Rectilinear.Overall;
                    a_basis[i] = Rectilinear.Vertical;
                    i++;
                    if (i > 4) { i = 0; }
                    displayTable();

                } else {
                    //H
                    pol_V_A.style.visibility = "hidden";
                    pol_H_A.style.visibility = "visible";
                    pol_P45_A.style.visibility = "hidden";
                    pol_N45_A.style.visibility = "hidden";

                    css_ani();
                    Alice.push(h);
                    console.log("Alice Horizontal: ", Alice);
                    overallA = Rectilinear.Overall;
                    a_basis[i] = Rectilinear.Horizontal;
                    i++;
                    if (i > 4) { i = 0; }
                    displayTable();
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
                            console.log("Eve's here: ", p45);
                            Eve.push(bits_value);
                            overallE = Diagonal.Overall;
                            e_basis[j] = Diagonal.P45;
                            j++;
                            if (j > 4) { j = 0; }
                            displayTable();

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
                            console.log("Eve's here: ", n45);
                            Eve.push(bits_value);
                            overallE = Diagonal.Overall;
                            e_basis[j] = Diagonal.N45;
                            j++;
                            if (j > 4) { j = 0; }
                            displayTable();
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

                            console.log("Eve's here and guess correctly");
                            Eve.push(h);
                            overallE = Rectilinear.Overall;
                            e_basis[j] = Rectilinear.Horizontal;
                            j++;
                            if (j > 4) { j = 0; }

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

                            console.log("Eve's here and guess correctly");
                            Eve.push(v);
                            overallE = Rectilinear.Overall;
                            e_basis[j] = Rectilinear.Vertical;
                            j++;
                            if (j > 4) { j = 0; }
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
                    overallB = Diagonal.Overall;
                    b_basis[k] = Diagonal.P45;
                    k++;
                    if (k > 4) { k = 0; }
                    displayTable();

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
                    overallB = Diagonal.Overall;
                    b_basis[k] = Diagonal.N45;
                    k++;
                    if (k > 4) { k = 0; }
                    displayTable();
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
                    overallA = Diagonal.Overall;
                    a_basis[i] = Diagonal.P45;
                    i++;
                    if (i > 4) { i = 0; }
                    displayTable();

                } else {
                    //N45
                    pol_V_A.style.visibility = "hidden";
                    pol_H_A.style.visibility = "hidden";
                    pol_P45_A.style.visibility = "hidden";
                    pol_N45_A.style.visibility = "visible";

                    css_ani();
                    Alice.push(n45);
                    console.log("Alice N45: ", Alice);
                    overallA = Diagonal.Overall;
                    a_basis[i] = Diagonal.N45;
                    i++;
                    if (i > 4) { i = 0; }
                    displayTable();
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
                            console.log("Eve's here: ", h);
                            overallE = Rectilinear.Overall;
                            e_basis[j] = Rectilinear.Horizontal;
                            j++;
                            if (j > 4) { j = 0; }
                            displayTable();

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
                            console.log("Eve's here: ", v);
                            overallE = Rectilinear.Overall;
                            e_basis[j] = Rectilinear.Vertical;
                            j++;
                            if (j > 4) { j = 0; }
                            displayTable();
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

                            console.log("Eve's here and guess correctly");
                            Eve.push(p45);
                            overallE = Diagonal.Overall;
                            e_basis[j] = Diagonal.P45;
                            j++;
                            if (j > 4) { j = 0; }
                            displayTable();

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

                            console.log("Eve's here and guess correctly");
                            Eve.push(n45);
                            overallE = Diagonal.Overall;
                            e_basis[j] = Diagonal.N45;
                            j++;
                            if (j > 4) { j = 0; }
                            displayTable();
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
                    overallB = Rectilinear.Overall;
                    b_basis[k] = Rectilinear.Vertical;
                    k++;
                    if (k > 4) { k = 0; }
                    displayTable();

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
                    overallB = Rectilinear.Overall;
                    b_basis[k] = Rectilinear.Horizontal;
                    k++;
                    if (k > 4) { k = 0; }
                    displayTable();
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
                overallA = Rectilinear.Overall;
                a_basis[i] = Rectilinear.Vertical;
                i++;
                if (i > 4) { i = 0; }
                displayTable();

            } else {
                //H
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "visible";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "hidden";

                css_ani();
                Alice.push(h);
                console.log("Alice Horizontal: ", Alice);
                overallA = Rectilinear.Overall;
                a_basis[i] = Rectilinear.Horizontal;
                i++;
                if (i > 4) { i = 0; }
                displayTable();
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
                        console.log("Eve's here: ", p45);
                        Eve.push(bits_value);
                        overallE = Diagonal.Overall;
                        e_basis[j] = Diagonal.P45;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();

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
                        console.log("Eve's here: ", n45);
                        Eve.push(bits_value);
                        overallE = Diagonal.Overall;
                        e_basis[j] = Diagonal.N45;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();
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

                        console.log("Eve's here and guess correctly");
                        Eve.push(h);
                        overallE = Rectilinear.Overall;
                        e_basis[j] = Rectilinear.Horizontal;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();

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

                        console.log("Eve's here and guess correctly");
                        Eve.push(v);
                        overallE = Rectilinear.Overall;
                        e_basis[j] = Rectilinear.Vertical;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();
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
                overallA = Diagonal.Overall;
                a_basis[i] = Diagonal.P45;
                i++;
                if (i > 4) { i = 0; }
                displayTable();

            } else {
                //N45
                pol_V_A.style.visibility = "hidden";
                pol_H_A.style.visibility = "hidden";
                pol_P45_A.style.visibility = "hidden";
                pol_N45_A.style.visibility = "visible";

                css_ani();
                Alice.push(n45);
                console.log("Alice N45: ", Alice);
                overallA = Diagonal.Overall;
                a_basis[i] = Diagonal.N45;
                i++;
                if (i > 4) { i = 0; }
                displayTable();
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
                        console.log("Eve's here: ", h);
                        Eve.push(bits_value);
                        overallE = Rectilinear.Overall;
                        e_basis[j] = Rectilinear.Horizontal;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();

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
                        console.log("Eve's here: ", v);
                        Eve.push(bits_value);
                        overallE = Rectilinear.Overall;
                        e_basis[j] = Rectilinear.Vertical;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();
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

                        console.log("Eve's here and guess correctly");
                        Eve.push(p45);
                        overallE = Diagonal.Overall;
                        e_basis[j] = Diagonal.P45;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();

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

                        console.log("Eve's here and guess correctly");
                        Eve.push(n45);
                        overallE = Diagonal.Overall;
                        e_basis[j] = Diagonal.N45;
                        j++;
                        if (j > 4) { j = 0; }
                        displayTable();
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
                overallB = Rectilinear.Overall;
                b_basis[k] = Rectilinear.Vertical;
                k++;
                if (k > 4) { k = 0; }
                displayTable();

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
                overallB = Rectilinear.Overall;
                b_basis[k] = Rectilinear.Horizontal;
                k++;
                if (k > 4) { k = 0; }
                displayTable();
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
                overallB = Diagonal.Overall;
                b_basis[k] = Diagonal.P45;
                k++;
                if (k > 4) { k = 0; }
                displayTable();

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
                overallB = Diagonal.Overall;
                b_basis[k] = Diagonal.N45;
                k++;
                if (k > 4) { k = 0; }
                displayTable();
            }

            bitsToPush = false;
        }
    }
}

//Fast forward 15 Photons
function fast15Photons() {
    for (let i = 0; i < 15; i++) {
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
var table = document.getElementById("bitsDetailsTable");
var row, rowCount = 1;
var cellA, cellB, cellE, cellCountA = 1, cellCountB = 2, cellCountE = 3;
var sameBase = false;
var resultBit = 1;
var a = 0, b = 0, e = 0; //counter for ABE bit array
function displayTable() {

    //Display Alice Bob Eve bits details
    row = table.rows[rowCount];
    cellA = row.cells[cellCountA];
    cellB = row.cells[cellCountB];
    cellE = row.cells[cellCountE];

    //Alice
/*     cellA.innerHTML = overallA + ": " + a;
    a++; */

    //Eve
    if (eve_state == true) {
        cellE.innerHTML = overallE + ": " + Eve[e];
        e++;
    }

    //Bob
/*     cellB.innerHTML = overallB + ": " + b;
    b++; */

    rowCount++;
    if (rowCount > 5) { rowCount = 1; }
}