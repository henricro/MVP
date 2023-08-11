////////////////////////////////////////////////
/////////// BUILD THE IMAGE-LINKS //////////////
////////////////////////////////////////////////

$('.imageLink').each(function(){
    createImageLink($(this));
});

function createImageLink(note) {

    id = note.attr("id");

    //console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    //console.log(XMLnote);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;

    var image_id = XMLnote.getElementsByTagName("image_id")[0].childNodes[0].nodeValue;

    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    if (note.hasClass('global')) {
        console.log("is global");
        var src = "/static/images/welcome_page/" + name;
    } else {
        console.log("is not global");
        var src = "/static/user_data/users/" + user_id + "/uploads/" + name;
    }

    var img = "<img class='imageLink_img' draggable='false' src=" + src + " />";

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

    if ( XMLnote.getElementsByTagName("css")[0] ){

        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;

            var style = note.attr('style'); //it will return string

            style += css;

            note.find(".imageLink_img").attr('style', css);

            note.attr('style', style);

            note.attr('added_css', css);

        }

    }


}


/////////////////////////////////////////////////////////
/////////////    SELECT IMAGE-LINK   ////////////////////
/////////////////////////////////////////////////////////

$('.imageLink').each(function(){
    $(this).bind('click.select', function(){
        //console.log("hobo");
        selectImageLink($(this));
    });
});

function selectImageLink(note){

    // COPY THE NOTE
    note.bind('copy', function() {
        //console.log("clicked to copy an imageLink");
        copyNote(note);
    });

    //console.log("select image link");

    note.css({"border-color":"green"});

    link = note.attr("link");

    // DELETE NOTE
    $(document).bind('keyup.delete', function(){

        if (event.keyCode == 8){

            id = note.attr("id");
            //console.log(id);
            //console.log(event.keyCode);

            $.ajax({
                url: '/delete_note/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    id: id
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

    note.addClass("resizable");

    note.css("overflow", "auto")

    note.unbind('mousedown.drag');

    note.css({"cursor":"pointer"});

    note.unbind('click.select');

    // SECOND CLICK

    note.bind('mousedown.gotolink', function(){

        var left  = event.pageX;
        var top   = event.pageY;
        //console.log(left, top);

        $(this).bind('mouseup.gotolink', function(){
            //console.log(event.pageX, event.pageY);
            if (!(left != event.pageX || top != event.pageY)) {
                window.open(link, '_blank');
            }
        });

    });

    $(document).bind('contextmenu', function(event) {

        event.preventDefault();

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            note.css({"cursor":""});

            note.removeClass("resizable");

            note.css("overflow", "hidden")

            $(document).unbind('keyup.delete');

            note.unbind('copy');

            note.unbind('mousedown.gotolink');

            note.unbind('mouseup.gotolink');

            note.bind('click.select', function(){
                selectImageLink($(this));
            });

            //console.log("monkeeeey");

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

            note.removeClass("resizable");

            note.css("overflow", "hidden")

            $(document).unbind('keyup.delete');

            note.unbind('copy');

            note.unbind('mousedown.gotolink');

            note.unbind('mouseup.gotolink');

            note.bind('click.select', function(){
                selectImageLink($(this));
            });

            //console.log("monkeeeey");

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


////////////////////////////////////////////////////////
///////////////// RIGHT CLICK IMAGE-LINK ///////////////
////////////////////////////////////////////////////////


$(".imageLink").bind('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    id = $(this).attr("id");
    link = $(this).attr("link");
    css = $(this).attr("added_css");

    $("#imageLinkRCBox").css("left", new_x);
    $("#imageLinkRCBox").css("top", new_y);
    $("#imageLinkRCBox").show();

    $(document).click(function(){

        if (!$("#imageLinkRCBox").is(event.target) && $("#imageLinkRCBox").has(event.target).length === 0){

            $("#imageLinkRCBox").hide();

        }

    });

    // Add Link
    $('#imageLinkRC_1').bind('click', function() {

        var value = prompt("Link", link);

        if (value != null) {
            $.ajax({
                url: '/change_link/'+pageID + '/' + user_id,
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


    //Change Image
    $('#imageLinkRC_2').bind('click', function() {
        modalImageLink.show();
        modalImageLink.find('.drop-area').attr("imageLink_id", id);

        // When the user clicks anywhere outside of the modal, close it
        $(document).bind('click.first' , function() {
           $(document).bind('click.second' , function() {

               if (event.target.classList.contains('drop-area')) {
                  //console.log('clicked the drop area');
               }
               else {
                    modalImageLink.hide();
                    $(document).unbind('click.first');
                    $(document).unbind('click.second');
               }

           });
        });
    });

    // Style
    $('#imageLinkRC_3').bind('click', function() {
        //console.log($(this));
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

/*

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

*/
