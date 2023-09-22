//creates new or opens existing database
let db;
//when you (the dev) change the database increment the number once 
//("notesDB2", 2) -> ("notesDB3", 3) -> ("notesDB4", 4)
const openDBRequest = window.indexedDB.open("notesDB5", 5);

//error handler for database opening
openDBRequest.addEventListener("error", () =>
    console.error("Database failed to open"),
);

//success handler for database opening
openDBRequest.addEventListener("success", () => {
    console.log("Database opened successfully");

    //store database to variable
    db = openDBRequest.result;

    //displays data to noteBoard
    displayData();
})

//handler for when database needs to be set up or is of an old version
openDBRequest.addEventListener("upgradeneeded", (e) => {
    db = e.target.result;
    //displays instructions for new users
    displayInstructions();

    //create an object store to store notes and add an auto-incrementing key
    const objectStore = db.createObjectStore("noteboardObjectStore", {
        keyPath: "id",
        autoIncrement: true,
    });

    //define data items to store in db for notes
    objectStore.createIndex("note", "note", { unique: false });
    objectStore.createIndex("color", "color", { unique: false });
    objectStore.createIndex("positionX", "positionX", { unique: false });
    objectStore.createIndex("positionY", "positionY", { unique: false });
    objectStore.createIndex("paperRotation", "paperRotation", { unique: false });
    objectStore.createIndex("pinRotation", "pinRotation", { unique: false });

    console.log("Database setup complete");
	
	//save instructions to database for next visit
	saveToDB();
})

//saves notes to the database
function saveToDB() {
    //deletes old data from database 
    clearDB();
    
	//gets all notes from the board
    let noteElements = document.getElementsByClassName("paper");
    //itterates through all notes to add them to the database
    for (i = 0; i < noteElements.length; i++){
        let noteElement = noteElements.item(i);
        console.log(noteElement);

		//identifies the pin and text of the note
        let noteText = noteElement.lastChild;
        let notePin = noteElement.firstChild;
        //gets the transform of the pin and note
		let paperTransform = noteElement.style.transform;
        let pinTransform = notePin.style.transform;

		//creates note object to save to the database
        const newNote = { 
            note: noteText.textContent,
            color: noteElement.id,
            positionX: noteElement.style.left,
            positionY: noteElement.style.top,
            paperRotation: paperTransform,
            pinRotation: pinTransform
        };

		//opens a read/write transaction to add noets
        const transaction = db.transaction(["noteboardObjectStore"], "readwrite");
		//calls object store from database
        const noteboardObjectStore = transaction.objectStore("noteboardObjectStore");
		//makes a request to add note to database
        const addRequest = noteboardObjectStore.add(newNote);

		//if successfully requested, report to console
        addRequest.addEventListener("success", () => {
            console.log("Note Saved");
        });
		//if successfull added, report to console
        transaction.addEventListener("complete", () => {
            console.log("Transaction completed.");
        });
		//if addition failed, report to console
        transaction.addEventListener("error", () =>
            console.log("Transaction not opened due to error"),
        );
    };
	//report to console when save complete
    console.log("Board Saved");
}

//display client storage
function displayData() {
	//open object store
    const objectStore = db.transaction("noteboardObjectStore").objectStore("noteboardObjectStore");
    let notes = []
	//use cursor to iterate through notes
    objectStore.openCursor().addEventListener("success", (e) => {
		const cursor = e.target.result;
		//check for next note
		if (cursor) {
			//listItem.setAttribute("data-note-id", cursor.value.id); used for deleting items
			console.log(cursor.value.color);
			//create new note passing note object from data base
			createNewNote(cursor.value);
			//move to next note
			cursor.continue();
		} else {
			//report once all notes are displayed
			console.log("Notes all displayed");
		}
    });
}

//Clears database memory
function clearDB() {
    // open a database transaction and clear the data
    const transaction = db.transaction(["noteboardObjectStore"], "readwrite");
    const objectStore = transaction.objectStore("noteboardObjectStore");
    const deleteRequest = objectStore.clear();

    // report that the data has been cleared
    transaction.addEventListener("complete", () => {
    // delete the parent of the button
    console.log(`Data cleared`);
    });
}

////////////////////////////////////////////////////////////////////////////////////////

//array of class names for paper colors
paperColors = ["pinkPaper", "yellowPaper", "bluePaper", "greenPaper"];

//controller used to remove listeners
const Controller = new AbortController();
const { Signal } = Controller;

//makes creating random ints more intuitive
function getRandomInt(min, max) {
    //transforms and scales a random number 0-1 into a random int in a defined range
    return Math.floor((Math.random() * (max - min)) + min);
}

//displays instructions for new users
function displayInstructions() {
    //create instruction notes
    instructions = [
        [createNewNote(), null],
        [createNewNote(), null],
        [createNewNote(), null]
    ];
	//position notes
    verticalSpacing = 250;
    verticalOffset = -50;
    horizontalSpacing = 100;
    horizontalOffset = 150;

    instructions[0][1] = instructions[0][0].lastChild
    noteBoard.appendChild(instructions[0][0]);
    instructions[0][0].style.top = '50px';
    instructions[0][0].style.left = horizontalSpacing + horizontalOffset + 'px';


    //add notes to board
    noteBoard = document.getElementById("ToDos");
    for(i = 1; i < instructions.length; i++){
        instructions[i][1] = instructions[i][0].lastChild
        noteBoard.appendChild(instructions[i][0]);
        instructions[i][0].style.top = (i + 1) * verticalSpacing + verticalOffset + 'px';
        instructions[i][0].style.left = (i + 1) * horizontalSpacing + horizontalOffset +'px';
    }

    //add texts to instruction notes
    instructions[0][1].textContent = "Welcome to your virtual noteboard. Add or remove notes " +
    "and save them when your done. I use it as a to-do list.";
    instructions[1][1].textContent = "pins with '+' add notes, pins with '-' delete notes";
    instructions[2][1].textContent = "new notes follow your mouse, till you click again";
}

//clears all notes
function resetBoard() {
    let noteElements = document.getElementsByClassName("paper");
    console.log(noteElements);
    while(noteElements.length > 0){
        for (i = 0; i < noteElements.length; i++){
            noteElements[i].remove();
        }
        noteElements = document.getElementsByClassName("paper");
    }
    displayInstructions();
}

//removes the note of the passed in pin
function removeNote(pin) {
    pin.parentElement.remove();
}

//creates a new note element that follows the users mouse till they click
function createNewNote(noteObject) {
    if (arguments.length == 0) {
        noteObject = {
            note: "type note here",
            color: paperColors[getRandomInt(0, 4)],
            positionX: "200px",
            positionY: "200px",
            paperRotation: 'rotate(' + getRandomInt(-10, 20) + 'deg)',
            pinRotation: 'rotate(' + getRandomInt(0,45) + 'deg)' 
        }
    }

    //creates a note element and assigns a color and orientation
    note = document.createElement("div");
    note.setAttribute('class', 'paper');
    note.setAttribute('id', noteObject.color);
    //dont change rotation range as less than -10 causes click errors
    //if needed will need to change onclick into a mouse down listener
    note.style.position = 'absolute';
    note.style.transform = noteObject.paperRotation;
    note.style.left = noteObject.positionX;
    note.style.top = noteObject.positionY;

    //creates pin with random orientation
    pin = document.createElement("div");
    pin.setAttribute('class', 'pin');
    //removes the note if clicked
    pin.setAttribute('onclick', 'removeNote(this)');
    pin.style.transform = noteObject.pinRotation; 

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
    noteText = document.createElement("span");
    noteText.setAttribute('class', 'paperText');
    noteText.textContent = noteObject.note;
    noteText.setAttribute("contenteditable", true);

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

    return note;
}

function userPlaceNote(){
    note = createNewNote();
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
    //adds listener to track mouse location
    document.addEventListener('mousemove', (e) => {
        //sets the location of element to same as mouse 
        //offset to look like the note is held by the pin
        follower.style.top = (e.pageY - 25) + 'px';
        follower.style.left = (e.pageX - 20)  + 'px';
    }, { Signal });
}
