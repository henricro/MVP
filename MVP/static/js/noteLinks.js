////////////////////////////////////////////////
/////////// CREATE THE NOTE LINKS //////////////
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

    console.log(content, x, y);

    //console.log("print elmnt");
    //console.log(elmnt);
    note.attr("class", "noteLink");
    note.css("position","absolute");
    note.css("top",y.concat("px"));
    note.css("left",x.concat("px"));
    note.attr("link", link);
    note.html(content);

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

    console.log("ouaehoeaubhoueabh");

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

    note.css({"cursor":"pointer"});

    note.unbind('click.select');

    // SECOND CLICK
    note.bind('click.gotolink', function(){

        $(document).unbind('keyup.delete');

        window.open(link, '_blank');

    });

    $(document).click(function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            note.css({"cursor":""});

            $(document).unbind('keyup.delete');

            note.unbind('click.gotolink');

            note.bind('click.select', function(){
                selectNoteLink($(this));
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

          } else if (key === 'edit') {
            writeNoteLink($(this));
          } else if (key === 'copy') {
            console.log("money");
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

                    note.attr("contenteditable", "false");

                    note.bind('click.select', function() {
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

                        dragFunc(note);

                    });

                }

            });

        }

    });

}