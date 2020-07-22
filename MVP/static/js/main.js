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
        else if (clasis === "noteLink"){
            elem = '<div class="noteLink" id="' + id + '" ></div>';
            $('body').append(elem);
        }
        else if (clasis === "note") {
            elem = '<div class="note" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "pageLink"){
            var pageID = note.getAttribute("pageID");
            var title = pages[pageID];
            console.log(id, pageID,title);
            elem = '<div class="pageLink ' + '" id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "image"){
            elem = "<div class='image' id='" + id + "'></div>"
            $('body').append(elem);
        }
        else if (clasis === "imageLink"){
            elem = '<div class="imageLink" id="' + id + '" ></div>';
            $('body').append(elem);
        }
        else if (clasis === "pdf"){
            elem = "<div class='pdf' id='" + id + "'></div>"
            $('body').append(elem);
        }
        else if (clasis === "imagePageLink"){
            var pageID = note.getAttribute("pageID");
            var title = pages[pageID];
            elem = '<div class="imagePageLink ' + '" id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '" ></div>';
            $('body').append(elem);
        }
    }

}


///////////////////////////////////////////////////////
//////  KEEP INFO OF LAST PLACE USER CLICKED //////////
///////////////////////////////////////////////////////

$(document).click(function(){


    if (event.target.nodeName === 'HTML'){

        console.log("clicked on page");

        x = event.pageX.toString();
        y = event.pageY.toString();

        $('#mouse_position').find('#x_pos').html(x);
        $('#mouse_position').find('#y_pos').html(y);

    }

});
