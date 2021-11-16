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
        if (clasis === "noteLink"){
            elem = '<div class="noteLink" id="' + id + '" ></div>';
            $('body').append(elem);
        }
        else if (clasis === "note") {
            elem = '<div class="note" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "pageLink"){
            var type = note.getAttribute("type");
            var pageID = note.getAttribute("pageID");
            var title = pages[pageID];
            console.log(id, pageID,title);
            if (type === "child"){
                elem = '<div class="pageLink child" ' + ' id="' + id + '" pageID=' + pageID + ' pageTitle="'+ title + '" contenteditable="false"></div>';
                $('body').append(elem);
            } else if (type ==="parent"){
                console.log("we have a parent !!");
                elem = '<div class="pageLink parent" ' + ' id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '" contenteditable="false"></div>';
                $('#parents').append(elem);
            } else if (type ==="visitor"){
                console.log("we have a parent !!");
                elem = '<div class="pageLink visitor" ' + ' id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '" contenteditable="false"></div>';
                $('body').append(elem);
            }

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
            var type = note.getAttribute("type");
            var pageID = note.getAttribute("pageID");
            var title = pages[pageID];
            if (type === "child"){
                elem = '<div class="imagePageLink child" ' + ' id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '" contenteditable="false"></div>';
                $('body').append(elem);
            } else if (type ==="parent"){
                console.log("we have a parent !!");
                elem = '<div class="imagePageLink parent" ' + ' id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '" contenteditable="false"></div>';
                $('#parents').append(elem);
            } else if (type ==="visitor"){
                console.log("we have a parent !!");
                elem = '<div class="imagePageLink visitor" ' + ' id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '" contenteditable="false"></div>';
                $('body').append(elem);
            }
        }
        else if (clasis === "criteria") {
            elem = '<div class="criteria" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "category") {
            elem = '<div class="category" id="' + id + '" contenteditable="false"></div>';
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
