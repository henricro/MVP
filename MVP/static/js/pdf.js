////////////////////////////////////////////////
/////////////// BUILD PDF ///////////////////
////////////////////////////////////////////////

$('.pdf').each(function(){
    createPDF($(this));
    console.log("create PDF");
});

function createPDF(note) {

    id = note.attr("id");

    console.log(note);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    if (XMLnote.getElementsByTagName("width")[0].childNodes[0]){
        var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
        note.css("width", width);
    }
    if (XMLnote.getElementsByTagName("height")[0].childNodes[0]){
        var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;
        note.css("height", height);
    }
    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var image = XMLnote.getElementsByTagName("image")[0].childNodes[0].nodeValue;
    var img_src = "/static/uploads/" + image
    var img = "<img class='pdf_img' draggable='false' src=" + img_src + " />";
    var pdf_id = XMLnote.getElementsByTagName("pdf_id")[0].childNodes[0].nodeValue;

    var name_div = "<div class='pdf_name'><div>" + name + "</div></div>"

    console.log(img, x, y);

    pdf_src = "/static/uploads/" + name
    note.attr("pdf",pdf_src );

    //console.log("print elmnt");
    //console.log(elmnt);
    note.css("position", "absolute");
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.append(img);
    note.append(name_div);

}





///////////////////////////////////////////////////////
////////////////    SELECT PDF   /////////////////////
///////////////////////////////////////////////////////

$('.pdf').each(function(){
    $(this).bind('click.select', function(){
        selectPDF($(this));
    });
});

function selectPDF(note){

    console.log("selected a pdf");

    note.css({"border-color":"green"});

    var pdf = note.attr("pdf");

    note.css({"cursor":"pointer"});

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

    // SECOND CLICK

    note.bind('mousedown.gotopdf', function(){

        var left  = event.pageX;
        var top   = event.pageY;
        console.log(left, top);

        $(this).bind('mouseup.gotopdf', function(){
            console.log(event.pageX, event.pageY);
            if (!(left != event.pageX || top != event.pageY)) {
                window.open(pdf, '_blank');
            }
        });

    });

    note.addClass("resizable");

    note.unbind('mousedown.drag');

    note.unbind('click.select');

    $(document).click(function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"cursor":""});

            note.unbind('mousedown.gotopdf');

            note.unbind('mouseup.gotopdf');

            note.css({"border-color":""});

            note.removeClass("resizable");

            $(document).unbind('keyup.delete');

            note.bind('click.select', function(){
                selectPDF($(this));
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



/////////////////////////////////////////////////
///////////////// RIGHT CLICK PDF ///////////////
/////////////////////////////////////////////////


$(function() {

      "use strict";

      $.contextMenu({
        selector: '.pdf div',
        callback: function(key, options) {
        var pdf = $(this).parent().attr("pdf");

           if (key === 'open') {
             console.log($(this).parent());
             console.log("open pdf");
             console.log(pdf);
             window.open(pdf, '_blank');
           }
        },

        items: {
          'open': {
            name: "Open",
            icon: "fa-book-open"
          }
        }

      });

});


