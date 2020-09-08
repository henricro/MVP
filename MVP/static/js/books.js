////////////////////////////////////////////////
/////////// BUILD THE BOOK LINKS //////////////
////////////////////////////////////////////////


$('.pageLink').each(function(){
    createPageLink($(this));
});

function createPageLink(note) {

    var id = note.attr("id");

    var pageTitle = note.attr("pageTitle");

    console.log("pagetitle");
    console.log(id,pageTitle);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var type = XMLnote.getAttribute("type");

    //console.log("print elmnt");
    //console.log(elmnt);
    note.addClass(type)
    note.css("position","absolute");
    note.css("top",y.concat("px"));
    notet",x.concat("px"));
    note.attr("title", "go to page ".concat(pageTitle));
    note.html(content);

}


///////////////////////////////////////////////
/////////   CREATE A NEW BOOK  ///////////////
/////////////////////////////////////////////

$(function() {
      "use strict";
      $.contextMenu({
        selector: '*:not("div")',
        callback: function(key, options) {

          if (key === 'newPage') {

            console.log(event.pageX, event.pageY);

            var new_x = event.pageX;
            var new_y = event.pageY;

            // CREATE A NEW XML FILE WITH A TITLE ENTERED IN PROMPT
            // ALSO CREATE A PAGE LINK ON THE RUNNING XML

            var title = prompt("Nom", "");

            $.ajax({
                url: '/new_page/'+pageID,
                type: "POST",
                data: JSON.stringify({
                    new_x : new_x,
                    new_y : new_y,
                    title : title
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
          else if (key === 'newBook') {

            console.log(event.pageX, event.pageY);

            var new_x = event.pageX;
            var new_y = event.pageY;

            // CREATE A NEW XML FILE WITH A TITLE ENTERED IN PROMPT
            // ALSO CREATE A PAGE LINK ON THE RUNNING XML

            var title = prompt("Nom", "");

            $.ajax({
                url: '/new_book/'+pageID,
                type: "POST",
                data: JSON.stringify({
                    new_x : new_x,
                    new_y : new_y,
                    title : title
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
        },
        items: {
          'newPage': {
            name: "New Page",
            icon: "fa-plus-circle"
          },
          'newBook': {
            name: "New Book",
            icon: "fa-book"
          }
        }
      });
    });




///////////////////////////////////////////////////////
/////////////    SELECT PAGELINK   ////////////////////
///////////////////////////////////////////////////////

$('.pageLink').each(function(){
    $(this).bind('click.select', function(){
        selectPageLink($(this));
    });
});

function selectPageLink(note){

    console.log("select page link");

    note.css({"border-color":"green"});

    pageLinkID= note.attr("pageID");

    console.log(pageID);

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
    note.bind('click.gotopage', function(){

        $(document).unbind('keyup.delete');

        window.open('/open_page/'+pageLinkID , '_blank');

    });

    $(document).click(function(){

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            note.css({"cursor":""});

            $(document).unbind('keyup.delete');

            note.unbind('click.gotopage');

            note.bind('click.select', function(){
                selectPageLink($(this));
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
        selector: '.pageLink',
        callback: function(key, options) {

           if (key === 'edit') {
             writePageLink($(this));
           }
        },

        items: {
          'edit': {
            name: "Edit",
            icon: "fa-edit"
          }
        }

      });

});


/////////////////////////////////////////////////////////
/////////////    WRITE IN PAGELINK   ////////////////////
/////////////////////////////////////////////////////////


function writePageLink(note){

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
                        url: '/update_content',
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

                        noteX = $(this)t");
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

    });

}

