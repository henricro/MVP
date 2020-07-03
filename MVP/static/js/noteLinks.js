////////////////////////////////////////////////
/////////// BUILD THE NOTE LINKS //////////////
////////////////////////////////////////////////

$('.noteLink').each(function(){
    createNoteLink($(this));
});

function createNoteLink(note) {

    id = note.attr("id");

    console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var link = XMLnote.getElementsByTagName("link")[0].childNodes[0].nodeValue;

    var content_div = "<div class='noteLink_content' contenteditable='false'>" + content + "</div>"

    var link_div = "<div class='noteLink_link' ><div>" + link + "</div></div>"

    console.log(content, x, y);

    //console.log("print elmnt");
    //console.log(elmnt);

    note.css("top",y.concat("px"));
    note.css("left",x.concat("px"));
    note.attr("link", link);
    note.attr("title", "link to ".concat(link))
    note.append(content_div);
    note.append(link_div);

}


///////////////////////////////////////////////////////
/////////////    SELECT NOTELINK   ////////////////////
///////////////////////////////////////////////////////

$('.noteLink').each(function(){
    $(this).bind('click.select', function(){
        selectNoteLink($(this));
    });
});

function selectNoteLink(note){

    console.log("select note link");

    note.css({"border-color":"green"});

    link = note.attr("link");

    var noteLink_link = note.find('.noteLink_link');

    noteLink_link.show();
    noteLink_link.css("opacity", 1);
    noteLink_link.css("font-size", "20px");

    var content = note.find('.noteLink_content');

    content.css("opacity", 0.3);

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

    note.css({"cursor":"pointer"});

    note.unbind('mousedown.drag');

    note.unbind('click.select');

    // SECOND CLICK
    note.bind('click.gotolink', function(){

        $(document).unbind('keyup.delete');

        window.open(link, '_blank');

    });

    $(document).click(function(){

        if (!note.is(event.target) && note.has(event.target).length === 0){

            noteLink_link.css("opacity", 0);
            noteLink_link.css("font-size", "15px");

            content.css("opacity", 1);

            note.css({"border-color":""});

            note.css({"cursor":""});

            $(document).unbind('keyup.delete');

            note.unbind('click.gotolink');

            note.bind('click.select', function(){
                selectNoteLink($(this));
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




/////////////////////////////////////////////
///////////////// RIGHT CLICK ///////////////
/////////////////////////////////////////////

$(function() {

      "use strict";

      $.contextMenu({

        selector: '.noteLink',

        callback: function(key, options) {

          if (key === 'link') {
            console.log($(this));
            var id = $(this).attr("id");
            console.log(id);
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

          } else if (key === 'copy') {
            
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
          'copy': {
            name: "Copy",
            icon: "copy"
          }
        }

      });

});


/////////////////////////////////////////////////////////
/////////////    WRITE IN NOTELINK   ////////////////////
/////////////////////////////////////////////////////////


function writeNoteLink(note){

    console.log(note);

    console.log("write in note link");

    note.unbind('mousedown.drag');

    note.unbind('click.select');

    $(document).unbind('click.writeNoteLink');

    note.find('.noteLink_link').hide();

    note.find('.noteLink_content').attr("contenteditable", "true");

    note.find('.noteLink_content').css("opacity", 1);

    $(document).bind('click.clickout', function() {

        if (!note.is(event.target) && note.has(event.target).length === 0){

            console.log("click out of noteLink");

            note.bind('click.select', function(){
                selectNoteLink($(this));
            });

            $(document).unbind('click.clickout');

            content = note.html();

            console.log(content);

            id = note.attr('id')

            $.ajax({
                url: '/update_content/'+pageID,
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

                dragFunc(note);

            });

        }

    });

}