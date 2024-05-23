
$("#version_history").hide();

$("#version_history_button").on('click', function() {
    console.log("hehehe");
    $("#version_history").toggle();
});

$("#patreon").on('click', function(){
    window.open("https://www.patreon.com/gyst", '_blank');
})

$("#youtube").on('click', function(){
    window.open("https://www.youtube.com/channel/UCvCvw1x4w9WOn_5f9R9QoYQ", '_blank');
})

$(document).click(function(){
    if (!$("#version_history").is(event.target) && $("#version_history").has(event.target).length === 0 && !$("#version_history_button").is(event.target)){
        $("#version_history").hide();
    }
});


/*   imagePageLinks   */



//////////////////////////////////////////////////////////////////
////////////////    SELECT IMAGE-PAGE-LINK   /////////////////////
//////////////////////////////////////////////////////////////////

$('.imagePageLink').each(function(){
    $(this).on('click.selectImagePageLink', function(){
        selectImagePageLink($(this));
    });
});

function selectImagePageLink(note){

    event.stopPropagation();
    note.off('click.selectImagePageLink');

    orWidth = note.css("width");
    orHeight = note.css("height");

    // style the element when clicked on
    styleSelect(note);

    note.addClass("resizable");
    note.off('mousedown.drag');
    note.off('click.selectImagePageLink');

    $(document).on('click.outsideImagePageLink', function(){
        if (!note.is(event.target) && !note.has(event.target).length > 0){

            ////console.log("clicked oustide imagePageLink");

            event.stopPropagation();
            $(document).off('click.outsideImagePageLink');
            id = note.attr("id");
            width = note.css("width");
            height = note.css("height");

            ////console.log(id, width, height, orWidth, orHeight)

            note.removeClass("resizable");
            styleDefault(note);
            note.off('mousedown.gotopage');
            note.off('mouseup.gotopage');
            $(document).off('copy');
            $(document).off('keyup.delete');

            note.on('click.selectImagePageLink', function(){
                selectImagePageLink($(this));
            });
            note.bind('mousedown.drag', function(event){
                dragNote(note);
            });

        }
    });
}



///////////////////////////////////////////////////////
////////////////    SELECT PDF   /////////////////////
///////////////////////////////////////////////////////

$('.pdf').each(function(){
    $(this).on('click.selectPDF', function(){
        selectPDF($(this));
    });
});

function selectPDF(note){

    orWidth = note.css("width");
    orHeight = note.css("height");

    var pdf = note.attr("pdf");

    styleSelect(note);
    note.addClass("resizable");
    note.off('mousedown.drag');
    note.off('click.selectPDF');

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


