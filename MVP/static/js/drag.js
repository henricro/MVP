///////////////////////////////////////////////////
/////////////    DRAG ELEMENTS   //////////////////
///////////////////////////////////////////////////


$(".note, .pageLink, .noteLink, #title, .image, .pdf, .imagePageLink, .imageLink").each(function(){

    $(this).bind('mousedown.drag', function(){

        note = $(this);

        mouseX = event.pageX;
        mouseY = event.pageY;

        noteX = parseInt(note.css("left").slice(0, -2));
        noteY = parseInt(note.css("top").slice(0, -2));

        dragFunc(note, noteX, noteY);

    });

});


function dragFunc(note, noteX, noteY) {

    $(document).bind('mousemove.drag', function(){
        mouseMove(note);
    });

    $(document).bind('mouseup.stopDrag', function(){
        mouseUp(note);
    });

    function mouseMove(note) {

        //console.log(noteX, noteY);

        //console.log("moving mouse");

        new_top = noteY + event.pageY - mouseY ;
        new_left = noteX + event.pageX - mouseX ;
        //console.log(new_top, new_left);
        note.css({ top : new_top + "px", left : new_left + "px" });

        note.css("z-index", "-1");

        event.preventDefault();

    }

    function mouseUp(note) {

        note.css("z-index", "0");

        $(document).unbind('mousemove.drag');
        //console.log("stoping");

        //console.log(event.pageX, event.pageY);
        $(document).unbind('mouseup.stopDrag');

        id = note.attr("id");
        x = note.css("left");
        y= note.css("top");

        if (!(mouseX == event.pageX && mouseY == event.pageY)){

            console.log("event target"); console.log(event.target);

            console.log(id, $(event.target).attr("id"));

            if ( !($(event.target).attr("id") == id) ){

                if ( event.target.classList.contains('pageLink') ){

                    console.log("moved an object into another page");

                    note_id = note.attr("id");

                    page_id = $(event.target).attr("pageid");

                    $.ajax({

                        url: '/move_note/'+pageID,
                        type: "POST",
                        data: JSON.stringify({
                            note_id: note_id,
                            page_id: page_id
                        }),
                        contentType: "application/json",
                        success: function (data) {
                            console.log(data);
                            //window.location.href='/open_page/'+pageID;
                        },
                        error: function (error) {
                            console.log("problem");
                            //window.location.href='/open_page/'+pageID;
                        }

                    });

                } else if ( event.target.classList.contains('note') ){

                    $.ajax({

                        url: '/link_notes/'+pageID,
                        type: "POST",
                        data: JSON.stringify({
                            id_1 : $(event.target).attr("id"),
                            id_2 : note.attr("id")
                        }),
                        contentType: "application/json",
                        success: function (data) {
                            console.log(data);
                            window.location.href='/open_page/'+pageID;
                        },
                        error: function (error) {
                            console.log("problem");
                            window.location.href='/open_page/'+pageID;
                        }

                    });

                }

            } else {

                console.log("moved an object");

                // ajax call with id x and y postion if element has moved
                $.ajax({

                    url: '/update_position/'+pageID,
                    type: "POST",
                    data: JSON.stringify({
                        id: id,
                        x: x,
                        y: y
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (error) {
                        console.log("problem");
                    }

                });

            }

        } else {
            console.log("object did not move");
        }


    }

}



//////////////////////////////////////////////
//////////  SELECT MULTIPLE //////////////////
/////////////////////////////////////////////

$(document).bind('mousedown.multipleSelect', function(){

    startX = event.pageX;
    startY = event.pageY;

    console.log(startX, startY)

    selectBox = "<div id='selectBox' style='position:absolute; background-color:blue; opacity:0.1;'></div>"

    $('body').append(selectBox);

    var selectBox = $('#selectBox');

    if (event.target.nodeName === 'HTML'){
        dragSelect();
    }

});



function dragSelect() {

    $(document).bind('mousemove.multipleSelect', function(){
        moveSelect();
    });

    $(document).bind('mouseup.multipleSelect', function(){
        stopSelect();
    });

    function moveSelect() {

        event.preventDefault();

        height = Math.abs(event.pageY - startY) ;
        width = Math.abs(event.pageX - startX) ;

        //console.log(height, width)

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

        endX = event.pageX;
        endY = event.pageY;

        console.log(endX, endY);

        // collect all the elements in the selection
        var selection = [];

        $(".note, .pageLink, .noteLink, .image, .pdf, .imagePageLink, .imageLink").each(function(){

            note = $(this);

            id = note.attr("id");

            noteX = parseInt(note.css("left").slice(0, -2));
            noteY = parseInt(note.css("top").slice(0, -2));

            if ( (startX < noteX && noteX < endX && startY < noteY && noteY < endY) || (startX > noteX && noteX > endX && startY > noteY && noteY > endY) ){
                selection.push(id);
            }

        });

        console.log(selection.length);
        console.log(selection);

        if (selection.length == 0){

            $('#selectBox').remove();

        } else {

            $(document).bind('keyup.delete', function(){

                if (event.keyCode == 8){

                    selectionString = selection.toString();

                    $.ajax({
                        url: '/delete_notes/'+pageID,
                        type: "POST",
                        data: JSON.stringify({
                            selection: selectionString
                        }),
                        contentType: "application/json",
                        success: function (data) {

                            console.log(data);
                            window.location.href='/open_page/'+pageID;
                        },
                        error: function (error) {
                            console.log("problem");
                            window.location.href='/open_page/'+pageID;
                        }
                    });

                }

            });

            $('#selectBox').bind('mousedown.drag', function(){

                $(document).unbind('keyup.delete');

                $('#selectBox').remove();

                console.log("mousedown on selectBox");
                console.log(selection);

                mouseX = event.pageX;
                mouseY = event.pageY;

                for (i in selection){

                    id = selection[i];

                    console.log(id);

                    note = $('#' + id);

                    console.log("print the note");
                    console.log(note);

                    noteX = parseInt(note.css("left").slice(0, -2));
                    noteY = parseInt(note.css("top").slice(0, -2));

                    dragFunc(note, noteX, noteY);

                }

            });

        }

    }

}



