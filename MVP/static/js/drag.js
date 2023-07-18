///////////////////////////////////////////////////
/////////////    DRAG ELEMENTS   //////////////////
///////////////////////////////////////////////////

function defineDrag() {

    $(".note, .pageLink, .noteLink, #title, .image, .pdf, .imagePageLink, .imageLink, .criteria, .category, iframe").each(function(){

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



///////////////////////////////////////////////
//////////  SELECT MULTIPLE //////////////////
/////////////////////////////////////////////

$(document).bind('mousedown.multipleSelect', function(){

    startX = event.pageX;
    startY = event.pageY;

    console.log(event);
    console.log(startX, startY)

    selectBox = "<div id='selectBox' style='position:absolute; background-color:blue; opacity:0.1;'></div>"

    $('body').append(selectBox);

    var selectBox = $('#selectBox');

    if (event.target.nodeName === 'HTML'){
        //event.stopPropagation();
        console.log("wonka");
        createSelect();
    }

});


function createSelect() {

    $(document).bind('mousemove.multipleSelect', function(){
        console.log("moving mouse");
        moveSelect();
    });

    $(document).bind('mouseup.multipleSelect', function(){
        //console.log("mouse up");
        stopSelect();
    });

}

function moveSelect() {

    event.preventDefault();

    height = Math.abs(event.pageY - startY) ;
    width = Math.abs(event.pageX - startX) ;

    //console.log(height, width)

    $('#selectBox').show();

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
    //console.log(endX, endY);

    // collect all the elements in the selection
    var selection = [];
    $(".note, .pageLink, .noteLink, .image, .pdf, .imagePageLink, .imageLink").each(function(){

        // feed the selection
        note = $(this);
        id = note.attr("id");
        noteY = parseInt(note.css("top").slice(0, -2));
        noteX = parseInt(note.css("left").slice(0, -2));

        if ( (startX < noteX && noteX < endX && startY < noteY && noteY < endY) ||
             (startX > noteX && noteX > endX && startY > noteY && noteY > endY) ||
             (startX < noteX && noteX < endX && startY > noteY && noteY > endY) ||
             (startX > noteX && noteX > endX && startY < noteY && noteY < endY) )
             {
            selection.push([id, noteY]);
        }

    });

    selection = selection.sort((a, b) => a[1] - b[1]).map(arr => arr[0]);
    console.log(selection);

    // color selected elements with blue border
    for (i in selection){
        id = selection[i]
        note = $("#" + id);
        note.css({"border":"blue 2px solid"});
        note.css({"border-radius":"6px"});
    }


    //console.log(selection.length);
    //console.log(selection);

    if (selection.length == 0){

        $('#selectBox').remove();

    } else {

        // if cmd + c --> copy selection
        $(document).bind('copy.copySelection', function() {
            //console.log("clicked to copy selection");
            copySelection(selection);
            $(document).unbind('copy.copySelection');
        });

        // if key:delete --> delete all elements in selection
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
                        console.log("whenever");
                        current_y = document.documentElement.scrollTop;
                        console.log("current y :", current_y);
                        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                    },
                    error: function (error) {
                        console.log("problem");
                        console.log("wherever");
                        current_y = document.documentElement.scrollTop;
                        console.log("current y :", current_y);
                        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                    }
                });

            }

        });

        // if right click on selection box
        $("#selectBox").bind('contextmenu', function(event){

            event.preventDefault();

            //console.log("print this");
            //console.log(event.target);

            $("#selectionRCBox").css("left", event.pageX);
            $("#selectionRCBox").css("top", event.pageY);
            $("#selectionRCBox").show();

            $(document).click(function(){
                if (!$("#selectionRCBox").is(event.target) && $("#selectionRCBox").has(event.target).length === 0){
                    $("#selectionRCBox").hide();
                    newPage();
                }
            });

            $('#selectionRC_1').bind('click', function() {
                alignItems(selection);
            });

            //}

        });

        // if drag selection
        $('#selectBox').bind('mousedown.drag', function(){

            $(document).unbind('keyup.delete');

            setTimeout(
                function() {$('#selectBox').hide();},
                100
            )

            //console.log("mousedown on selectBox");
            //console.log(selection);

            mouseX = event.pageX;
            mouseY = event.pageY;

            dragNotes(selection);

        });

        // if you click outside the box
        $(document).bind('mousedown.outsideSelect1', function(){

            //event.stopPropagation();
            //$(document).bind('mousedown.outsideSelect2', function(){

                if (!$("#selectBox").is(event.target) && $("#selectBox").has(event.target).length === 0){

                    console.log("iuhdiudahiuadh");
                    $("#selectBox").hide();

                    unSelect(selection);

                    $(document).unbind("mousedown.outsideSelect1");
                    //$(document).unbind("mousedown.outsideSelect2");

                }

            //});

        });

    }


}

function unSelect(selection) {

    for (i in selection){

        id = selection[i];
        note = $("#" + id);

        var clasis = note.attr("class");
            if (clasis == "note"){
                note.css({"border":"1px solid rgb(0, 0, 0, 0)"});
                note.css({"border-radius":"5px"});
            } else if (clasis == "noteLink"){
                note.css({"border":"none"});
                note.css({"border-radius":"8px"});
            } else if (clasis == "imageLink" || clasis == "imagePageLink"){
                note.css({"border":"1px solid #d3d3d3"});
                note.css({"border-radius":"5px"});
            } else if (clasis == "pageLink"){
                note.css({"border":"1px solid rgb(200, 240, 149, 0.3)"});
                note.css({"border-radius":"5px"});
            } else if (clasis == "pdf"){
                note.css({"border":"1px solid grey"});
                note.css({"border-radius":"5px"});
            } else {}
        }

}





/////////////////////////////////////
//////////   ALIGN ITEMS  /////////////
/////////////////////////////////////

function alignItems(selection){

    console.log("align items");
    console.log(selection);

    base_x = $("#" + selection[0]).css("left");

    for (let i = 0; i < selection.length - 1; i++){

        id = selection[i];
        note = $('#' + id);

        note.css("left", base_x);
        height = note.css("height");

        next_id = selection[i+1]
        next_note = $('#' + next_id);
        next_note.css("left", base_x);
        next_note_top = parseInt(note.css("top").slice(0, -2)) + parseInt(note.css("height").slice(0, -2)) +  10
        next_note.css("top", next_note_top.toString().concat("px"));

    }

    console.log("ajax call");

    $.ajax({

        url: '/move_notes/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            selection: selection,
            page_id: pageID
        }),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            current_y = document.documentElement.scrollTop;
            console.log("current y :", current_y);
            //window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
        },
        error: function (error) {
            console.log("problem");
            current_y = document.documentElement.scrollTop;
            console.log("current y :", current_y);
            //window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
        }

    });


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




