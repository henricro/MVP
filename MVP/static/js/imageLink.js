////////////////////////////////////////////////
/////////// BUILD THE IMAGE-LINKS //////////////
////////////////////////////////////////////////

$('.imageLink').each(function(){
    createImageLink($(this));
});

function createImageLink(note) {

    id = note.attr("id");

    ////console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    ////console.log(XMLnote);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;
    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    if (note.hasClass('global')) {
        //console.log("is global");
        var src = "/static/images/welcome_page/" + name;
    } else {
        //console.log("is not global");
        var src = "/static/user_data/users/" + user_id + "/uploads/" + name;
    }

    var img = "<img class='imageLink_img' draggable='false' src=" + src + " />";

    var link = XMLnote.getElementsByTagName("link")[0].childNodes[0].nodeValue;

    var link_div = "<div class='imageLink_link'><div>" + link + "</div></div>"


    ////console.log("print elmnt");
    ////console.log(elmnt);
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
    $(this).bind('click.selectImageLink', function(){
        ////console.log("hobo");
        selectImageLink($(this));
    });
});

function selectImageLink(note){

    id = note.attr("id");
    orWidth = note.css("width");
    orHeight = note.css("height");
    //console.log(id, orWidth, orHeight);

    // COPY THE NOTE
    note.bind('copy', function() {
        copyNote(note);
    });


    styleSelect(note);

    link = note.attr("link");

    // DELETE NOTE
    $(document).bind('keyup.delete', function(){
        if (event.keyCode == 8){

            id = note.attr("id");
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

    note.addClass("resizable");

    note.off('mousedown.drag');
    note.off('click.selectImageLink');

    // SECOND CLICK

    note.on('mousedown.gotolink', function(){
        var left  = event.pageX;
        var top   = event.pageY;

        $(this).bind('mouseup.gotolink', function(){
            if (!(left != event.pageX || top != event.pageY)) {
                window.open(link, '_blank');
            }
        });
    });

    $(document).on('click.outside', function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            id = note.attr("id");
            width = note.css("width");
            height = note.css("height");

            if (orHeight!=height || orWidth!=width) {
                saveSizes(id, width.slice(0,-2), height.slice(0,-2));
            }

            styleDefault(note);

            $(document).off('copy');
            note.removeClass("resizable");
            $(document).off('keyup.delete');
            note.on('click.selectImageLink', function(){
                selectImageLink($(this));
            });
            note.on('mousedown.drag', function(){
                mouseX = event.pageX;
                mouseY = event.pageY;
                noteX = parseInt(note.css("left").slice(0, -2));
                noteY = parseInt(note.css("top").slice(0, -2));
                dragNote(note, noteX, noteY);
            });
            $(document).off('click.outside');
            note.off('mousedown.gotolink');

        }

    });

}


////////////////////////////////////////////////////////
///////////////// RIGHT CLICK IMAGE-LINK ///////////////
////////////////////////////////////////////////////////


$(".imageLink").on('contextmenu', function(event) {

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
    $('#imageLinkRC_1').on('click', function() {

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


    //Change Image
    $('#imageLinkRC_2').on('click', function() {
        modalImageLink.show();
        modalImageLink.find('.drop-area').attr("imageLink_id", id);

        // When the user clicks anywhere outside of the modal, close it
        $(document).on('click.first' , function() {
           $(document).on('click.second' , function() {

               if (event.target.classList.contains('drop-area')) {
                  ////console.log('clicked the drop area');
               }
               else {
                    modalImageLink.hide();
                    $(document).unbind('click.first');
                    $(document).unbind('click.second');
               }

           });
        });
    });


});


$("#imageLinkRC_1").on('mouseover', function() {
    follower.html("change the link");
    follower.show();
});
$("#imageLinkRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#imageLinkRC_2").on('mouseover', function() {
    follower.html("change image");
    follower.show();
});
$("#imageLinkRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#imageLinkRC_3").on('mouseover', function() {
    follower.html("download");
    follower.show();
});
$("#imageLinkRC_3").on('mouseout', function() {
    follower.html("");
    follower.hide();
});



/*

$(function() {

      "use strict";

      $.contextMenu({

        selector: '.imageLink',
        callback: function(key, options) {

          if (key === 'link') {

            //console.log("right click imageLink");

            //console.log($(this));
            //console.log($(this).attr("id"));
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
