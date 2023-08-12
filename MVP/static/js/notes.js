

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

var idToColor = "hher"

$(".note").on('contextmenu', function(event) {

    event.preventDefault();
    new_x = event.pageX;
    new_y = event.pageY;

    var note = $(this);
    var id = note.attr("id");

    $("#noteRCBox").css("left", new_x);
    $("#noteRCBox").css("top", new_y);
    $("#noteRCBox").css("display", "flex");

    // click outside
    $(document).click(function(){
        if (!$("#noteRCBox").is(event.target) && $("#noteRCBox").has(event.target).length === 0){
            $("#noteRCBox").css("display", "none");
        }
    });

    // copy Note
    $('#noteRC_1').on('click.copyNote', function() {
        console.log("copy note");
        copyNote(note);
    });

    console.log("id of note selected/ to color : ", idToColor);

    // style note
    $('#noteRC_2').on('click', function(event) {

        event.stopPropagation();
        idToColor = id;

        //styleDefault(note);

        $("#noteRCBox").css("display", "none");

        event.preventDefault();
        new_x = event.pageX;
        new_y = event.pageY;

        $("#noteStyleBox").css("left", new_x);
        $("#noteStyleBox").css("top", new_y);
        $("#noteStyleBox").css("display", "flex");

        // click outside note StyleBox
        $(document).on('click', function(event){
            console.log("dzuhudzh");
            if (!$(event.target).closest('#noteStyleBox').length > 0 && !$(event.target).closest('.pcr-app').length > 0){

                console.log("xouxou");

                // remove the choice Box
                $("#noteStyleBox").css("display", "none");

                // send the new css
                css = note.attr("style");
                $.ajax({
                    url: '/add_css/' + pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        css : css,
                        id : id,
                        type: "regular"
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        current_y = document.documentElement.scrollTop;
                    },
                    error: function (error) {
                        current_y = document.documentElement.scrollTop;
                    }
                });

            }
        });


        $('#noteStyleBox_1').on('click', function() {
        });

        $('#noteStyleBox_3').on('click', function() {
            underline = (note.css('text-decoration').includes('underline'));
            if (underline) {
                console.log("underline already")
                note.css('text-decoration','none');
            } else {
                console.log("not underlined");
                note.css('text-decoration','underline');
            }
        });

        $('#noteStyleBox_4').on('click', function() {
            linethrough = (note.css('text-decoration').includes('line-through'));
            if (linethrough) {
                console.log("line through already");
                note.css('text-decoration','none');
            } else {
                console.log("not line through");
                note.css('text-decoration','line-through');
            }
        });

        $('#noteStyleBox_5').on('click.copyNote', function() {
            italic = (note.css('font-style') === 'italic');
            console.log(italic);
            note.css('font-style', italic ? 'normal' : 'italic');
        });

        $('#noteStyleBox_6').bind('click', function() {

            if (css){var value = prompt("CSS", css);} else {var value = prompt("CSS", "");}
            if (value == null) {} else {

                $.ajax({
                    url: '/add_css/' + pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        css : value,
                        id : id,
                        type: "regular"
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

});


$("#noteRC_1").on('mouseover', function() {
    follower.html("copy note");
    follower.show();
});
$("#noteRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteRC_2").on('mouseover', function() {
    follower.html("style note");
    follower.show();
});
$("#noteRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_1").on('mouseover', function() {
    follower.html("size");
    follower.show();
});
$("#noteStyleBox_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#pickr").on('mouseover', function() {
    follower.html("color");
    follower.show();
});
$("#pickr").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_3").on('mouseover', function() {
    follower.html("underline");
    follower.show();
});
$("#noteStyleBox_3").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_4").on('mouseover', function() {
    follower.html("cross");
    follower.show();
});
$("#noteStyleBox_4").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_5").on('mouseover', function() {
    follower.html("italic");
    follower.show();
});
$("#noteStyleBox_5").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_6").on('mouseover', function() {
    follower.html("CSS");
    follower.show();
});
$("#noteStyleBox_6").on('mouseout', function() {
    follower.html("");
    follower.hide();
});