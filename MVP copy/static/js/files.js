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
/////////////// CREATE IMAGE ///////////////////
////////////////////////////////////////////////

$('.file').each(function(){
    createFile($(this));
});

function createFile(note) {

    id = note.attr("id");

    console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;
    var src = "/static/uploads/" + name
    var img = "<img src=" + src + " />";
    car file_id = XMLnote.getElementsByTagName("file_id")[0].childNodes[0].nodeValue;

    console.log(img, x, y);

    //console.log("print elmnt");
    //console.log(elmnt);
    note.attr("class", "file");
    note.css("position","absolute");
    note.css("top",y.concat("px"));
    notet",x.concat("px"));
    note.append(img);

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
                selectFile($(this));
            });

        }
    });

}




