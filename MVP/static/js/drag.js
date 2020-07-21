///////////////////////////////////////////////////
/////////////    DRAG ELEMENTS   //////////////////
///////////////////////////////////////////////////


$(".note, .pageLink, .noteLink, .title, .image, .pdf, .imagePageLink, .imageLink").each(function(){

    $(this).bind('mousedown.drag', function(){

        mouseX = event.pageX;
        mouseY = event.pageY;

        noteX = $(this).css("left");
        noteY = $(this).css("top");
        noteX = noteX.substr(0, noteX.length - 2);
        noteY = noteY.substr(0, noteY.length - 2);
        noteX = parseInt(noteX);
        noteY = parseInt(noteY);

        dragFunc($(this));

    });

});


function dragFunc(note) {

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
