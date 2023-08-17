////////////////////////////////////////////////
/////////// BUILD THE NOTE LINKS //////////////
////////////////////////////////////////////////

$('.noteLink').each(function(){
    buildNoteLink($(this));
});

function buildNoteLink(note) {

    console.log("function build notelink");

    id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);

    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var link = XMLnote.getElementsByTagName("link")[0].childNodes[0].nodeValue;
    var link_length = link.length
    console.log(link_length);
    if (link_length > 40) {
        var content_div = "<div class='noteLink_content' contenteditable='false'>" + link.slice(0,40) + "..." + "</div>";
    } else {
        var content_div = "<div class='noteLink_content' contenteditable='false'>" + link.slice(0,40) + "</div>";
    }
    var link_div = "<div class='noteLink_link' ><div>" + link + "</div></div>";

    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.attr("link", link);
    note.attr("title", "link to ".concat(link))
    note.append(content_div);
    note.append(link_div);

    if (XMLnote.getElementsByTagName("favicon")[0]){

        var favicon = XMLnote.getElementsByTagName("favicon")[0].childNodes[0].nodeValue;
        var user_uploads_path = "/static/user_data/users/" + user_id + "/uploads/";
        var favicon_div = "<img class='noteLink_favicon' src= '" + user_uploads_path + favicon + "'/>"
        note.append(favicon_div);

    }


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
/////////////    SELECT NOTELINK   ////////////////////
///////////////////////////////////////////////////////

$('.noteLink').each(function(){
    $(this).bind('click.selectNoteLink', function(){
        selectNoteLink($(this));
    });
});

function selectNoteLink(note){

    link = note.attr("link");
    styleSelect(note);

    // COPY THE NOTE
    $(document).on('copy', function() {
        copyNote(note);
    });

    // DELETE NOTE
    $(document).bind('keyup.delete', function(){
        if (event.keyCode == 8){

            id = note.attr("id");
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

    note.off('click.selectNoteLink');

    // SECOND CLICK
    note.bind('click.gotolink', function(){
        $(document).unbind('keyup.delete');
        window.open(link, '_blank');
    });

    $(document).on('click.outsideNoteLink contextmenu.outsideNoteLink', function(){
        if (!note.is(event.target) && !note.has(event.target).length > 0){

            styleDefault(note);
            $(document).off('keyup.delete');
            $(document).off('copy');
            note.off('click.gotolink');
            note.on('click.selectNoteLink', function(){
                selectNoteLink($(this));
            });
            $(document).off('click.outsideNoteLink contextmenu.oustidNoteLink');

        }
    });

}


/////////////////////////////////////////////
///////////////// RIGHT CLICK ///////////////
/////////////////////////////////////////////

$(".noteLink").bind('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    id = $(this).attr("id");
    link = $(this).attr("link");

    $("#noteLinkRCBox").css("left", new_x);
    $("#noteLinkRCBox").css("top", new_y);
    $("#noteLinkRCBox").show();

    $(document).click(function(){
        if (!$("#noteLinkRCBox").is(event.target) && $("#noteLinkRCBox").has(event.target).length === 0){
            $("#noteLinkRCBox").hide();
        }
    });


    // Edit
    $('#noteLinkRC_1').bind('click', function() {

        copyToClipboard(link);

    });


});

/*
$(function() {

      "use strict";

      $.contextMenu({

        selector: '.noteLink',

        callback: function(key, options) {

          var id = $(this).attr("id");

          if (key === 'link') {

            var link = $(this).attr("link");
            console.log(link);
            var content = $(this).find('.content_div').text();
            console.log(content);

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
          else if (key === 'edit') {

            note = $(this);

            $(document).bind('click.writeNoteLink', function() {

                writeNoteLink(note);

            });

          } else if (key === 'style') {

            if ($(this).attr('added_css')){
                var value = prompt("CSS", $(this).attr('added_css'));
            } else {
                var value = prompt("CSS", "");
            }

            if (value != null) {

                console.log("sending css");

                $.ajax({
                    url: '/add_css/'+pageID,
                    type: "POST",
                    data: JSON.stringify({
                        css : value,
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
            name: "Change link",
            icon: "fa-link"
          },
          'edit': {
            name: "Edit",
            icon: "fa-edit"
          },
          'style': {
            name: "Style",
            icon: "fa-paint-brush"
          }
        }

      });

});
*/

/////////////////////////////////////////////////////////
/////////////    WRITE IN NOTELINK   ////////////////////
/////////////////////////////////////////////////////////


function writeNoteLink(note){

    //console.log(note);

    //console.log("write in note link");

    note.unbind('mousedown.drag');

    note.unbind('click.select');

    $(document).unbind('click.writeNoteLink');

    note.find('.noteLink_link').hide();

    note.find('.noteLink_content').attr("contenteditable", "true");

    note.find('.noteLink_content').css("opacity", 1);

    $(document).bind('click.clickout', function() {

        if (!note.is(event.target) && note.has(event.target).length === 0){

            $(document).unbind('click.clickout');

            //console.log("click out of noteLink");

            note.bind('click.select', function(){
                selectNoteLink($(this));
            });

            content = note.html();

            //console.log(content);

            id = note.attr('id')

            $.ajax({
                url: '/update_content/'+pageID + '/' + user_id,
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

            note.find('.noteLink_link').show();

            note.find('.noteLink_content').attr("contenteditable", "false");

            note.bind('mousedown.drag', function(){

                mouseX = event.pageX;
                mouseY = event.pageY;

                noteX = $(this).css("left");
                noteY = $(this).css("top");
                noteX = noteX.substr(0, noteX.length - 2);
                noteY = noteY.substr(0, noteY.length - 2);
                noteX = parseInt(noteX);
                noteY = parseInt(noteY);

                dragNote(note);

            });

        }

    });

}

$("#noteLinkRC_1").on('mouseover', function() {
    follower.html("Copy link");
    follower.show();
});
$("#noteLinkRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

