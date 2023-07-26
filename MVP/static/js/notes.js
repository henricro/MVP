

///////////////////////////////////////////////////////
////////////////    BUILD THE NOTES   /////////////////
///////////////////////////////////////////////////////


$('.note').each(function(){
    buildNote($(this));
});


function buildNote(note) {

    id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    note.css("top",y.concat("px"));
    note.css("left",x.concat("px"));
    note.html(content);

    // added CSS if there is some
    if ( XMLnote.getElementsByTagName("css")[0] ){
        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;
            var style = note.attr('style'); //it will return string

            style += css;
            note.attr('style', style);
            note.attr('added_css', css);

        }
    }
}



///////////////////////////////////////////////////////
/////////////    CREATE NEW NOTE   ////////////////////
///////////////////////////////////////////////////////

$('*:not("div")').dblclick(function(){

    console.log("fefefefe");
    id = biggest + 1;

    if (event.target.nodeName === 'HTML'){
        x = event.pageX.toString();
        y = event.pageY.toString();

        // CREATE HTML NOTE
        $.ajax({
            url: '/create_note/' + pageID + '/' + user_id,
            type: "POST",
            data: JSON.stringify({
                x : x,
                y : y
            }),
            contentType: "application/json",
            success: function (data) {
                current_y = document.documentElement.scrollTop;
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            },
            error: function (error) {
                current_y = document.documentElement.scrollTop;
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            }
        });

    }

});

///////////////////////////////////////////////////
/////////////    SELECT NOTE   ////////////////////
///////////////////////////////////////////////////

$('.note').each(function(){
    $(this).bind('click.selectNote', function(){
        selectNote($(this));
    });
});


function selectNote(note){

    event.stopPropagation();
    id = note.attr("id");

    // COPY THE NOTE
    note.bind('copy', function() {
        copyNote(note);
    });

    note.css({"border":"1px solid green"});

    // DELETE NOTE
    $(document).bind('keyup.delete', function(){

        if (event.keyCode == 8){

            $.ajax({
                url: '/delete_note/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    id: id
                }),
                contentType: "application/json",
                success: function (data) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                }
            });
        }
    });

    note.unbind('click.selectNote');

    // SECOND CLICK
    note.bind('click.write', function(){
        $(document).unbind('keyup.delete')
        writeNote($(this));
    });

    $(document).bind('contextmenu', function(event) {
        event.preventDefault();

        if (!note.is(event.target) && note.has(event.target).length === 0){
            $(document).unbind('keyup.delete');

            note.unbind('click.write');
            note.unbind('copy');
            note.bind('click.select', function(){
                selectNote($(this));
            });

            $(document).unbind('copy');

        }
    });

    event.stopPropagation();

    // if click outside
    $(document).bind('click.outsideNote', function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border":"1px solid rgb(0,0,0,0)"});
            $(document).unbind('keyup.delete');
            note.unbind('click.write');
            note.unbind('copy');
            note.bind('click.select', function(){
                selectNote($(this));
            });
            $(document).unbind('copy');
            $(document).unbind('click.outsideNote');

        }
    });
}



/////////////////////////////////////////////////////
/////////////    WRITE IN NOTE   ////////////////////
/////////////////////////////////////////////////////


$('.note').each(function(){
    $(this).bind('dblclick.write', function(){
        //console.log("double clicked on note");
        writeNote($(this));
    });
});

function writeNote(note){

    note.unbind('click.select');
    note.unbind('dblclick.write');
    note.unbind('mousedown.drag');
    note.unbind('copy');

    note.attr("contenteditable", "true");

    $(document).bind('click.update_content', function() {
        if (!note.is(event.target) && note.has(event.target).length === 0){

            content = note.html();
            $(document).unbind('click.update_content');
            id = note.attr('id')

            if (content == "") {
                current_y = document.documentElement.scrollTop;
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            } else {

                $.ajax({
                    url: '/update_content/'+pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        id: id,
                        content: content
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

            note.attr("contenteditable", "false");

            note.bind('click.select', function() {
                selectNote($(this));
            });

            note.bind('dblclick.write', function(){
                writeNote($(this));
            });

            note.bind('mousedown.drag', function(){
                mouseX = event.pageX;
                mouseY = event.pageY;
                noteX = parseInt(note.css("left").slice(0, -2));
                noteY = parseInt(note.css("top").slice(0, -2));
                dragNote(note, noteX, noteY);
            });

        }
    });
}


//////////////////////////////////////////////////
///////////////// RIGHT CLICK NOTE ///////////////
//////////////////////////////////////////////////

$(".note").bind('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    var note = $(this);
    id = note.attr("id");
    css = $(this).attr('added_css');

    $("#noteRCBox").css("left", new_x);
    $("#noteRCBox").css("top", new_y);
    $("#noteRCBox").show();

    $(document).click(function(){
        if (!$("#noteRCBox").is(event.target) && $("#noteRCBox").has(event.target).length === 0){
            $("#noteRCBox").hide();
        }
    });

    // Add Link
    $('#noteRC_1').bind('click', function() {

        var value = prompt("Lien", "");
        if (value != null) {

            $.ajax({
                url: '/add_link_to_note/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    link : value,
                    id : id
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
        }
    });

    // Copy Note
    $('#noteRC_2').bind('click', function() {
        copyNote(note);
    });

    // Style
    $('#noteRC_3').bind('click', function() {
        if (css){var value = prompt("CSS", css);} else {var value = prompt("CSS", "");}
        if (value != null) {

            $.ajax({
                url: '/add_css/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    css : value,
                    id : id
                }),
                contentType: "application/json",
                success: function (data) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                }
            });

        }
    });

});

$("#noteRC_1").on('mouseover', function() {
    follower.html("add a link");
    follower.show();
});
$("#noteRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteRC_2").on('mouseover', function() {
    follower.html("copy text");
    follower.show();
});
$("#noteRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#imageRC_3").on('mouseover', function() {
    follower.html("style note");
    follower.show();
});
$("#imageRC_3").on('mouseout', function() {
    follower.html("");
    follower.hide();
});