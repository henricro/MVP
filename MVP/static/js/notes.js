

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

    if (event.target.nodeName === 'HTML'){
        x = event.pageX.toString();
        y = event.pageY.toString();

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
    $(this).on('click.selectNote', function(){
        selectNote($(this));
    });
});


function selectNote(note){

    event.stopPropagation();
    id = note.attr("id");

    // COPY THE NOTE
    $(document).on('copy', function() {
        copyNote(note);
    });

    styleSelect(note);

    // DELETE NOTE
    $(document).on('keyup.delete', function(){
        if (event.keyCode == 8){

            $.ajax({
                url: '/delete_note/'+pageID + '/' + user_id,
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

    note.off('click.selectNote');

    // SECOND CLICK
    note.on('click.write', function(){
        $(document).off('keyup.delete')
        writeNote($(this));
    });

    $(document).on('contextmenu', function(event) {

        event.preventDefault();
        if (!note.is(event.target) && note.has(event.target).length === 0){

            $(document).off('keyup.delete');
            note.off('click.write');
            note.on('click.selectNote', function(){
                selectNote($(this));
            });
            $(document).off('copy');

        }
    });

    $(document).on('click.outsideNote', function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            styleDefault(note);
            $(document).off('keyup.delete');
            note.off('click.write');
            $(document).off('copy');
            note.on('click.selectNote', function(){
                selectNote($(this));
            });
            $(document).off('click.outsideNote');

        }
    });
}



/////////////////////////////////////////////////////
/////////////    WRITE IN NOTE   ////////////////////
/////////////////////////////////////////////////////


$('.note').each(function(){
    $(this).on('dblclick.write', function(){
        writeNote($(this));
    });
});

function writeNote(note){

    note.off('click.selectNote');
    note.off('dblclick.write');
    note.off('mousedown.drag');
    note.off('copy');
    note.attr("contenteditable", "true");

    $(document).on('click.update_content', function() {
        if (!note.is(event.target) && note.has(event.target).length === 0){

            content = note.html();
            $(document).off('click.update_content');
            id = note.attr('id')

            if (content == "") {
                current_y = document.documentElement.scrollTop;
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            } else {

                $.ajax({
                    url: '/update_content/' + pageID + '/' + user_id,
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

            note.on('click.selectNote', function() {
                selectNote($(this));
            });

            note.on('dblclick.write', function(){
                writeNote($(this));
            });

            note.on('mousedown.drag', function(){
                dragNote(note);
            });

        }

    });

}


//////////////////////////////////////////////////
///////////////// RIGHT CLICK NOTE ///////////////
//////////////////////////////////////////////////

$(".note").on('contextmenu', function(event) {

    event.preventDefault();
    new_x = event.pageX;
    new_y = event.pageY;

    var note = $(this);
    id = note.attr("id");
    css = $(this).attr('added_css');

    $("#noteRCBox").css("left", new_x);
    $("#noteRCBox").css("top", new_y);
    $("#noteRCBox").show();

    // click outside
    $(document).click(function(){
        if (!$("#noteRCBox").is(event.target) && $("#noteRCBox").has(event.target).length === 0){
            $("#noteRCBox").hide();
        }
    });

    // Add Link
    $('#noteRC_1').on('click', function() {

        var value = prompt("Lien", "");
        if (value == null){} else {

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
    $('#noteRC_2').on('click.copyNote', function() {
        console.log("copy note");
        copyNote(note);
    });

    // Style
    $('#noteRC_3').bind('click', function() {

        if (css){var value = prompt("CSS", css);} else {var value = prompt("CSS", "");}
        if (value == null) {} else {

            $.ajax({
                url: '/add_css/' + pageID + '/' + user_id,
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
    follower.html("copy note");
    follower.show();
});
$("#noteRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteRC_3").on('mouseover', function() {
    follower.html("style note");
    follower.show();
});
$("#noteRC_3").on('mouseout', function() {
    follower.html("");
    follower.hide();
});