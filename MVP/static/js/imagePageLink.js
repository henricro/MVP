
////////////////////////////////////////////////
/////////////// BUILD IMAGE-PAGE-LINK ///////////////////
////////////////////////////////////////////////

$('.imagePageLink').each(function(){
    buildImagePageLink($(this));
});


function buildImagePageLink(note) {

    id = note.attr("id");
    var pageTitle = note.attr("pageTitle");

    var XMLnote = xmlDoc.getElementById(id);

    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;

    var image = XMLnote.getElementsByTagName("image")[0].childNodes[0].nodeValue;
//    var image_id = XMLnote.getElementsByTagName("image_id")[0].childNodes[0].nodeValue;
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;

    var src = "/static/user_data/users/" + user_id + "/uploads/" + image
    var img_div = "<img class='imagePageLink_img' draggable='false' src=" + src + " />";
    var title_div = "<div class='imagePageLink_name'><div>" + pageTitle + "</div></div>"

    note.attr("title", "go to page ".concat(pageTitle));
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.css("width", width.concat("px"));
    note.css("height", height.concat("px"));
    note.append(img_div);
    note.append(title_div);

    // css for image if there is some
    if ( XMLnote.getElementsByTagName("css_image")[0] ){
        if ( XMLnote.getElementsByTagName("css_image")[0].childNodes[0] ){

            var css_image = XMLnote.getElementsByTagName("css_image")[0].childNodes[0].nodeValue;
            var image = note.find(".imagePageLink_img");

            image.attr('style', css_image);
            image.attr('added_css', css_image);

        }
    }

    // css for title if there is some
    if ( XMLnote.getElementsByTagName("css_text")[0] ){
        if ( XMLnote.getElementsByTagName("css_text")[0].childNodes[0] ){

            var css_title = XMLnote.getElementsByTagName("css_text")[0].childNodes[0].nodeValue;
            var title = note.find(".imagePageLink_name");

            title.attr('style', css_title);
            title.attr('added_css', css_title);

        }
    }

}



//////////////////////////////////////////////////////////////////
////////////////    SELECT IMAGE-PAGE-LINK   /////////////////////
//////////////////////////////////////////////////////////////////

$('.imagePageLink').each(function(){
    $(this).bind('click.select', function(){
        selectImagePageLink($(this));
    });
});

function selectImagePageLink(note){

    id = note.attr("id");
    imagePageLink_id= note.attr("pageID");

    // COPY THE NOTE
    note.bind('copy', function() {
        copyNote(note);
    });

    // style the element when clicked on
    styleSelect(note);

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

    // SECOND CLICK
    note.bind('mousedown.gotopage', function(){

        var left  = event.pageX;
        var top   = event.pageY;

        $(this).bind('mouseup.gotopage', function(){
            if (!(left != event.pageX || top != event.pageY)) {
                window.open('/open_page/'+ imagePageLink_id + '/' + user_id + '/0', '_blank');
            }
        });

    });

    note.addClass("resizable");
    note.unbind('mousedown.drag');
    note.unbind('click.select');

    $(document).bind('contextmenu', function(event) {
        event.preventDefault();

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.unbind('mousedown.gotopage');
            note.unbind('mouseup.gotopage');
            note.unbind('copy');
            note.removeClass("resizable");
            $(document).unbind('keyup.delete');

            note.bind('click.select', function(){
                selectImagePageLink($(this));
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

    $(document).click(function(){

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});
            note.css({"cursor":""});
            note.css({"border":""});
            note.find(".imagePageLink_name").css({"text-decoration":""});

            note.unbind('mousedown.gotopage');
            note.unbind('mouseup.gotopage');
            note.unbind('copy');
            note.removeClass("resizable");
            $(document).unbind('keyup.delete');

            note.bind('click.select', function(){
                selectImagePageLink($(this));
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




/////////////////////////////////////////////////////////////
///////////////// RIGHT CLICK IMAGE-PAGE-LINK ///////////////
/////////////////////////////////////////////////////////////


$(".imagePageLink").bind('contextmenu', function(event) {
    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    id = $(this).attr("id");
    link = $(this).attr("link");
    css_title = $(this).find(".imagePageLink_name").attr("style");
    css_image = $(this).find(".imagePageLink_img").attr("style");

    $("#imagePageLinkRCBox").css("left", new_x);
    $("#imagePageLinkRCBox").css("top", new_y);
    $("#imagePageLinkRCBox").show();

    // hide if click outside
    $(document).click(function(){
        if (!$("#imagePageLinkRCBox").is(event.target) && $("#imagePageLinkRCBox").has(event.target).length === 0){
            $("#imagePageLinkRCBox").hide();
        }
    });

    // Change Image
    $('#imagePageLinkRC_2').bind('click', function(event) {

        event.stopPropagation();

        modalImagePageLink.show();
        modalImagePageLink.find('.drop-area').attr("imagePageLink_id", id);

        $(document).bind('click.drop' , function() {
            if (!event.target.classList.contains('drop-area')) {
                 modalImagePageLink.hide();
                 $(document).unbind('click.drop');
            }
        });

    });

    // Style title
    $('#imagePageLinkRC_3').bind('click', function() {

        if (css_title){var value = prompt("CSS", css_title);} else {var value = prompt("CSS", "");}
        if (value != null) {

            $.ajax({
                url: '/add_css_title_ipl/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    css : value,
                    id : id
                }),
                contentType: "application/json",
                success: function (data) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href= '/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href= '/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                }
            });

        }
    });

    $('#imagePageLinkRC_4').bind('click', function() {

        if (css_image){var value = prompt("CSS", css_image);} else {var value = prompt("CSS", "");}
        if (value != null) {

            $.ajax({
                url: '/add_css_image_ipl/'+pageID + '/' + user_id,
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


// Listen for mousemove event on the document
$(document).on('mousemove', function() {
    // Update the follower div's position to the current mouse coordinates
    follower.css({"left" : (event.pageX - 25) + 'px'}); // Subtract half of the width
    follower.css({"top" : top = (event.pageY - 50) + 'px'});  // Subtract half of the height
});

$("#imagePageLinkRC_2").on('mouseover', function() {
    console.log("over");
    follower.html("change image");
    follower.show();
});

$("#imagePageLinkRC_2").on('mouseout', function() {
    console.log("out");
    follower.html("");
    follower.hide();
});




