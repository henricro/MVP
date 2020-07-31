

     ////////////////////////////////////////////////////////////////////////////////////////////
////////////////    PUT THE SIMPLE NOTES IN THEIR X,Y POSITIONS and add content   /////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////

$('.note').each(function(){
    createNote($(this));
});


function createNote(note) {

    id = note.attr("id");

    console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    console.log(content, x, y);

    //console.log("print elmnt");
    //console.log(elmnt);
    note.attr("class", "note")
    note.css("position","absolute");
    note.css("top",y.concat("px"));
    note.css("left",x.concat("px"));
    note.html(content);

}



///////////////////////////////////////////////////////
/////////////    CREATE NEW NOTE   ////////////////////
///////////////////////////////////////////////////////

$(document).dblclick(function(){

    console.log(event.target.nodeName);

    id = biggest + 1;
    console.log(id);

    if (event.target.nodeName === 'HTML'){
        x = event.pageX.toString();
        y = event.pageY.toString();

        // CREATE HTML NOTE

        //console.log(x, y);

        //elem = '<div class="note"><input type="text" class="input" value=""/><div class="content"></div></div>';
        //$('body').append(elem);

        //var elmnt = $(".note:last");
        //console.log("print elmnt");
        //console.log(elmnt);
        //elmnt.css("position","absolute");
        //elmnt.css("top",y.concat("px"));
        //elmnt.css("left",x.concat("px"));
        //elmnt.attr("id",id);
        //elmnt.find('.content').text("new content");


        $.ajax({
            url: '/create_note/'+pageID,
            type: "POST",
            data: JSON.stringify({
                x : x,
                y : y
            }),
            contentType: "application/json",
            success: function (data) {
                //console.log(data);
                window.location.href='/open_page/'+pageID;
            },
            error: function (error) {
                //console.log("problem");
                window.location.href='/open_page/'+pageID;
            }
        });

    }

});

///////////////////////////////////////////////////
/////////////    SELECT NOTE   ////////////////////
///////////////////////////////////////////////////

$('.note').each(function(){
    $(this).bind('click.select', function(){
        selectNote($(this));
    });
});

function selectNote(note){

    note.css({"border-color":"green"});

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

    note.unbind('click.select');

    // SECOND CLICK
    note.bind('click.write', function(){

        $(document).unbind('keyup.delete')

        writeNote($(this));

    });

    $(document).click(function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            $(document).unbind('keyup.delete');

            note.unbind('click.write');

            note.bind('click.select', function(){
                selectNote($(this));
            });

        }
    });

}



/////////////////////////////////////////////////////
/////////////    WRITE IN NOTE   ////////////////////
/////////////////////////////////////////////////////


$('.note').each(function(){
    $(this).bind('dblclick.write', function(){
        writeNote($(this));
    });
});

function writeNote(note){

    note.unbind('click.select');
    note.unbind('dblclick.write');
    note.unbind('mousedown.drag');

    note.attr("contenteditable", "true");

    $(document).bind('click.update_content', function() {

        if (!note.is(event.target) && note.has(event.target).length === 0){

            content = note.html();

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
                selectNote($(this));
            });

            note.bind('click.write', function(){
                writeNote($(this));
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


/////////////////////////////////////////////
///////////////// RIGHT CLICK ///////////////
/////////////////////////////////////////////


$(function() {
      "use strict";
      $.contextMenu({
        selector: '.note',
        callback: function(key, options) {

          if (key === 'link') {
            console.log($(this));
            id = $(this).attr("id");
            console.log(id);

            var value = prompt("Lien", "");

            if (value != null) {
            $.ajax({
                url: '/add_link/'+pageID,
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
            name: "Create Link",
            icon: "fa-link"
          }
        }
      });
    });




