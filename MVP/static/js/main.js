

///////////////////////////////////////////////////////
/////////////   CREATE THE NOTES   ////////////////////
///////////////////////////////////////////////////////


createNotes();

function createNotes() {

    var notes = xmlDoc.getElementsByTagName("note");

    //console.log(pages);
    //console.log(pages[43]);

    for (i = 0; i < notes.length; i++) {

        var note = notes[i];
        var id = note.getAttribute("id");
        var clasis = note.getAttribute("class");
        //console.log(id, clasis);

        //var link = note.getElementsByTagName("link");

        // build the noteLink divs
        if (clasis === "noteLink"){
            elem = '<div class="noteLink" id="' + id + '" ></div>';
            $('body').append(elem);
        }

        // build the note divs
        else if (clasis === "note") {
            elem = '<div class="note" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }

        // build the pageLink divs
        else if (clasis === "pageLink"){

            var type = note.getAttribute("type");
            var pageID = note.getAttribute("pageID");
            var title = pages[pageID];
            //console.log(id, pageID,title);
            //console.log("build a pageLink");

            elem = '<div class="pageLink" ' + ' id="' + id + '" pageID=' + pageID + ' pageTitle="' + title + '" contenteditable="false"></div>';
            $('body').append(elem);

        }

        // build the image divs
        else if (clasis === "image"){
            elem = "<div class='image' id='" + id + "'></div>"
            $('body').append(elem);
        }

        // build the imageLink divs
        else if (clasis === "imageLink"){
            elem = '<div class="imageLink" id="' + id + '" ></div>';
            $('body').append(elem);
        }

        // build the pdf divs
        else if (clasis === "pdf"){
            elem = "<div class='pdf' id='" + id + "'></div>"
            $('body').append(elem);
        }

        // build the imagePageLink divs
        else if (clasis === "imagePageLink"){

            var type = note.getAttribute("type");
            var pageID = note.getAttribute("pageID");
            var title = pages[pageID];

            elem = '<div class="imagePageLink" ' + ' id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '" contenteditable="false"></div>';
            $('body').append(elem);

        }

        // build the to-do-list divs
        else if (clasis === "to-do-list"){
            elem = "<div class='to-do-list' id='" + id + "'></div>"
            $('body').append(elem);
        }
        /*
        else if (clasis === "criteria") {
            elem = '<div class="criteria" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        else if (clasis === "category") {
            elem = '<div class="category" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }
        */
    }

}


///////////////////////////////////////////////////////
//////  KEEP INFO OF LAST PLACE USER CLICKED //////////
///////////////////////////////////////////////////////

$(document).click(function(){


    if (event.target.nodeName === 'HTML'){

        //console.log("clicked on page");

        x = event.pageX.toString();
        y = event.pageY.toString();

        $('#mouse_position').find('#x_pos').html(x);
        $('#mouse_position').find('#y_pos').html(y);

    }

});



////////////////////////////
///   set y position  //////
////////////////////////////

$(window).scrollTop(y_position);


