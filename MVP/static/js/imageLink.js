////////////////////////////////////////////////
/////////// BUILD THE IMAGE-LINKS //////////////
////////////////////////////////////////////////

$('.imageLink').each(function(){
    createImageLink($(this));
});

function createImageLink(note) {

    id = note.attr("id");

    console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;

    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var src = "/static/uploads/" + name
    var img = "<img class='imageLink_img' draggable='false' src=" + src + " />";
    var image_id = XMLnote.getElementsByTagName("image_id")[0].childNodes[0].nodeValue;

    var link = XMLnote.getElementsByTagName("link")[0].childNodes[0].nodeValue;

    var link_div = "<div class='imageLink_link'><div>" + link + "</div></div>"


    //console.log("print elmnt");
    //console.log(elmnt);
    note.css("top",y.concat("px"));
    note.css("left",x.concat("px"));
    note.attr("link", link);
    note.attr("title", "link to ".concat(link));
    note.append(img);
    note.append(link_div);
    note.css("width", width);
    note.css("height", height);


}


/////////////////////////////////////////////////////////
/////////////    SELECT IMAGE-LINK   ////////////////////
/////////////////////////////////////////////////////////

$('.imageLink').each(function(){
    $(this).bind('click.select', function(){
        selectImageLink($(this));
    });
});

function selectImageLink(note){

    console.log("select image link");

    note.css({"border-color":"green"});

    link = note.attr("link");

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

    note.css({"cursor":"pointer"});

    note.unbind('click.select');

    // SECOND CLICK

    note.bind('mousedown.gotolink', function(){

        var left  = event.pageX;
        var top   = event.pageY;
        console.log(left, top);

        $(this).bind('mouseup.gotolink', function(){
            console.log(event.pageX, event.pageY);
            if (!(left != event.pageX || top != event.pageY)) {
                window.open(link, '_blank');
            }
        });

    });


    $(document).click(function(){

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            note.css({"cursor":""});

            note.removeClass("resizable");

            $(document).unbind('keyup.delete');

            note.unbind('mousedown.gotolink');

            note.unbind('mouseup.gotolink');

            note.bind('click.select', function(){
                selectImageLink($(this));
            });
            note.bind('mousedown.drag', function(){

                mouseX = event.pageX;
                mouseY = event.pageY;

                noteX = $(this).css("left");
                noteY = $(this).css("top");
                noteX = noteX.substr(0, noteX.length - 2);
                noteY = noteY.substr(0, noteY.length - 2);
                noteX = parseInt(noteX);
                noteY = parseInt(noteY);

                dragFunc($(this));

            });


        }
    });

}


////////////////////////////////////////////////////////
///////////////// RIGHT CLICK IMAGE-LINK ///////////////
////////////////////////////////////////////////////////


$(function() {

      "use strict";

      $.contextMenu({

        selector: '.imageLink',
        callback: function(key, options) {

          if (key === 'link') {

            console.log("right click imageLink");

            console.log($(this));
            console.log($(this).attr("id"));
            id = $(this).attr("id");
            console.log(id);

            var link = $(this).attr("link");

            var value = prompt("Lien", link);

            if (value != null) {

                $.ajax({
                    url: '/change_link/'+pageID,
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
          if (key === "image"){

              id = $(this).attr("id");
              console.log(id);
              //console.log(id);
              console.log(modalImageLink);
              modalImageLink.show();
              modalImageLink.find('.drop-area').attr("imageLink_id", id);

              // When the user clicks anywhere outside of the modal, close it
              $(document).bind('click.first' , function() {
                $(document).bind('click.second' , function() {

                    if (event.target.classList.contains('drop-area')) {
                      console.log('clicked the drop area');
                    }
                    else {
                        modalImageLink.hide();
                        $(document).unbind('click.first');
                        $(document).unbind('click.second');
                    }

                });
              });

           }

        },

        items: {
          'link': {
            name: "Change Link",
            icon: "fa-link"
          },
          'image': {
            name: "Change Image",
            icon: "fa-images"
          }
        }

      });

    });


