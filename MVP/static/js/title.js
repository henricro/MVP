
///////////////////////////////////////////////////
/////////////    SET THE TITLE   //////////////////
///////////////////////////////////////////////////


/////////  the title  /////////

$('#title_title').html(title);

noteTitle = $("#title");

var XMLnote = xmlDoc.getElementById("title");
//console.log(XMLnote);
var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

//console.log(x,y);
//console.log(noteTitle);

noteTitle.css("top",y.concat("px"));
noteTitle.css("left",x.concat("px"));

///////////  the parents  //////////

noteParents = $("#title_parents");

var XMLnote = xmlDoc.getElementById("parents");
var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;

noteParents.css("top",y.concat("px"));
noteParents.css("left",x.concat("px"));
noteParents.css("width",width.concat("px"));
noteParents.css("height",height.concat("px"));

$('#title_title').bind('dblclick.write', function(){
    writeNote($(this));
});



///////////////////////////////////////////////////
/////////////    SELECT TITLE   ////////////////////
///////////////////////////////////////////////////


$('#title').bind('click.selectTitle', function(){

    console.log("clicked on title");

    title = $(this);
    title_title = $("#title_title");
    title_parents = $("#title_parents");

    selectTitle(title);

    event.stopPropagation();

    $(document).bind('click', function(){

        console.log("whatever");

        if (!title.is(event.target) && title.has(event.target).length === 0){

            title.css({"border-color":""});

            title.unbind('click.parents');

            title.bind('click.selectTitle', function(){
                selectTitle($(this));
            });

            $('#space-down').css("display", "none");

            $('#space-down').unbind("click.down-space");

            title_title.unbind('click.parents');

        }

    });

});


function selectTitle(title){

    console.log("selected the title");

    title.css({"border-color":"green"});

    title.unbind('click.selectTitle');

    /*note.bind('dblclick.write', function(){

        console.log("double clicked on title");

        writeTitle(note);

    });*/

    // show arrow to add space
    $('#space-down').css("display", "block");

    $('#space-down').bind("click.down-space", function(){

        sendAllDown();

        $.ajax({

            url: '/send_all_down/' + pageID + '/' + user_id,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
            },
            error: function (error) {
                console.log("problem");
            }

        });

    });


    // SECOND CLICK
    title_title.bind('click.parents', function(){

        showParents();

    });


}

function sendAllDown() {

    $('.note, .noteLink, .pageLink, .image, .imageLink, .imagePageLink, .to-do-list').each(function(){

        element = $(this);
        y_pos = element.css("top");
        console.log(y_pos);

        y_pos = y_pos.slice(0, -2);
        y_pos = parseInt(y_pos);
        new_y_pos = y_pos + 40;
        new_y_pos = new_y_pos.toString();
        new_y_pos = new_y_pos + "px";

        console.log(new_y_pos);

        element.css("top", new_y_pos);

        //id = element.attr("id");
        //x = element.css("left");
        //y = new_y_pos

    });

};



///////////////////////////////////////////////////
///////////////// RIGHT CLICK TITLE ///////////////
///////////////////////////////////////////////////

$("#title").bind('contextmenu', function(event) {

    event.preventDefault();

    title = $("#title_title").html();

    new_x = event.pageX;
    new_y = event.pageY;

    note = $(this);

    $("#titleRCBox").css("left", new_x);
    $("#titleRCBox").css("top", new_y);
    $("#titleRCBox").show();

    // if click outside
    $(document).click(function(){
        if (!$("#titleRCBox").is(event.target) && $("#titleRCBox").has(event.target).length === 0){
            $("#titleRCBox").hide();
        }
    });

    // Edit Title
    $('#titleRC_1').bind('click', function() {

        var value = prompt("Title", title);
        if (value != null && value!="") {

            $.ajax({
                url: '/edit_title/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    value : value
                }),
                contentType: "application/json",
                success: function (data) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
                }
            });

        } else {
            current_y = document.documentElement.scrollTop;
            window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
        }

    });


});

$("#titleRC_1").on('mouseover', function() {
    follower.html("change title");
    follower.show();
});
$("#titleRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});


/*
///////////////////////////////
/////// SHOW PARENTS  /////////
///////////////////////////////


function showParents(){

    $("#title_parents").show();

    $("#title").unbind('mousedown.drag');

    $("#title_parents").bind('mousedown.drag', function(){
        note = $(this);
        mouseX = event.pageX;
        mouseY = event.pageY;
        noteX = parseInt(note.css("left").slice(0, -2));
        noteY = parseInt(note.css("top").slice(0, -2));
        dragNote(note, noteX, noteY);
    });

    $("#title_parents").bind('click.resize', function() {
        resize($(this));
        $(this).unbind('mousedown.drag');
        $(this).bind('click.move', function() {
        move($(this));
        });
    });

    function resize(note){
        note.css("border", "1px solid green");
        note.addClass('resizable');
    }

    function move(note){
        note.removeClass('resizable');
        note.css("border", "1px dashed green");
        note.bind('mousedown.drag', function(){
            mouseX = event.pageX;
            mouseY = event.pageY;
            noteX = parseInt(note.css("left").slice(0, -2));
            noteY = parseInt(note.css("top").slice(0, -2));
            dragNote(note, noteX, noteY);
        });
        note.bind('click.resize', function(){
            resize(note);
        });
    }

    $(document).bind('click.hideParents', function(){
        $(document).bind('click.hideParents2', function(){

            //console.log(event.target.classList);

            // if click outside of parent space
            if (!$("#title_parents").is(event.target) && $("#title_parents").has(event.target).length === 0){
                //console.log(event.target);
                //console.log("clicked outside of parent space");
                $("#title_parents").hide();

                $(document).unbind('click.hideParents2');
                $(document).unbind('click.hideParents');

                $("#title_parents").removeClass('resizable');

                $("#title_title").bind('click.select', function(){
                    selectTitle($(this));
                });

                $("#title").bind('mousedown.drag', function(){

                    note= $(this);

                    mouseX = event.pageX;
                    mouseY = event.pageY;

                    noteX = parseInt(note.css("left").slice(0, -2));
                    noteY = parseInt(note.css("top").slice(0, -2));

                    dragNote(note, noteX, noteY);

                });

            // if click in parent space
            } else {

                //console.log("clicked in parent space");
                //console.log(event.target);
            }
        });
    });

}

*/

