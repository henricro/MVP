
///////////////////////////////////////////////
//////////  SELECT MULTIPLE //////////////////
/////////////////////////////////////////////

$(document).bind('mousedown.multipleSelect', function(){

    startX = event.pageX;
    startY = event.pageY;

    console.log(event);
    console.log(startX, startY);

    selectBox = "<div id='selectBox' style='position:absolute; background-color:blue; opacity:0.1;'></div>"

    $('body').append(selectBox);

    var selectBox = $('#selectBox');

    if (event.target.nodeName === 'HTML'){
        //event.stopPropagation();
        console.log("wonka");
        //event.stopPropagation();
        createSelect();
    }

});


function createSelect() {

    $(document).bind('mousemove.multipleSelect', function(){
        console.log("moving mouse");
        moveSelect();
    });

    $(document).bind('mouseup.multipleSelect', function(){
        console.log("mouse up");
        stopSelect();
        $(document).unbind('mouseup.multipleSelect');
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
    $(".note, .pageLink, .noteLink, .image, .pdf, .imagePageLink, .imageLink, .to-do-list").each(function(){

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
            selection.push([id, noteY, noteX]);
        }

    });

    selectionY = selection.sort((a, b) => a[1] - b[1]).map(arr => arr[0]);
    selectionX = selection.sort((a, b) => a[2] - b[2]).map(arr => arr[0]);
    selection = selection.map(arr => arr[0]);
    console.log(selection);
    console.log(selectionY);
    console.log(selectionX);

    // color selected elements with blue border
    for (i in selection){
        id = selection[i]
        note = $("#" + id);
        note.css({"border":"2px solid blue"});
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

            console.log("right click on selection box");

            event.preventDefault();

            //console.log("print this");
            //console.log(event.target);

            $("#selectionRCBox").css("left", event.pageX);
            $("#selectionRCBox").css("top", event.pageY);
            $("#selectionRCBox").show();

            // if you click outside of the box
            $(document).click(function(){
                if (!$("#selectionRCBox").is(event.target) && $("#selectionRCBox").has(event.target).length === 0 && !$("#selectBox").is(event.target)){
                     $("#selectionRCBox").hide();
                     console.log("clicked outside selection box");
                     console.log(event.target);
                }
            });

            $('#selectionRC_1').bind('click', function() {
                console.log("clicked on align items");
                event.stopPropagation();
                alignItemsVertical(selectionY);
            });

            $('#selectionRC_2').bind('click', function() {
                console.log("clicked on align items");
                event.stopPropagation();
                alignItemsHorizontal(selectionX);
            });

            //}

        });

        // if drag selection
        $('#selectBox').bind('mousedown.drag', function(){

            if (event.which == 3) { console.log("right click"); } else {

                $(document).unbind('keyup.delete');

                setTimeout(
                    function() {$('#selectBox').hide();},
                    100
                )

                //console.log("mousedown on selectBox");
                //console.log(selection);

                mouseX = event.pageX;
                mouseY = event.pageY;

                console.log("drag Selection");
                dragNotes(selection);

            }

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
        console.log(note);

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
            } else if (clasis == "image"){
                note.css({"border":"1px solid transparent"});
                note.css({"border-radius":"5px"});
            } else if (clasis == "to-do-list"){
                note.css({"border":""});
                note.css({"border-radius":""});
            } else {}
        }

}





/////////////////////////////////////
//////////   ALIGN ITEMS  /////////////
/////////////////////////////////////

function alignItemsVertical(selection){

    $("#selectionRCBox").hide();

    console.log("align items vertical");
    console.log(selection);

    base_x = parseInt($("#" + selection[0]).css("left").slice(0, -2));

    new_positions = []

    for (let i = 0; i < selection.length - 1; i++){

        id = selection[i];
        note = $('#' + id);

        note.css("left", base_x.toString().concat("px"));
        height = note.css("height");

        next_id = selection[i+1]
        next_note = $('#' + next_id);
        next_note.css("transition", "left 1s, top 1s");
        next_note.css("left", base_x.toString().concat("px"));
        next_note_top = parseInt(note.css("top").slice(0, -2)) + parseInt(note.css("height").slice(0, -2)) +  10
        next_note.css("top", next_note_top.toString().concat("px"));

        next_note.css("transition", "top 0s, left 0s");

        new_positions.push([id, base_x.toString(), note.css("top").slice(0, -2)]);

    }

    new_positions.push([selection[selection.length - 1], base_x.toString(), next_note_top.toString()])

    console.log("ajax call");
    console.log(selection);

    console.log(new_positions);

    // ajax call with id x and y postion if element has moved
    $.ajax({

        url: '/update_positions/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            positions : new_positions
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


function alignItemsHorizontal(selection){

    $("#selectionRCBox").hide();

    console.log("align items horizontal");
    console.log(selection);

    base_y = parseInt($("#" + selection[0]).css("top").slice(0, -2));

    new_positions = []

    for (let i = 0; i < selection.length - 1; i++){

        id = selection[i];
        note = $('#' + id);

        note.css("top", base_y.toString().concat("px"));
        width = note.css("width");

        next_id = selection[i+1]
        next_note = $('#' + next_id);
        next_note.css("transition", "left 1s, top 1s");
        next_note.css("top", base_y.toString().concat("px"));
        next_note_left = parseInt(note.css("left").slice(0, -2)) + parseInt(note.css("width").slice(0, -2)) +  10
        next_note.css("left", next_note_left.toString().concat("px"));

        next_note.css("transition", "top 0s, left 0s");

        new_positions.push([id, base_y.toString(), note.css("left").slice(0, -2)]);

    }

    new_positions.push([selection[selection.length - 1], base_y.toString(), next_note_left.toString()])

    console.log("ajax call");
    console.log(selection);

    console.log(new_positions);

    // ajax call with id x and y postion if element has moved
    $.ajax({

        url: '/update_positions/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            positions : new_positions
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
