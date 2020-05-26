///////////////////////////////////////////////////////
/////////////   CREATE THE NOTES   ////////////////////
///////////////////////////////////////////////////////

createNotes();

function createNotes() {

    var notes = xmlDoc.getElementsByTagName("note");

    for (i = 0; i < notes.length; i++) {
        var note = notes[i];
        var id = note.getAttribute("id");
        console.log(id);
        var clasis = note.getAttribute("class");
        console.log(id, clasis);
        //var link = note.getElementsByTagName("link");
        if (clasis === "noteLink"){
            elem = '<div class="noteLink" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "note") {
            elem = '<div class="note" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "pageLink"){
            elem = '<div class="pageLink" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "file"){
            elem = '<div class="file" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
    }

}
