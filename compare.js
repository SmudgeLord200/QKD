//Retrieve the items from local storage
var newAliceArray = JSON.parse(localStorage.getItem("NewAliceArray"));
var newBobArray = JSON.parse(localStorage.getItem("NewBobArray"));
var newOverallAliceArray = JSON.parse(localStorage.getItem("NewOverallAliceArray"));
var newOverallBobArray = JSON.parse(localStorage.getItem("NewOverallBobArray"));
var newAliceBasis = JSON.parse(localStorage.getItem("NewAliceBasis"));
var newBobBasis = JSON.parse(localStorage.getItem("NewBobBasis"));
var newPStateArray = JSON.parse(localStorage.getItem("NewPStateArray"));

var finalArray = [], final_count = 0;
var h = 0, v = 0, p45 = 0, n45 = 0;

var Rectilinear = { Overall: "H/V", Horizontal: "Horizontal", Vertical: "Vertical" }; //Basis comparison
var Diagonal = { Overall: "P45/N45", P45: "P45", N45: "N45" }; //Basis comparison

//Display the corresponding arrays first
document.getElementById("Alice").innerHTML = newAliceArray.join(' ');
document.getElementById("Bob").innerHTML = newBobArray.join(' ');

//Compare bits function
document.getElementById("next").disabled = true;
var ax = [], bx = [], ax_count = 0, bx_count = 0, i_th = [], i_th_count = 0;
function compareBits() {
    document.getElementById("next").disabled = false;

    //Loop through the whole array
    for (var i = 0; i < newBobArray.length; i++) {

        //Check if the overall basis of the two are the same
        if (newOverallAliceArray[i] == newOverallBobArray[i]) {

            //Check the p state and assign corresponding bit value
            switch (newPStateArray[i]) {
                case 1:
                    h = 1;
                    v = 0;
                    p45 = 1;
                    n45 = 0;
                    break;
                case 2:
                    h = 0;
                    v = 1;
                    p45 = 0;
                    n45 = 1;
                    break;
                default: break;
            }

            //Check for sub-basis
            if (newAliceBasis[i] == newBobBasis[i]) {

                switch (newBobBasis[i]) {
                    case Rectilinear.Horizontal:
                        if (newBobArray[i] == h) {
                            finalArray[final_count] = newBobArray[i]; //if match bit value, store it to the final array
                        } else {
                            //Highlight the different bit (Eve)
                            finalArray[final_count] = newBobArray[i];
                            i_th[i_th_count] = i;
                            console.log("Eve H" + " " + i_th[i_th_count] + " " + newBobArray[i]); i_th_count++;
                            console.log("Bob different bit at array [" + i + "]: " + newBobArray[i]);
                        } 
                        ax[ax_count] = newAliceBasis[i];
                        bx[bx_count] = newBobBasis[i];
                        ax_count++; bx_count++; final_count++;
                        break;

                    case Rectilinear.Vertical:
                        if (newBobArray[i] == v) {
                            finalArray[final_count] = newBobArray[i]; //if match bit value, store it to the final array
                        } else {
                            //Highlight the different bit (Eve)
                            finalArray[final_count] = newBobArray[i];
                            i_th[i_th_count] = i;
                            console.log("Eve V" + " " + i_th[i_th_count] + " " + newBobArray[i]); i_th_count++;
                            console.log("Bob different bit at array [" + i + "]: " + newBobArray[i]);
                        } 
                        ax[ax_count] = newAliceBasis[i];
                        bx[bx_count] = newBobBasis[i];
                        ax_count++; bx_count++; final_count++;
                        break;

                    case Diagonal.P45:
                        if (newBobArray[i] == p45) {
                            finalArray[final_count] = newBobArray[i]; //if match bit value, store it to the final array
                        } else {
                            //Highlight the different bit (Eve)
                            finalArray[final_count] = newBobArray[i];
                            i_th[i_th_count] = i;
                            console.log("Eve P45" + " " + i_th[i_th_count] + " " + newBobArray[i]); i_th_count++;
                            console.log("Bob different bit at array [" + i + "]: " + newBobArray[i]);
                        } 
                        ax[ax_count] = newAliceBasis[i];
                        bx[bx_count] = newBobBasis[i];
                        ax_count++; bx_count++; final_count++;
                        break;

                    case Diagonal.N45: 
                        if (newBobArray[i] == n45) {
                            finalArray[final_count] = newBobArray[i];
                         } else {
                             //Highlight the different bit (Eve)
                             finalArray[final_count] = newBobArray[i];
                             i_th[i_th_count] = i; 
                             console.log("Eve N45" + " " + i_th[i_th_count] + " " + newBobArray[i]); i_th_count++;
                             console.log("Bob different bit at array [" + i + "]: " + newBobArray[i]);
                         } 
                         ax[ax_count] = newAliceBasis[i];
                         bx[bx_count] = newBobBasis[i];
                         ax_count++; bx_count++; final_count++;
                         break;
                    default: break;
                }

            } else {
                //Discard the bits (animation here)
                console.log("Discard bit at array [" +  i + "]: " + newBobArray[i]);
            }

        } else { console.log("WTF at " + i); }
    }
}

//When the next button is clicked
document.getElementById("next").onclick = function () {
    document.location = "/gameSuccessPage.html";
} 

for (i = 0; i < newAliceBasis.length; i++) {
    if (newOverallAliceArray[i] == newOverallBobArray[i]) {
        console.log(i + ": Yes");
    } else {
        console.log(i + ": No");
    }
}

//newAliceBasis, newBobBasis, newOverallAliceArray, newOverallBobArray, newAliceArray, newBobArray