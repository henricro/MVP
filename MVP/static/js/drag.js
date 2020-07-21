///////////////////////////////////////////////////
/////////////    DRAG ELEMENTS   //////////////////
///////////////////////////////////////////////////


$(".note, .pageLink, .noteLink, .title, .image, .pdf, .imagePageLink, .imageLink").each(function(){

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

    }

    function mouseUp(note) {

        $(document).unbind('mousemove.drag');
        //console.log("stoping");
        //console.log(event.pageX, event.pageY);
        $(document).unbind('mouseup.stopDrag');

        id = note.attr("id");
        x = note.css("left");
        y= note.css("top");

        //console.log(id, x, y);

        //console.log(mouseX, event.pageX)

        if (!(mouseX == event.pageX && mouseY == event.pageY)){

            if (event.target.classList.contains('pageLink') && !(note.attr("id")==$(event.target).attr("id"))){

                console.log("yolo");

                console.log(note, $(event.target));

                console.log(note.attr("id"), $(event.target).attr("id"));

                note_id = note.attr("id");

                page_id = $(event.target).attr("pageid");

                console.log(note_id, page_id);

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
                        window.location.href='/open_page/'+pageID;
                    },
                    error: function (error) {
                        console.log("problem");
                        window.location.href='/open_page/'+pageID;
                    }

                });

            } else {

                console.log("object moved");

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

        var selection = [];

        $(".note, .pageLink, .noteLink, .image, .pdf, .imagePageLink, .imageLink").each(function(){

            note = $(this);

            id = note.attr("id");

            noteX = parseInt(note.css("left").slice(0, -2));
            noteY = parseInt(note.css("top").slice(0, -2));

            if (startX < noteX && noteX < endX && startY < noteY && noteY < endY){
                selection.push(id);
            }

        });

        console.log(selection.length);
        console.log(selection);

        if (selection.length == 0){

            $('#selectBox').remove();

        } else {

            $('#selectBox').bind('mousedown.drag', function(){

                $('#selectBox').remove();

                console.log("mousedown on selectBox");
                console.log(selection);

                mouseX = event.pageX;
                mouseY = event.pageY;

                for (i in selection){

                    id = selection[i];

                    console.log(id);

                    note = $('#' + id);

                    console.log("print thge note");
                    console.log(note);

                    noteX = parseInt(note.css("left").slice(0, -2));
                    noteY = parseInt(note.css("top").slice(0, -2));

                    dragFunc(note, noteX, noteY);

                }

            });

        }

    }

}



