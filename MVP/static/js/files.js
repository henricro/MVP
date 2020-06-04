//////////////////////////////////////////
/////////////  DROP IMAGES ///////////////
//////////////////////////////////////////

$('*:not("div")').on(
    'dragover',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$('*:not("div")').on(
    'dragenter',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$('*:not("div")').on(
    'drop',
    function(e){
        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                /*UPLOAD FILES HERE*/

                file = e.originalEvent.dataTransfer.files[0];
                x = e.pageX;
                y = e.pageY;
                console.log("hehehehehehehehehhehe");
                console.log(file);

                var form_data = new FormData();
                form_data.append('file', file);
                form_data.append('x', x);
                form_data.append('y', y);

                $.ajax({
                    type: 'POST',
                    url:  '/upload_file/'+pageID,
                    data: form_data,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function (data) {
                        console.log("success");
                        window.location.href='/open_page/'+pageID;
                    },
                    error: function (error) {
                        console.log("problem");
                        window.location.href='/open_page/'+pageID;
                    }
                });

            }
        }
    }
);


////////////////////////////////////////////////
/////////////// BUILD IMAGE ///////////////////
////////////////////////////////////////////////

$('.file').each(function(){
    createFile($(this));
});

function createFile(note) {

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
        note.css("width", width);
    }
    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var src = "/static/uploads/" + name
    var img = "<img style='width:100%; height:100%;' draggable='false' src=" + src + " />";
    var file_id = XMLnote.getElementsByTagName("file_id")[0].childNodes[0].nodeValue;

    console.log(img, x, y);

    //console.log("print elmnt");
    //console.log(elmnt);
    note.css("position", "absolute");
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.append(img)

}


///////////////////////////////////////////////////////
////////////////    SELECT FILE   /////////////////////
///////////////////////////////////////////////////////

$('.file').each(function(){
    $(this).bind('click.select', function(){
        selectFile($(this));
    });
});

function selectFile(note){

    console.log("select file");

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

    note.addClass("resizable");

    note.unbind('mousedown.drag');

    note.unbind('click.select');

    $(document).click(function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            note.removeClass("resizable");

            $(document).unbind('keyup.delete');

            note.bind('click.select', function(){
                selectFile($(this));
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

    $(".file").each(function(){
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


