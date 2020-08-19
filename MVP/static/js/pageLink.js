////////////////////////////////////////////////
/////////// BUILD THE PAGE LINKS //////////////
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

    //console.log("print elmnt");
    //console.log(elmnt);
    note.css("top",y.concat("px"));
    note.css("left",x.concat("px"));
    note.attr("title", "go to page ".concat(pageTitle));
    note.html(content);

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


///////////////////////////////////////////////
/////////   CREATE A NEW PAGE  ///////////////
/////////////////////////////////////////////

$(document).bind('contextmenu', function(event) {

    event.preventDefault();

    console.log("happy go lucky");

    new_x = event.pageX
    new_y = event.pageY

    console.log(x, y);

    $("#pageRCBox").css("left", new_x);
    $("#pageRCBox").css("top", new_y);
    $("#pageRCBox").show();

    $(document).click(function(){

        if (!$("#pageRCBox").is(event.target) && $("#pageRCBox").has(event.target).length === 0){

            $("#pageRCBox").hide();

        }

    });

    $('.choiceLOrange').bind('click', function() {
        var title = prompt("Name", "");

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
    });


});


/*
$(document).bind('contextmenu', function(event) {

    console.log("go fuck yourselves");

    x= event.pageX
    y=event.pageY

    console.log(x, y);

    //$("#pageRCBox").css("left", x.concat("px"));
    //$("#pageRCBox").css("left", x.concat("px"));
    $("#pageRCBox").show();//Right click!<


});


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
        },
        items: {
          'newPage': {
            name: "New Page",
            icon: "fa-plus-circle"
          }
        }
      });
    });


*/

///////////////////////////////////////////////////////
/////////////    SELECT PAGELINK   ////////////////////
///////////////////////////////////////////////////////

$('.pageLink').each(function(){
    $(this).bind('click.select', function(){
        selectPageLink($(this));
    });
});

function selectPageLink(note){

    // COPY THE NOTE
    note.bind('copy', function() {
        copyNote(note);
    });

    console.log("selected page link");

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

            note.unbind('copy');

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

           if (key === 'copy') {
             copyNote($(this));
           }
           else if (key === 'edit') {

                note = $(this);

                $(document).bind('click.writePageLink', function() {

                    writePageLink(note);

                });

           }
           else if (key === "image"){

              id = $(this).attr("id")  ;
              console.log(id);
              //console.log(id);
              modalPageLink.show();
              modalPageLink.find('.drop-area').attr("pageLink_id", id);
              //console.log(modal);

              // When the user clicks anywhere outside of the modal, close it
              $(document).bind('click.first' , function() {
                $(document).bind('click.second' , function() {

                    if (event.target.classList.contains('drop-area')) {
                      console.log('clicked the drop area');
                    }
                    else {
                        modalPageLink.hide();
                        $(document).unbind('click.first');
                        $(document).unbind('click.second');
                    }

                });
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
          'edit': {
            name: "Edit",
            icon: "fa-edit"
          },
          'copy': {
            name: "Copy",
            icon: "fa-copy"
          },
          'image': {
            name: "Add Image",
            icon: "fa-images"
          },
          'style': {
            name : "Style",
            icon : "fa-paint-brush"
          }
        }

      });

});


/////////////////////////////////////////////////////////
/////////////    WRITE IN PAGELINK   ////////////////////
/////////////////////////////////////////////////////////


function writePageLink(note){

    console.log(note);

    console.log("write in page link");

    note.unbind('mousedown.drag');

    note.unbind('click.select');

    $(document).unbind('click.writePageLink');

    note.attr("contenteditable", "true");

    $(document).bind('click.clickout', function() {

        if (!note.is(event.target) && note.has(event.target).length === 0){

            $(document).unbind('click.clickout');

            console.log("click out of pageLink");

            note.bind('click.select', function(){
                selectPageLink($(this));
            });

            content = note.html();

            console.log(content);

            id = note.attr('id');

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

