////////////////////////////////////////////////
/////////////// BUILD DOCX ///////////////////
////////////////////////////////////////////////

$('.docx').each(function(){
    buildDocx($(this));
});

function buildDocx(note) {

    id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    if (XMLnote.getElementsByTagName("width")[0].childNodes[0]){
        var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
        note.css("width", width);
    }
    if (XMLnote.getElementsByTagName("height")[0].childNodes[0]){
        var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;
        note.css("height", height);
    }
    var storage_name = XMLnote.getElementsByTagName("storage_name")[0].childNodes[0].nodeValue;
    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    var img_src = "/static/images/icons/docx.png"
    var img = "<img class='docx_img' draggable='false' src=" + img_src + " />";
    var name_div = "<div class='docx_name'>" + name + "</div>"

    docx_src = "/static/user_data/users/" + user_id + "/uploads/" + storage_name;
    note.attr("docx", docx_src );
    note.css("position", "absolute");
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));

    note.append(img);
    note.append(name_div);

    if ( XMLnote.getElementsByTagName("css")[0] ){
        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;
            var style = note.attr('style'); //it will return string
            style += css;
            note.find(".docx_img").attr('style', css);
            note.attr('style', style);
            note.attr('added_css', css);

        }
    }
}





///////////////////////////////////////////////////////
////////////////    SELECT docx   /////////////////////
///////////////////////////////////////////////////////

$('.docx').each(function(){
    $(this).on('click.selectDocx', function(){
        selectDocx($(this));
    });
});

function selectDocx(note){

    id = note.attr("id");
    orWidth = note.css("width");
    orHeight = note.css("height");

    $(document).on('copy', function() {
        console.log("fefefefefe");
        copyNote(note);
    });

    console.log(id, orHeight, orWidth);

    var docx = note.attr("docx");

    styleSelect(note);
    note.addClass("resizable");
    note.off('mousedown.drag');
    note.off('click.selectDocx');

    // delete the docx
    $(document).on('keyup.delete', function(){
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

    // SECOND CLICK on Docx
    note.on('mousedown.gotodocx', function(){

        var left  = event.pageX;
        var top   = event.pageY;

        $(this).on('mouseup.gotodocx', function(){
            if (!(left != event.pageX || top != event.pageY)) {
                window.open(docx, '_blank');
            }
        });

    });

    $(document).on('click.outside', function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            id = note.attr("id");
            width = note.css("width");
            height = note.css("height");

            if (orHeight!=height || orWidth!=width) {
                saveSizes(id, width.slice(0,-2), height.slice(0, -2));
            }

            styleDefault(note);

            note.off('mousedown.gotodocx');
            note.off('mouseup.gotodocx');
            $(document).off('copy');
            note.removeClass("resizable");
            $(document).off('keyup.delete');
            $(document).off('click.outside');

            note.on('click.selectDocx', function(){
                selectDocx($(this));
            });

            note.on('mousedown.drag', function(){

                mouseX = event.pageX;
                mouseY = event.pageY;
                noteX = parseInt(note.css("left").slice(0, -2));
                noteY = parseInt(note.css("top").slice(0, -2));
                dragNote(note, noteX, noteY);

            });
        }
    });
}



/////////////////////////////////////////////////
///////////////// RIGHT CLICK DocX ///////////////
/////////////////////////////////////////////////


$(".docx").on('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    id = $(this).attr("id");
    css = $(this).attr("added_css");

    $("#docxRCBox").css("left", new_x);
    $("#docxRCBox").css("top", new_y);
    $("#docxRCBox").show();

    //click outside
    $(document).on('click.outside', function(){
        if (!$("#docxRCBox").is(event.target) && $("#docxRCBox").has(event.target).length === 0){
            $("#docxRCBox").hide();
        }
    });

    //Style
    $('#docxRC_1').on('click', function() {
        if (css){var value = prompt("CSS", css);} else {var value = prompt("CSS", "");}

        if (value == null) {} else {

            $.ajax({
                url: '/add_css/'+pageID + '/' + user_id,
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


$("#docxRC_1").on('mouseover', function() {
    follower.html("download docx");
    follower.show();
});
$("#docxRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

