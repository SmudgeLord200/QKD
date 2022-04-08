const draggableElements = document.querySelectorAll(".draggable");
const droppableElements = document.querySelectorAll(".droppable");
const totalDraggableItems = 4;
const totalMatchingPairs = 4; 
const playAgainBtn = document.getElementById("play-again-btn");
const msg = document.getElementById("msg");
var correct = 0;

hideMsg();
hideBtn();

function hideMsg() {
    msg.style.visibility = "hidden";
}

function hideBtn() {
    playAgainBtn.style.visibility = "hidden";
}

//Event Listeners for Drag Elements
draggableElements.forEach(elements => {
    elements.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text", e.target.id);
    });
});

//Event Listners for Drop Elements
droppableElements.forEach(elements => {
    //drag enter
    elements.addEventListener("dragenter", (e) => {
        if (e.target.classList && e.target.classList.contains("droppable") && !e.target.classList.contains("dropped")) {
            e.target.classList.add("droppable-hover");
        }
    });

    //drag over
    elements.addEventListener("dragover", (e) => {
        if (e.target.classList && e.target.classList.contains("droppable") && !e.target.classList.contains("dropped")) {
            e.preventDefault();
        }
    });

    //drag leave
    elements.addEventListener("dragleave", (e) => {
        if (e.target.classList && e.target.classList.contains("droppable") && !e.target.classList.contains("dropped")) {
            e.target.classList.remove("droppable-hover");
        }
    });

    //drop
    elements.addEventListener("drop", (e) => {
        e.preventDefault();
        e.target.classList.remove("droppable-hover");
        const draggableElementData = e.dataTransfer.getData("text");
        const droppableElementData = e.target.getAttribute("data-draggable-id");
        const isMatch = draggableElementData == droppableElementData;
        if (isMatch) {
            e.target.classList.add("dropped");
            const draggableElement = document.getElementById(draggableElementData);
            draggableElement.classList.add("dragged");
            draggableElement.setAttribute("draggable", "false");
            var path = "/Photos/Pol-" + draggableElementData + ".png";
            e.target.insertAdjacentHTML("afterbegin", `<img id="${draggableElementData}" src="${path}">`);
            correct++;
            // Game Over
            if (correct == Math.min(totalMatchingPairs, totalDraggableItems)) { 
                msg.style.visibility = "visible";
                playAgainBtn.style.visibility = "visible";
            }
        }
    });
});

//Play Again Button
playAgainBtn.addEventListener("click", playAgainBtnClick);

function playAgainBtnClick() {
    correct = 0;

    //Remove the relevant classes for draggable elements
    for (let i = 0; i < draggableElements.length; i++) {
        draggableElements[i].classList.remove("dragged");
        draggableElements[i].setAttribute("draggable", "true");
    }

    //Remove the relevant classes for droppable elements
    for (let i = 0; i < droppableElements.length; i++) {
        droppableElements[i].classList.remove("dropped");
        droppableElements[i].removeChild(document.getElementsByClassName("droppable")[i].firstChild);
    }

    hideMsg();
    hideBtn();
}