
////////////////////////////////////////////////
/////////////// BUILD IMAGE ///////////////////
////////////////////////////////////////////////

$('.image').each(function(){
    createImage($(this));
});

function createImage(note) {

    id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;

    console.log("build image", "width : ", width, "height : ", height);
    console.log(note);
    console.log("get the width and height after build : ", " width : ", note.css("width"), " height : ", note.css("height"));

    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var img_src = "/static/uploads/" + name
    var img = "<img class='image_img' draggable='false' src=" + img_src + " />";
    var image_id = XMLnote.getElementsByTagName("image_id")[0].childNodes[0].nodeValue;

    var name_div = "<div class='image_name'><div>" + name + "</div></div>"

    console.log(img, x, y);

    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.append(img);
    note.append(name_div);
    note.css("width", width);
    note.css("height", height);

}



///////////////////////////////////////////////////////
////////////////    SELECT IMAGE   /////////////////////
///////////////////////////////////////////////////////

$('.image').each(function(){
    $(this).bind('click.select', function(){
        console.log("hebe");
        selectImage($(this));
    });
});

function selectImage(note){

    // COPY THE NOTE
    note.bind('copy', function() {
        copyNote(note);
    });

    console.log("selected an image");

    note.css({"border-color":"green"});

    var image_name = note.find('.image_name');

    image_name.css("opacity", 1);

    var image_img = note.find('.image_img');

    image_img.css("opacity", 0.3);

    // DELETE NOTE
    $(document).bind('keyup.delete', function(){

        if (event.keyCode == 8){

            id = note.attr("id");
            console.log(id);
            console.log(event.keyCode);

            $.ajax({
                url: '/delete_note/'+pageID,
                type: "POST",
                data: JSON.stringify({
                    id: id
                }),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    window.location.href='/open_page/'+pageID;
                },
                error: function (error) {
                    console.log("problem");
                    window.location.href='/open_page/'+pageID;
                }
            });
        }
    });

    note.addClass("resizable");

    note.unbind('mousedown.drag');

    note.unbind('click.select');

    $(document).click(function(){

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            image_name.css("opacity", 0);

            image_img.css("opacity", 1);

            note.unbind('copy');

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

                dragFunc(note, noteX, noteY);

            });

        }
    });

}



//////////////////////////////////////////////////
///////////////// RIGHT CLICK IMAGE ///////////////
//////////////////////////////////////////////////


$(function() {

      "use strict";

      $.contextMenu({

        selector: '.image',
        callback: function(key, options) {

          if (key === 'link') {

            console.log($(this));
            console.log($(this).attr("id"));
            id = $(this).attr("id");

            var value = prompt("Lien", "");

            if (value != null) {
                $.ajax({
                    url: '/add_link_image/'+pageID,
                    type: "POST",
                    data: JSON.stringify({
                        link : value,
                        id : id
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        console.log(data);
                        window.location.href='/open_page/'+pageID;
                    },
                    error: function (error) {
                        console.log("problem");
                        window.location.href='/open_page/'+pageID;
                    }
                });

            }

          }

        },
        items: {
          'link': {
            name: "Add Link",
            icon: "fa-link"
          },
          'download': {
            name: "Download",
            icon: "fa-download"
          }
        }

      });
    });






