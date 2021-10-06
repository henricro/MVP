
////////////////////////////////////////////////
/////////////// BUILD IMAGE-PAGE-LINK ///////////////////
////////////////////////////////////////////////

$('.imagePageLink').each(function(){
    createImagePageLink($(this));
});

function createImagePageLink(note) {

    id = note.attr("id");

    var pageTitle = note.attr("pageTitle");

    console.log(note);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var type = XMLnote.getAttribute("type");

    note.attr("title", "go to page ".concat(pageTitle));

    note.addClass(type)

    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;

    var image = XMLnote.getElementsByTagName("image")[0].childNodes[0].nodeValue;
    var src = "/static/user_data/users/" + user_id + "/uploads/" + image
    var img = "<img class='imagePageLink_img' draggable='false' src=" + src + " />";
    var image_id = XMLnote.getElementsByTagName("image_id")[0].childNodes[0].nodeValue;
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;

    var content_div = "<div class='imagePageLink_name'><div>" + content + "</div></div>"

    console.log(img, x, y);

    //console.log("print elmnt");
    //console.log(elmnt);
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.append(img);
    note.append(content_div);
    note.css("width", width);
    note.css("height", height);

    if ( XMLnote.getElementsByTagName("css_image")[0] ){

        if ( XMLnote.getElementsByTagName("css_image")[0].childNodes[0] ){

            var css_image = XMLnote.getElementsByTagName("css_image")[0].childNodes[0].nodeValue;

            var image = note.find(".imagePageLink_img");

            image.attr('style', css_image);

            image.attr('added_css', css_image);

        }

    }


    if ( XMLnote.getElementsByTagName("css_text")[0] ){

        if ( XMLnote.getElementsByTagName("css_text")[0].childNodes[0] ){

            var css_text = XMLnote.getElementsByTagName("css_text")[0].childNodes[0].nodeValue;

            var text = note.find(".imagePageLink_name");

            text.attr('style', css_text);

            text.attr('added_css', css_text);

        }

    }

}



////////////////////////////////////////////////////////////////
////////////////    SELECT IMAGE-PAGE-LINK   /////////////////////
////////////////////////////////////////////////////////////////

$('.imagePageLink').each(function(){
    $(this).bind('click.select', function(){
        selectImagePageLink($(this));
    });
});

function selectImagePageLink(note){

    // COPY THE NOTE
    note.bind('copy', function() {
        copyNote(note);
    });

    console.log("selected an imageeeePageLink");

    pageLinkID= note.attr("pageID");

    note.css({"border-top":"1px solid #60A835"});
    note.css({"border-left":"1px solid #60A835"});
    note.css({"border-bottom":"1px solid #F68C57"});
    note.css({"border-right":"1px solid #F68C57"});
    note.find(".imagePageLink_name").css({"text-decoration": "underline"});
    note.find(".imagePageLink_name").css({"text-decoration-color": "#F68C57"});

    note.css({"cursor":"pointer"});

    // DELETE NOTE
    $(document).bind('keyup.delete', function(){

        if (event.keyCode == 8){

            id = note.attr("id");
            console.log(id);
            console.log(event.keyCode);

            $.ajax({
                url: '/delete_note/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    id: id
                }),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                },
                error: function (error) {
                    console.log("problem");
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                }
            });
        }
    });

    // SECOND CLICK

    note.bind('mousedown.gotopage', function(){

        var left  = event.pageX;
        var top   = event.pageY;
        console.log(left, top);

        $(this).bind('mouseup.gotopage', function(){
            console.log(event.pageX, event.pageY);
            if (!(left != event.pageX || top != event.pageY)) {
                window.open('/open_page/'+ pageLinkID + '/' + user_id, '_blank');
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
    css_text = $(this).find(".imagePageLink_name").attr("style");
    css_image = $(this).find(".imagePageLink_img").attr("style");

    $("#imagePageLinkRCBox").css("left", new_x);
    $("#imagePageLinkRCBox").css("top", new_y);
    $("#imagePageLinkRCBox").show();

    $(document).click(function(){

        if (!$("#imagePageLinkRCBox").is(event.target) && $("#imagePageLinkRCBox").has(event.target).length === 0){

            $("#imagePageLinkRCBox").hide();

        }

    });

    // Change Text
    $('#imagePageLinkRC_1').bind('click', function() {

        $(document).bind('click.writeImagePageLink', function() {
            writeImagePageLink(note);
        });

    });


    //Change Image
    $('#imagePageLinkRC_2').bind('click', function() {
        modalImagePageLink.show();
        modalImagePageLink.find('.drop-area').attr("imagePageLink_id", id);

        // When the user clicks anywhere outside of the modal, close it
        $(document).bind('click.first' , function() {
           $(document).bind('click.second' , function() {

               if (event.target.classList.contains('drop-area')) {
                  console.log('clicked the drop area');
               }
               else {
                    modalImagePageLink.hide();
                    $(document).unbind('click.first');
                    $(document).unbind('click.second');
               }

           });
        });
    });

    // Style
    $('#imagePageLinkRC_3').bind('click', function() {
        console.log($(this));
        if (css_text){
            var value = prompt("CSS", css_text);
        } else {
            var value = prompt("CSS", "");
        }

        if (value != null) {

            console.log("sending css");

            $.ajax({
                url: '/add_css_text_ipl/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    css : value,
                    id : id
                }),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                },
                error: function (error) {
                    console.log("problem");
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                }
            });

        }
    });

    $('#imagePageLinkRC_4').bind('click', function() {
        console.log($(this));
        if (css_image){
            var value = prompt("CSS", css_image);
        } else {
            var value = prompt("CSS", "");
        }

        if (value != null) {

            console.log("sending css");

            $.ajax({
                url: '/add_css_image_ipl/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    css : value,
                    id : id
                }),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                },
                error: function (error) {
                    console.log("problem");
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                }
            });

        }
    });

});


/*
$(function() {

      "use strict";

      $.contextMenu({

        selector: '.imagePageLink',
        callback: function(key, options) {

           if (key === "change"){

              id = $(this).attr("id")  ;
              console.log(id);
              //console.log(id);
              modalImagePageLink.show();
              modalImagePageLink.find('.drop-area').attr("imagePageLink_id", id);

              // When the user clicks anywhere outside of the modal, close it
              $(document).bind('click.first' , function() {
                $(document).bind('click.second' , function() {

                    if (event.target.classList.contains('drop-area')) {
                      console.log('clicked the drop area');
                    }
                    else {
                        modalImagePageLink.hide();
                        $(document).unbind('click.first');
                        $(document).unbind('click.second');
                    }

                });
              });

           }
           if (key === "edit"){

              writeImagePageLink($(this));

           }
        },

        items: {
          'change': {
            name: "Change Image",
            icon: "fa-images"
          },
          'edit': {
            name: "Change Text",
            icon: "fa-edit"
          }
        }

      });

});
*/


/////////////////////////////////////////////////////////
/////////////    WRITE IN IMAGE-PAGE-LINK   ////////////////////
/////////////////////////////////////////////////////////


function writeImagePageLink(note){

    console.log("bdbd");

    console.log(note);

    note.unbind('click.select');
    note.unbind('mousedown.drag');

    note.attr("contenteditable", "true");

    $(document).bind('click.clickout', function() {

        if (!note.is(event.target) && note.has(event.target).length === 0){

            $(document).unbind('click.clickout');

            $(document).bind('click.update_content', function() {

                if (!note.is(event.target) && note.has(event.target).length === 0){

                    content = note.html();

                    console.log(content);

                    $(document).unbind('click.update_content');

                    id = note.attr('id')

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

                    note.attr("contenteditable", "false");

                    note.bind('click.select', function() {
                        selectPageLink($(this));
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

    });

}





