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

//////////////////////////////////////////////
//////////  SELECT MULTIPLE //////////////////
/////////////////////////////////////////////
/*
$(document).bind('mousedown.multipleSelect', function(){

    startX = event.pageX;
    startY = event.pageY;

    console.log(startX, startY)

    selectBox = "<div id='selectBox' style='position:absolute; background-color:blue; opacity:0.1;'></div>"

    $('body').append(selectBox);

    var selectBox = $('#selectBox');

    dragSelect();

});



function dragSelect() {

    $(document).bind('mousemove.multipleSelect', function(){
        moveSelect();
    });

    $(document).bind('mouseup.multipleSelect', function(){
        stopSelect();
    });

    function moveSelect() {

        height = Math.abs(event.pageY - startY) ;
        width = Math.abs(event.pageX - startX) ;

        console.log(height, width)

        $('#selectBox').css('width', width);
        $('#selectBox').css('height', height);

        if (event.pageX > startX && event.pageY > startY){
            $('#selectBox').css('top', startY);
            $('#selectBox').css('left', startX);
        }

        else if (event.pageX > startX && event.pageY < startY){
            $('#selectBox').css('top', startY-(startY-event.pageY));
            $('#selectBox').css('left', startX);
        }

        else if (event.pageX < startX && event.pageY < startY){
            $('#selectBox').css('top', startY-(startY-event.pageY));
            $('#selectBox').css('left', startX-(startX-event.pageX));
        }

        else if (event.pageX < startX && event.pageY > startY){
            $('#selectBox').css('top', startY);
            $('#selectBox').css('left', startX-(startX-event.pageX));
        }

    }

    function stopSelect() {

        $(document).unbind('mousemove.multipleSelect');

    }

}
*/

