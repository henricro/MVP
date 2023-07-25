
////////////////////////////////////////////////
/////////////// BUILD IMAGE ///////////////////
////////////////////////////////////////////////

$('.image').each(function(){
    buildImage($(this));
});

function buildImage(note) {

    var id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;
    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var image_id = XMLnote.getElementsByTagName("image_id")[0].childNodes[0].nodeValue;

    // for the login page
    if (["6220", "6219", "2288"].includes(image_id)) {
        var img_src = "/static/user_data/users/" + 1 + "/uploads/" + name;
    } else {
        var img_src = "/static/user_data/users/" + user_id + "/uploads/" + name;
    }

    var img_div = "<img class='image_img' draggable='false' src=" + img_src + " />";
    var name_div = "<div class='image_name'><div>" + name + "</div></div>"

    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.css("width", width);
    note.css("height", height);
    note.append(img_div);

    // css if any
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
////////////////    SELECT IMAGE   /////////////////////
///////////////////////////////////////////////////////

$('.image').each(function(){
    $(this).bind('click.select', function(){
        selectImage($(this));
    });
});

function selectImage(note){

    id = note.attr("id");

    // COPY THE NOTE
    $(document).bind('copy', function() {
        copyNote(note);
    });

    // change style after click
    note.css({"border":"1px solid green"});
    var image_img = note.find('.image_img');
    image_img.css("opacity", 0.3);
    note.addClass("resizable");

    note.unbind('mousedown.drag');
    note.unbind('click.select');

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

    // if click outside
    $(document).bind('click.outsideImage', function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border":"1px solid transparent"});
            image_img.css("opacity", 1);

            $(document).unbind('copy');

            note.removeClass("resizable");

            $(document).unbind('keyup.delete');

            note.bind('click.select', function(){
                selectImage($(this));
            });

            note.bind('mousedown.drag', function(){

                mouseX = event.pageX;
                mouseY = event.pageY;

                noteX = parseInt(note.css("left").slice(0, -2));
                noteY = parseInt(note.css("top").slice(0, -2));

                dragNote(note, noteX, noteY);

            });

            $(document).unbind('click.outsideImage');

        }

    });

    $(document).bind('contextmenu', function(event) {

        event.preventDefault();

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            image_img.css("opacity", 1);

            $(document).unbind('copy');

            note.removeClass("resizable");

            $(document).unbind('keyup.delete');

            note.bind('click.select', function(){
                selectImage($(this));
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
///////////////// RIGHT CLICK IMAGE ///////////////
//////////////////////////////////////////////////

$(".image").bind('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    var note = $(this);

    id = note.attr("id");
    css = $(this).attr("added_css");

    $("#imageRCBox").css("left", new_x);
    $("#imageRCBox").css("top", new_y);
    $("#imageRCBox").show();

    $(document).click(function(){

        if (!$("#imageRCBox").is(event.target) && $("#imageRCBox").has(event.target).length === 0){

            $("#imageRCBox").hide();

        }

    });

    // Add Link
    $('#imageRC_1').bind('click', function() {

        var value = prompt("Link", "");

        if (value != null) {
            $.ajax({
                url: '/add_link_image/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    link : value,
                    id : id
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
        }

    });

    // Copy Image
    $('#imageRC_2').bind('click', function() {

        copyNote(note);

    });

    //Style
    $('#imageRC_3').bind('click', function() {
        if (css){
            var value = prompt("CSS", css);
        } else {
            var value = prompt("CSS", "");
        }

        if (value != null) {

            console.log("sending css");

            $.ajax({
                url: '/add_css/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    css : value,
                    id : id
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

        }
    });

});
