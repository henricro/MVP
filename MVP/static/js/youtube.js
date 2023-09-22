////////////////////////////////////////////////////////
/////////////// BUILD YOUTUBE iFRAME ///////////////////
////////////////////////////////////////////////////////

$('.youtube').each(function(){
    console.log("found a youtube");
    buildYoutube($(this));
});

function buildYoutube(note) {

    id = note.attr("id");
    console.log("build youtube");

    var XMLnote = xmlDoc.getElementById(id);
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

    var youtube_link = XMLnote.getElementsByTagName("link")[0].childNodes[0].nodeValue;

    note.css("position", "absolute");
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.css("width", width.concat("px"));
    note.css("height", height.concat("px"));
    note.find('iframe').attr("src", youtube_link );
    note.find('iframe').attr('frameborder', '0');
    note.find('iframe').attr('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share')




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
////////////////    SELECT Youtube   /////////////////////
///////////////////////////////////////////////////////

$('.youtube-overlay').on('click', function() {
    // Hide the overlay to allow clicks to pass through to the iframe
    $overlay = $(this);
    $youtubeDiv = $(this).closest('.youtube');
    $overlay.hide();
    $youtubeDiv.addClass('resizable');
    $youtubeDiv.off('mousedown.drag');
    styleSelect($youtubeDiv);

    id = $youtubeDiv.attr("id");
    orWidth = $youtubeDiv.css("width");
    orHeight = $youtubeDiv.css("height");

    $(document).on('copy', function() {
        console.log("fefefefefe");
        copyNote($youtubeDiv);
    });

    // delete the pdf
    $(document).on('keyup.delete', function(){
        if (event.keyCode == 8){

            $.ajax({
                url: '/delete_note/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    id: id
                }),
                contentType: "application/json",
                success: function (data) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                }
            });
        }
    });

    $(document).on('click.outsideYoutube', function(e){
        if (!($youtubeDiv.is(e.target) || $youtubeDiv.has(e.target).length > 0)){

            id = $youtubeDiv.attr("id");
            width = $youtubeDiv.css("width");
            height = $youtubeDiv.css("height");

            if (orHeight!=height || orWidth!=width) {
                saveSizes(id, width.slice(0,-2), height.slice(0, -2));
            }

            $overlay.show();
            $youtubeDiv.removeClass('resizable');
            styleDefault($youtubeDiv);
            $youtubeDiv.on('mousedown.drag', function(event){
                dragNote($(this));
            });

            $(document).off('copy');
            $(document).off('keyup.delete');

        }
    });

});


$('.youtube').find("*").each(function() {

    $(this).on('click', function(e){
        console.log("hahaha");
        e.preventDefault();
        e.stopPropagation();
        $(this).closest(".youtube").trigger('click.selectYoutube', function(){
            selectYoutube($(this));
        });
    });

});


/*
$('.youtube iframe').each(function(){

    $(this).on('click', function(e){
        console.log("hahaha");
        e.preventDefault();
        e.stopPropagation();
        $(this).closest(".youtube").trigger('click.selectYoutube', function(){
            selectYoutube($(this));
        });
    });

});
*/

/*
$('.youtube').each(function(){

    iframe = $(this).find("iframe");
    console.log("clicked on youtube");

    iframe.on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).trigger('click.selectYoutube');
    });

    $(this).on('click.selectYoutube', function(){
        selectYoutube($(this));
    });

});
*/


function selectYoutube(note){

    console.log("hihihi");

}
/*
    id = note.attr("id");
    orWidth = note.css("width");
    orHeight = note.css("height");

    $(document).on('copy', function() {
        console.log("fefefefefe");
        copyNote(note);
    });

    console.log(id, orHeight, orWidth);

    styleSelect(note);
    note.addClass("resizable");
    note.off('mousedown.drag');
    note.off('click.selectPDF');

    // delete the pdf
    $(document).on('keyup.delete', function(){
        if (event.keyCode == 8){

            $.ajax({
                url: '/delete_note/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    id: id
                }),
                contentType: "application/json",
                success: function (data) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                }
            });
        }
    });

    // SECOND CLICK on PDF
    note.on('mousedown.gotopdf', function(){

        var left  = event.pageX;
        var top   = event.pageY;

        $(this).on('mouseup.gotopdf', function(){
            if (!(left != event.pageX || top != event.pageY)) {
                window.open(pdf, '_blank');
            }
        });

    });

    $(document).on('click.outsidePDF', function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            id = note.attr("id");
            width = note.css("width");
            height = note.css("height");

            if (orHeight!=height || orWidth!=width) {
                saveSizes(id, width.slice(0,-2), height.slice(0, -2));
            }

            styleDefault(note);

            note.off('mousedown.gotopdf');
            note.off('mouseup.gotopdf');
            $(document).off('copy');
            note.removeClass("resizable");
            $(document).off('keyup.delete');
            $(document).off('click.outsidePDF');

            note.on('click.selectPDF', function(){
                selectPDF($(this));
            });

            note.on('mousedown.drag', function(){

                mouseX = event.pageX;
                mouseY = event.pageY;
                noteX = parseInt(note.css("left").slice(0, -2));
                noteY = parseInt(note.css("top").slice(0, -2));
                dragNote(note, noteX, noteY);

            });
        }
    });
}
*/
