var paperColors = ["pinkPaper", "yellowPaper", "bluePaper", "greenPaper"];

//controler used to remove listeners
const Controller = new AbortController();
const { Signal } = Controller;

//makes creating random ints more intuitive
function getRandomInt(min, max) {
    //transforms and scales a random number 0-1 into a random int in a defined range
    return Math.floor((Math.random() * (max - min)) + min);
}

//removes the note of the passed in pin
function removeNote(pin) {
    pin.parentElement.remove();
}

//creates a new note element that follows the users mouse till they click
function createNote() {
    //creates a note element and assigns a random color and orientation
    note = document.createElement("div");
    note.setAttribute('class', 'paper');
    note.setAttribute('id', paperColors[getRandomInt(0, 4)]);
    //dont change rotation range as less than -10 causes click errors
    //if needed will need to change onclick into a mouse down listener
    note.style.transform = 'rotate(' + getRandomInt(-10, 20) + 'deg)'; 

    //creates pin with random orientation
    pin = document.createElement("div");
    pin.setAttribute('class', 'pin');
    //removes the note if clicked
    pin.setAttribute('onclick', 'removeNote(this)');
    pin.style.transform = 'rotate(' + getRandomInt(0,45) + 'deg)'; 

    //creates visuals of a pin
    shadow = document.createElement("div");
    shadow.setAttribute('class', 'shadow');
    metal = document.createElement("div");
    metal.setAttribute('class', 'metal');
    bottomCircle = document.createElement("div");
    bottomCircle.setAttribute('class', 'bottom-circle');
    //visual sign for clarity, this pin deletes the note
    sign = document.createElement("div");
    sign.setAttribute('class', 'sign');
    sign.innerHTML = "-";

    //creates text area with placeholder on note
    noteText = document.createElement("textarea");
    noteText.placeholder = "Create New Note";

    //adds pin visuals to pin
    pin.appendChild(shadow);
    pin.appendChild(metal);
    pin.appendChild(bottomCircle);
    pin.appendChild(sign);

    //adds pin to note
    note.appendChild(pin);
    //adds text area to note
    note.appendChild(noteText);

    //adds note and its children to the noteboard
    noteBoard = document.getElementById("ToDos");
    noteBoard.appendChild(note);

    //makes the note follow the cursor
    followCursor(note);
    //places note once it is clicked
    note.setAttribute("onclick", "setNote(note)");
}

//used to place a note and stop it from following the cursor
function setNote(note) {
    //clones note
    newNote = note.cloneNode(true);
    //deletes note and its listener
    Controller.abort();
    //adds back in the note using the clone
    document.getElementById("ToDos").appendChild(newNote);
    //removes the onclick event as no longer needed once note stops following
    newNote.removeAttribute("onclick");
}

//causes passed in element to follow cursor
function followCursor(follower) {
    follower.style.position = 'absolute';
    //adds listener to track mouse location
    document.addEventListener('mousemove', (e) => {
        //sets the location of element to same as mouse 
        //offset to look like the note is held by the pin
        follower.style.top = (e.pageY - 25) + 'px';
        follower.style.left = (e.pageX - 20)  + 'px';
    }, { Signal });
}