
////////////////////////////////////////////////
/////////////// BUILD IMAGE-PAGE-LINK ///////////////////
////////////////////////////////////////////////

$('.imagePageLink').each(function(){
    createImagePageLink($(this));
});

function createImagePageLink(note) {

    id = note.attr("id");

    var pageTitle = note.attr("pageTitle");

    console.log(note);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var type = XMLnote.getAttribute("type");

    note.attr("title", "go to page ".concat(pageTitle));

    note.addClass(type)

    if (XMLnote.getElementsByTagName("width")[0].childNodes[0]){
        var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
        note.css("width", width);
    }
    if (XMLnote.getElementsByTagName("height")[0].childNodes[0]){
        var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;
        note.css("height", height);
    }
    var image = XMLnote.getElementsByTagName("image")[0].childNodes[0].nodeValue;
    var src = "/static/uploads/" + image
    var img = "<img class='img_img' draggable='false' src=" + src + " />";
    var image_id = XMLnote.getElementsByTagName("image_id")[0].childNodes[0].nodeValue;
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;

    var content_div = "<div class='img_description'><div>" + content + "</div></div>"

    console.log(img, x, y);

    //console.log("print elmnt");
    //console.log(elmnt);
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.append(img)
    note.append(content_div)

}



////////////////////////////////////////////////////////////////
////////////////    SELECT IMAGE-PAGE-LINK   /////////////////////
////////////////////////////////////////////////////////////////

$('.imagePageLink').each(function(){
    $(this).bind('click.select', function(){
        selectImagePageLink($(this));
    });
});

function selectImagePageLink(note){

    console.log("selected an imageeeePageLink");

    pageLinkID= note.attr("pageID");

    note.css({"border-color":"green"});

    note.css("cursor","pointer");

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
    note.bind('click.gotopage', function(){

        window.open('/open_page/'+pageLinkID , '_blank');

    });

    note.addClass("resizable");

    note.unbind('mousedown.drag');

    note.unbind('click.select');

    $(document).click(function(){

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.unbind('click.gotopage');

            note.css("cursor","");

            note.css({"border-color":""});

            note.removeClass("resizable");

            $(document).unbind('keyup.delete');

            note.bind('click.select', function(){
                selectImagePageLink($(this));
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





/////////////////////////////////////////////////////
//////////// SAVE WIDTH AND LENGTH ON CLOSE /////////
/////////////////////////////////////////////////////


$(window).on( "unload", function(){
    save_sizes();
});

$(window).on('beforeunload', function(){
    save_sizes();
});

function save_sizes(){

    var sizes = []

    $(".image").each(function(){
        console.log($(this));
        var id = $(this).attr("id");
        console.log(id);
        var width = $(this).width()
        console.log(width);
        var height = $(this).height()
        console.log(height);
        var info = {id:id, width:width, height:height};
        sizes.push(info);
    })


    $.ajax({
        url: '/unload/'+pageID,
        type: "POST",
        data: JSON.stringify({
            data: sizes
        }),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            //window.location.href='/open_page/'+pageID;
        },
        error: function (error) {
            console.log("problem");
            //window.location.href='/open_page/'+pageID;
        }
    });

}


