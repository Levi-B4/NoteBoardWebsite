var paperColors = ["pinkPaper", "yellowPaper", "bluePaper", "greenPaper"];

function getRandomInt(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}

function removeNote(note) {
    note.parentElement.remove();
}

function createNote() {
    noteBoard = document.getElementById("ToDos");

    note = document.createElement("div");
    note.setAttribute('class', 'paper');
    note.setAttribute('id', paperColors[getRandomInt(0, 4)]);
    note.style.transform = 'rotate(' + getRandomInt(-20, 20) + 'deg)'; 

    pin = document.createElement("div");
    pin.setAttribute('class', 'pin');
    pin.setAttribute('onclick', 'removeNote(this)');
    pin.style.transform = 'rotate(' + getRandomInt(0,45) + 'deg)'; 


    shadow = document.createElement("div");
    shadow.setAttribute('class', 'shadow');
    
    metal = document.createElement("div");
    metal.setAttribute('class', 'metal');

    bottomCircle = document.createElement("div");
    bottomCircle.setAttribute('class', 'bottom-circle');

    sign = document.createElement("div");
    sign.setAttribute('class', 'sign');
    sign.innerHTML = "-";

    noteText = document.createElement("textarea");
    noteText.placeholder = "Create New Note";

    pin.appendChild(shadow);
    pin.appendChild(metal);
    pin.appendChild(bottomCircle);
    pin.appendChild(sign);


    note.appendChild(pin);
    note.appendChild(noteText);

    noteBoard.appendChild(note, pin, shadow, metal, bottomCircle, sign);

    note.followCursor(this);
}


function followCursor(follower) {
     follower.style.position = 'absolute';
     //follower.style.left = event.pageX; --depricated
}