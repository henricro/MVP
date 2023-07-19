///////////////////////////////////////////////////
/////////////    DRAG ELEMENTS   //////////////////
///////////////////////////////////////////////////

function defineDrag() {

    $(".note, .pageLink, .noteLink, #title, .image, .pdf, .imagePageLink, .imageLink, .to-do-list, .criteria, .category, iframe").each(function(){

        $(this).bind('mousedown.drag', function(){

            note = $(this);

            zoomLevel = $("body").css("zoom");
            zoomLevel = parseFloat(zoomLevel);
            zoomCoeff = 1/zoomLevel;

            // get the x and y positions of the click
            mouseX = event.pageX;
            mouseY = event.pageY;

            // get the x and y posititons of the note
            noteX = parseInt(note.css("left").slice(0, -2));
            noteY = parseInt(note.css("top").slice(0, -2));

            dragNote(note, noteX, noteY);

        });

    });

}

defineDrag();

function dragNote(note, noteX, noteY) {

    $(document).bind('mousemove.drag', function(){
        mouseMove(note);
    });

    $(document).bind('mouseup.stopDrag', function(){
        mouseUp(note);
    });

    function mouseMove(note) {

        new_top = noteY + zoomCoeff*event.pageY - zoomCoeff*mouseY ;
        new_left = noteX + zoomCoeff*event.pageX - zoomCoeff*mouseX ;

        //new_top = noteY + event.pageY - mouseY ;
        //new_left = noteX + event.pageX - mouseX ;

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
        y = note.css("top");

        // if the mouse has moved
        if (!(mouseX == event.pageX && mouseY == event.pageY)){

            //console.log("event target : ", $(event.target));
            //console.log("parent : ", $(event.target).parent() );
            //console.log( $(event.target).parent().hasClass("imagePageLink_name") );

            // if it's dropped on smthg with other id
            if ( !( $(event.target).attr("id") == id || $(event.target).parent().attr("id") == id || $(event.target).parent().parent().attr("id") == id ) ){

                //console.log("not same id");

                // if you drop in pageLink
                if ( event.target.classList.contains('pageLink')  ||
                     $(event.target).parent().hasClass('imagePageLink_name')) {

                    //console.log("moved an object into another page");

                    note_id = note.attr("id");
                    page_id = $(event.target).attr("pageid");

                    $.ajax({

                        url: '/move_note/'+ pageID + '/' + user_id,
                        type: "POST",
                        data: JSON.stringify({
                            note_id: note_id,
                            page_id: page_id
                        }),
                        contentType: "application/json",
                        success: function (data) {
                            //console.log(data);
                            current_y = document.documentElement.scrollTop;
                            //console.log("current y :", current_y);
                            window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
                        },
                        error: function (error) {
                            //console.log("problem");
                            current_y = document.documentElement.scrollTop;
                            //console.log("current y :", current_y);
                            window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
                        }

                    });

                // if you drop on note
                }   else if ( event.target.classList.contains('note') ){

                    $.ajax({

                        url: '/link_notes/' + pageID + '/' + user_id,
                        type: "POST",
                        data: JSON.stringify({
                            id_1 : $(event.target).attr("id"),
                            id_2 : note.attr("id")
                        }),
                        contentType: "application/json",
                        success: function (data) {
                            //console.log(data);
                            current_y = document.documentElement.scrollTop;
                            //console.log("current y :", current_y);
                            window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
                        },
                        error: function (error) {
                            //console.log("problem");
                            current_y = document.documentElement.scrollTop;
                            //console.log("current y :", current_y);
                            window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
                        }

                    });

                }

                else {

                    //console.log("moved an object");

                    // ajax call with id x and y postion if element has moved
                    $.ajax({

                        url: '/update_position/' + pageID + '/' + user_id,
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

                // console.log("moved an object");

                // ajax call with id x and y postion if element has moved
                $.ajax({

                    url: '/update_position/' + pageID + '/' + user_id,
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
            //console.log("object did not move");
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

        //$('#selectBox').remove();
        mouseUpNotes(selection);

        unSelect(selection);

    });

    function mouseUpNotes(selection) {

        $(document).unbind('mousemove.dragNotes');
        //console.log("stoping");

        //console.log(event.pageX, event.pageY);
        $(document).unbind('mouseup.stopDragNotes');

        if (!(mouseX == event.pageX && mouseY == event.pageY)){

            //console.log("event target : ", $(event.target));

            //console.log($(event.target).attr("id"));

            //console.log("parent : ", $(event.target).parent() );

            //console.log(selection);

            //console.log(selection.includes($(event.target).attr("id")));

            //console.log( $(event.target).parent().hasClass("imagePageLink_name") );

            if ( !( selection.includes($(event.target).attr("id"))  || selection.includes($(event.target).parent().attr("id")) || selection.includes($(event.target).parent().parent().attr("id")) ) ){

                if ( event.target.classList.contains('pageLink') ){

                    //console.log("moved a selection into another page");

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
                            current_y = document.documentElement.scrollTop;
                            console.log("current y :", current_y);
                            window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                        },
                        error: function (error) {
                            console.log("problem");
                            current_y = document.documentElement.scrollTop;
                            console.log("current y :", current_y);
                            window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                        }

                    });

                } else if ( $(event.target).parent().hasClass('imagePageLink_name') ){

                    //console.log("moved a selection into another page");

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
                            current_y = document.documentElement.scrollTop;
                            console.log("current y :", current_y);
                            window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                        },
                        error: function (error) {
                            console.log("problem");
                            current_y = document.documentElement.scrollTop;
                            console.log("current y :", current_y);
                            window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                        }

                    });

                } //else if ( event.target.classList.contains('note') ){

                else {

                    //console.log("moved a selection");

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

            }   else {

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
            //console.log("object did not move");
        }

    }

}




