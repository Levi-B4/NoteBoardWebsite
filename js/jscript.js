var paperTypes = [[1,2],[2,3],[3,4],[4,5]];

function removeNote() {
    note = document.getElementById("pinkPaper");

    note.remove();
}

function addNote() {
    noteBoard = document.getElementById("ToDos");

    note = document.createElement("div");
    note.setAttribute('class', 'paper');
    note.setAttribute('id', 'pinkPaper');

    pin = document.createElement("div");
    pin.setAttribute('class', 'pin');
    pin.setAttribute('onclick', 'removeNote()');

    shadow = document.createElement("div");
    shadow.setAttribute('class', 'shadow');
    
    metal = document.createElement("div");
    metal.setAttribute('class', 'metal');

    bottomCircle = document.createElement("div");
    bottomCircle.setAttribute('class', 'bottom-circle');

    sign = document.createElement("div");
    sign.setAttribute('class', 'sign');
    sign.innerHTML = "-";

    noteText = document.createElement("p");
    noteText.innerHTML = "Create New Note";

    pin.appendChild(shadow);
    pin.appendChild(metal);
    pin.appendChild(bottomCircle);
    pin.appendChild(sign);


    note.appendChild(pin);
    note.appendChild(noteText);

    noteBoard.appendChild(note, pin, shadow, metal, bottomCircle, sign);

}