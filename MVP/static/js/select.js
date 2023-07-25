
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
        createSelect();
    }

});


function createSelect() {

    // when moving mouse to create selection box
    $(document).bind('mousemove.multipleSelect', function(){
        console.log("moving mouse");
        moveSelect();
    });

    // when finish creating selection box
    $(document).bind('mouseup.multipleSelect', function(){
        stopSelect();
        $(document).unbind('mouseup.multipleSelect');
    });

}

function moveSelect() {

    event.preventDefault();

    height = Math.abs(event.pageY - startY) ;
    width = Math.abs(event.pageX - startX) ;

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

    // color selected elements with blue border
    for (i in selection){

        id = selection[i]
        note = $("#" + id);
        note.css({"border-radius":"6px"});
        note.css({"border":"2px solid blue"});

    }

    // if selected no element
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

            // if you click outside of the box
            $(document).click(function(){
                if (!$("#selectionRCBox").is(event.target) && $("#selectionRCBox").has(event.target).length === 0 && !$("#selectBox").is(event.target)){
                     $("#selectionRCBox").hide();
                     console.log("clicked outside selection box");
                     console.log(event.target);
                }
            });

            $('#selectionRC_1').bind('click', function() {
                console.log("clicked on align items top down");
                event.stopPropagation();
                alignTopDown(selectionY);
            });

            $('#selectionRC_2').bind('click', function() {
                console.log("clicked on align items left right");
                event.stopPropagation();
                alignLeftRight(selectionX);
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
            } else if (clasis == "imageLink"){
                note.css({"border":"1px solid #d3d3d3"});
                note.css({"border-radius":"5px"});
            } else if (clasis == "imagePageLink"){
                note.css({"border-top":"1px solid #d3d3d3"});
                note.css({"border-right":"1px solid #F68C57"});
                note.css({"border-bottom":"1px solid #F68C57"});
                note.css({"border-left":"1px solid #d3d3d3"});
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

function alignTopDown(selection){

    $("#selectionRCBox").hide();

    // get the 'left' and 'top' style attributes of the highest note in selection :
    base_x = $("#" + selection[0]).css("left").slice(0, -2); // a number as a string : '234'
    base_y = $("#" + selection[0]).css("top").slice(0, -2); // a number as a string : '234'

    // get the heights of the elements as list of strings
    heights = []
    for (let i = 0; i < selection.length; i++){
        id = selection[i];
        note = $("#" + id);
        height = note.css('height').slice(0,-2);
        heights.push(height);
    }

    // set all the new 'top' style attributes :
    tops = [base_y]; // first one
    for (let i = 0; i < selection.length-1; i++){
        top_of_prev = parseInt(tops[tops.length - 1]);
        height_of_prev = parseInt(heights[i]);
        new_top = top_of_prev + height_of_prev + 10;
        new_top_str = new_top.toString();
        tops.push(new_top_str);
    }

    lefts = Array.from({ length: selection.length }, () => base_x);

    new_positions = selection.map((element, index) => [selection[index], lefts[index], tops[index]]);

    // replace the elements with animation
    for (let i = 0; i < new_positions.length; i++){

        var id = new_positions[i][0];
        var new_left = new_positions[i][1];
        var new_top = new_positions[i][2];
        note = $("#" + id);
        note.animate({
            top: new_top.concat("px"),
            left: new_left.concat("px")
        }, 1000);

    }

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

function alignLeftRight(selection){

    $("#selectionRCBox").hide();

    // get the 'left' and 'top' style attributes of the highest note in selection :
    base_x = $("#" + selection[0]).css("left").slice(0, -2); // a number as a string : '234'
    base_y = $("#" + selection[0]).css("top").slice(0, -2); // a number as a string : '234'

    // get the heights of the elements as list of strings
    widths = []
    for (let i = 0; i < selection.length; i++){
        id = selection[i];
        note = $("#" + id);
        width = note.css('width').slice(0,-2);
        widths.push(width);
    }

    // set all the new 'left' style attributes :
    lefts = [base_x]; // first one
    for (let i = 0; i < selection.length-1; i++){
        left_of_prev = parseInt(lefts[lefts.length - 1]);
        width_of_prev = parseInt(widths[i]);
        new_left = left_of_prev + width_of_prev + 10;
        new_left_str = new_left.toString();
        lefts.push(new_left_str);
    }

    tops = Array.from({ length: selection.length }, () => base_y);

    new_positions = selection.map((element, index) => [selection[index], lefts[index], tops[index]]);

    // replace the elements with animation
    for (let i = 0; i < new_positions.length; i++){

        var id = new_positions[i][0];
        var new_left = new_positions[i][1];
        var new_top = new_positions[i][2];
        note = $("#" + id);
        note.animate({
            top: new_top.concat("px"),
            left: new_left.concat("px")
        }, 1000);

    }

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


$("#selectionRC_1").on('mouseover', function() {
    follower.html("align top-down");
    follower.show();
});
$("#selectionRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#selectionRC_2").on('mouseover', function() {
    follower.html("align left-right");
    follower.show();
});
$("#selectionRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});