//////////////////////////////////////////////////
///////////// BUILD THE CATEGORIES ///////////////
//////////////////////////////////////////////////

$('.category').each(function(){
    createCategory($(this));
});

function createCategory(note) {

    id = note.attr("id");

    console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);

    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    var criteria_id = XMLnote.getAttribute("criteria_id");

    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.attr("criteria_id", criteria_id)

    note.append(name);

    if ( XMLnote.getElementsByTagName("css")[0] ){

        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;

            note.attr('style', css);

            note.attr('added_css', css);

        }

    }

    var criteriaNote = $('#'+criteria_id);
    var critCat = criteriaNote.find('.criteria_categories').find('.categories');

    critCat.append(note);

}



///////////////////////////////
///////  /////////
///////////////////////////////

$('.criteria_categories').bind('click.editCat', function() {

    console.log("clicked on catgory space");

    $(this).parent().unbind('mousedown.drag');

    $(this).bind('mousedown.drag', function(){
        note = $(this);
        mouseX = event.pageX;
        mouseY = event.pageY;
        noteX = parseInt(note.css("left").slice(0, -2));
        noteY = parseInt(note.css("top").slice(0, -2));
        dragNote(note, noteX, noteY);
    });

    $(this).bind('click.resize', function() {
        resize($(this));
        $(this).unbind('mousedown.drag');
        $(this).bind('click.move', function() {
        move($(this));
        });
    });

    function resize(note){
        note.css("border", "1px solid green");
        note.addClass('resizable');
    }

    function move(note){
        note.removeClass('resizable');
        note.css("border", "1px dashed green");
        note.bind('mousedown.drag', function(){
            mouseX = event.pageX;
            mouseY = event.pageY;
            noteX = parseInt(note.css("left").slice(0, -2));
            noteY = parseInt(note.css("top").slice(0, -2));
            dragNote(note, noteX, noteY);
        });
        note.bind('click.resize', function(){
            resize(note);
        });
    }

});


/*

    $(document).bind('click.hideParents', function(){
        $(document).bind('click.hideParents2', function(){

            console.log(event.target.classList);

            // if click outside of parent space
            if (!$("#title_parents").is(event.target) && $("#title_parents").has(event.target).length === 0){
                console.log(event.target);
                console.log("clicked outside of parent space");
                $("#title_parents").hide();

                $(document).unbind('click.hideParents2');
                $(document).unbind('click.hideParents');

                $("#title_parents").removeClass('resizable');

                $("#title_title").bind('click.select', function(){
                    selectTitle($(this));
                });

                $("#title").bind('mousedown.drag', function(){

                    note= $(this);

                    mouseX = event.pageX;
                    mouseY = event.pageY;

                    noteX = parseInt(note.css("left").slice(0, -2));
                    noteY = parseInt(note.css("top").slice(0, -2));

                    dragNote(note, noteX, noteY);

                });

            // if click in parent space
            } else {

                console.log("clicked in parent space");
                console.log(event.target);
            }
        });
    });

}



*/







