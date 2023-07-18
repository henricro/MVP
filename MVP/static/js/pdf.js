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
    var img_src = "/static/user_data/users/" + user_id + "/uploads/" + image
    var img = "<img class='pdf_img' draggable='false' src=" + img_src + " />";
    var pdf_id = XMLnote.getElementsByTagName("pdf_id")[0].childNodes[0].nodeValue;

    var name_div = "<div class='pdf_name'><div>" + name + "</div></div>"

    console.log(img, x, y);

    pdf_src = "/static/user_data/users/" + user_id + "/uploads/" + name;
    note.attr("pdf",pdf_src );

    //console.log("print elmnt");
    //console.log(elmnt);
    note.css("position", "absolute");
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.append(name_div);
    note.append(img);
    //note.append(name_div);

    if ( XMLnote.getElementsByTagName("css")[0] ){

        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;

            var style = note.attr('style'); //it will return string

            style += css;

            note.find(".pdf_img").attr('style', css);

            note.attr('style', style);

            note.attr('added_css', css);

        }

    }

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

    var pdf = note.attr("pdf");

    note.css({"border-color":"green"});
    note.css({"cursor":"pointer"});
    note.addClass("resizable");
    note.unbind('mousedown.drag');
    note.unbind('click.select');

    // delete the pdf
    $(document).bind('keyup.delete', function(){

        if (event.keyCode == 8){

            id = note.attr("id");
            console.log(id);
            console.log(event.keyCode);

            $.ajax({
                url: '/delete_note/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    id: id
                }),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    current_y = document.documentElement.scrollTop;
                    //console.log("current y :", current_y);
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    console.log("problem");
                    current_y = document.documentElement.scrollTop;
                    //console.log("current y :", current_y);
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                }
            });
        }
    });

    // SECOND CLICK on PDF
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

    $(document).click(function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"cursor":""});

            note.unbind('mousedown.gotopdf');

            note.unbind('mouseup.gotopdf');

            note.unbind('copy');

            note.css({"border-color":""});

            note.removeClass("resizable");

            $(document).unbind('keyup.delete');

            note.bind('click.select', function(){
                selectPDF($(this));
            });

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



/////////////////////////////////////////////////
///////////////// RIGHT CLICK PDF ///////////////
/////////////////////////////////////////////////


$(".pdf").bind('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    id = $(this).attr("id");
    css = $(this).attr("added_css");

    $("#pdfRCBox").css("left", new_x);
    $("#pdfRCBox").css("top", new_y);
    $("#pdfRCBox").show();

    $(document).click(function(){

        if (!$("#pdfRCBox").is(event.target) && $("#pdfRCBox").has(event.target).length === 0){

            $("#pdfRCBox").hide();

        }

    });

    //Style
    $('#pdfRC_1').bind('click', function() {
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
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                },
                error: function (error) {
                    console.log("problem");
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                }
            });

        }
    });

});


/*
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

*/
