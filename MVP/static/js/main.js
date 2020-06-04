///////////////////////////////////////////////////////
/////////////   CREATE THE NOTES   ////////////////////
///////////////////////////////////////////////////////

createNotes();

function createNotes() {

    var notes = xmlDoc.getElementsByTagName("note");

    console.log(pages);
    console.log("paaaaaaaaaaaaaages");
    console.log(pages[43]);

    for (i = 0; i < notes.length; i++) {
        var note = notes[i];
        var id = note.getAttribute("id");
        console.log(id);
        var clasis = note.getAttribute("class");
        console.log(id, clasis);

        //var link = note.getElementsByTagName("link");
        if (clasis === "title"){
            elem = '<div class="title" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        if (clasis === "noteLink"){
            elem = '<div class="noteLink" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "note") {
            elem = '<div class="note" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "pageLink"){
            var pageID = note.getAttribute("pageID");
            var title = pages[pageID];
            console.log("forget");
            console.log(id, pageID,title);
            elem = '<div class="pageLink ' + '" id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "file"){
            elem = "<div class='file' id='" + id + "'></div>"
            $('body').append(elem);
        }
    }

}
