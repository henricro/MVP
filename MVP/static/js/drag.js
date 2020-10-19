///////////////////////////////////////////////////
/////////////    DRAG ELEMENTS   //////////////////
///////////////////////////////////////////////////


$(".note, .pageLink, .noteLink, #title, .image, .pdf, .imagePageLink, .imageLink, .criteria, .category").each(function(){

    $(this).bind('mousedown.drag', function(){

        note = $(this);

        mouseX = event.pageX;
        mouseY = event.pageY;

        noteX = parseInt(note.css("left").slice(0, -2));
        noteY = parseInt(note.css("top").slice(0, -2));

        dragNote(note, noteX, noteY);

    });

});


function dragNote(note, noteX, noteY) {

    $(document).bind('mousemove.drag', function(){
        mouseMove(note);
    });

    $(document).bind('mouseup.stopDrag', function(){
        mouseUp(note);
    });

    function mouseMove(note) {

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

            console.log("event target : ", $(event.target));

            console.log("parent : ", $(event.target).parent() );

            console.log( $(event.target).parent().hasClass("imagePageLink_name") );

            if ( !( $(event.target).attr("id") == id || $(event.target).parent().attr("id") == id || $(event.target).parent().parent().attr("id") == id ) ){

                console.log("not same id");

                if ( event.target.classList.contains('pageLink') ){

                    console.log("moved an object into another page");

                    note_id = note.attr("id");

                    page_id = $(event.target).attr("pageid");

                    $.ajax({

                        url: '/move_note/'+pageID + '/' + user_id,
                        type: "POST",
                        data: JSON.stringify({
                            note_id: note_id,
                            page_id: page_id
                        }),
                        contentType: "application/json",
                        success: function (data) {
                            console.log(data);
                            window.location.href='/open_page/'+ pageID + '/' + user_id;
                        },
                        error: function (error) {
                            console.log("problem");
                            window.location.href='/open_page/'+ pageID + '/' + user_id;
                        }

                    });

                } else if ( $(event.target).parent().hasClass('imagePageLink_name') ){

                    console.log("moved an object into another page (imagePageLink");

                    note_id = note.attr("id");

                    page_id = $(event.target).parent().parent().attr("pageid");

                    console.log("destination page id : ", page_id)

                    $.ajax({

                        url: '/move_note/'+pageID + '/' + user_id,
                        type: "POST",
                        data: JSON.stringify({
                            note_id: note_id,
                            page_id: page_id
                        }),
                        contentType: "application/json",
                        success: function (data) {
                            console.log(data);
                            window.location.href='/open_page/'+ pageID + '/' + user_id;
                        },
                        error: function (error) {
                            console.log("problem");
                            window.location.href='/open_page/'+ pageID + '/' + user_id;
                        }

                    });

                }

                else if ( event.target.classList.contains('note') ){

                    $.ajax({

                        url: '/link_notes/'+pageID + '/' + user_id,
                        type: "POST",
                        data: JSON.stringify({
                            id_1 : $(event.target).attr("id"),
                            id_2 : note.attr("id")
                        }),
                        contentType: "application/json",
                        success: function (data) {
                            console.log(data);
                            window.location.href='/open_page/'+ pageID + '/' + user_id;
                        },
                        error: function (error) {
                            console.log("problem");
                            window.location.href='/open_page/'+ pageID + '/' + user_id;
                        }

                    });

                }

                else {

                    console.log("moved an object");

                    // ajax call with id x and y postion if element has moved
                    $.ajax({

                        url: '/update_position/'+pageID + '/' + user_id,
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

                console.log("moved an object");

                // ajax call with id x and y postion if element has moved
                $.ajax({

                    url: '/update_position/'+pageID + '/' + user_id,
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



///////////////////////////////////////////////
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

            if ( (startX < noteX && noteX < endX && startY < noteY && noteY < endY) ||
                 (startX > noteX && noteX > endX && startY > noteY && noteY > endY) ||
                 (startX < noteX && noteX < endX && startY > noteY && noteY > endY) ||
                 (startX > noteX && noteX > endX && startY < noteY && noteY < endY) )
                 {
                selection.push(id);
            }

        });

        console.log(selection.length);
        console.log(selection);

        if (selection.length == 0){

            $('#selectBox').remove();

        } else {

            $(document).bind('copy.copySelection', function() {
                console.log("clicked to copy selection");
                copySelection(selection);
                $(document).unbind('copy.copySelection');
            });

            $(document).bind('keyup.delete', function(){

                if (event.keyCode == 8){

                    selectionString = selection.toString();

                    $.ajax({
                        url: '/delete_notes/'+pageID + '/' + user_id,
                        type: "POST",
                        data: JSON.stringify({
                            selection: selectionString
                        }),
                        contentType: "application/json",
                        success: function (data) {

                            console.log(data);
                            window.location.href='/open_page/'+ pageID + '/' + user_id;
                        },
                        error: function (error) {
                            console.log("problem");
                            window.location.href='/open_page/'+ pageID + '/' + user_id;
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

                dragNotes(selection);

            });

        }

    }

}


/////////////////////////////////////
//////////// DRAG SELECTION /////////////
/////////////////////////////////////

function dragNotes(selection) {

    selection2 = [];

    for (i in selection){

        id = selection[i];
        note = $('#' + id);

        noteX = parseInt(note.css("left").slice(0, -2));
        noteY = parseInt(note.css("top").slice(0, -2));

        selection2.push([note, noteX, noteY])

    }

    $(document).bind('mousemove.dragNotes', function(){

        for (i in selection2){

            note = selection2[i][0];
            noteX = selection2[i][1];
            noteY = selection2[i][2];

            new_top = noteY + event.pageY - mouseY ;
            new_left = noteX + event.pageX - mouseX ;
            //console.log(new_top, new_left);
            note.css({ top : new_top + "px", left : new_left + "px" });

            note.css("z-index", "-1");

            event.preventDefault();

        }

    });

    $(document).bind('mouseup.stopDraNotesg', function(){
        mouseUpNotes(selection);
    });

    function mouseUpNotes(note) {

        $(document).unbind('mousemove.dragNotes');
        //console.log("stoping");

        //console.log(event.pageX, event.pageY);
        $(document).unbind('mouseup.stopDragNotes');

        if (!(mouseX == event.pageX && mouseY == event.pageY)){

            if ( event.target.classList.contains('pageLink') ){

                console.log("moved a selection into another page");

                page_id = $(event.target).attr("pageid");

                $.ajax({

                    url: '/move_notes/'+pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        selection: selection,
                        page_id: page_id
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        console.log(data);
                        window.location.href='/open_page/'+ pageID + '/' + user_id;
                    },
                    error: function (error) {
                        console.log("problem");
                        window.location.href='/open_page/'+ pageID + '/' + user_id;
                    }

                });

            } else if ( $(event.target).parent().hasClass('imagePageLink_name') ){

                console.log("moved a selection into another page");

                page_id = $(event.target).parent().parent().attr("pageid");

                $.ajax({

                    url: '/move_notes/'+pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        selection: selection,
                        page_id: page_id
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        console.log(data);
                        window.location.href='/open_page/'+ pageID + '/' + user_id;
                    },
                    error: function (error) {
                        console.log("problem");
                        window.location.href='/open_page/'+ pageID + '/' + user_id;
                    }

                });

            } //else if ( event.target.classList.contains('note') ){

              //  $.ajax({

               //     url: '/link_notes/'+pageID,
               //     type: "POST",
               //     data: JSON.stringify({
               //         id_1 : $(event.target).attr("id"),
               //         id_2 : note.attr("id")
               //     }),
               //     contentType: "application/json",
               //     success: function (data) {
               //         console.log(data);
               //          window.location.href='/open_page/'+pageID;
               //     },
               //     error: function (error) {
               //         console.log("problem");
               //         window.location.href='/open_page/'+pageID;
               //     }

               // });

            //}

            else {

                console.log("moved a selection");

                positions = [];

                for (i in selection){

                    id = selection[i];
                    note = $('#' + id);
                    note.css("z-index", "0");

                    x = parseInt(note.css("left").slice(0, -2));
                    y = parseInt(note.css("top").slice(0, -2));

                    positions.push([id, x, y]);

                }

                console.log(positions);

                // ajax call with id x and y postion if element has moved
                $.ajax({

                    url: '/update_positions/'+pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        positions : positions
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




