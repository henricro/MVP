////////////////////////////////////////////////
/////////// BUILD THE LISTS //////////////
////////////////////////////////////////////////

$('.list').each(function(){
    buildList($(this));
});

function buildList(note) {

    id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    var list = XMLnote.childNodes[0].nodeValue;
    console.log("list", list);

    note.append(list);

}

$(document).ready(function() {
    // Select all span elements that are direct children of li elements
    $('li > span').addClass('check');
});


////////////////////////////////////////////////
/////////// BUILD THE TO DO LISTS //////////////
////////////////////////////////////////////////

$('.to-do-list').each(function(){
    buildToDoList($(this));
});

function buildToDoList(note) {

    id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    var list = XMLnote.childNodes[0].nodeValue;
    console.log("list", list);

    note.append(list);

}




///////////////////////////////////////////////////
/////////////    SELECT LIST   ////////////////////
///////////////////////////////////////////////////

$('.list').each(function(){
    $(this).on('click.selectList', function(){
        selectList($(this));
    });
});

$('.to-do-list').each(function(){
    $(this).on('click.selectList', function(){
        selectList($(this));
    });
});


function selectList(note){

    event.stopPropagation();
    id = note.attr("id");

    // COPY THE NOTE
    $(document).on('copy', function() {
        copyNote(note);
    });

    styleSelect(note);

    // DELETE NOTE
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

    note.off('click.selectList');

    // SECOND CLICK
    note.on('click.write', function(){
        $(document).off('keyup.delete')
        writeList($(this));
    });

    $(document).on('contextmenu', function(event) {
        event.preventDefault();

        if (!note.is(event.target) && note.has(event.target).length === 0){

            $(document).off('keyup.delete');
            note.off('click.write');
            note.on('click.selectList', function(){
                selectList($(this));
            });
            $(document).off('copy');

        }
    });

    $(document).on('click.outsideNote', function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            styleDefault(note);
            $(document).off('keyup.delete');
            note.off('click.write');
            $(document).off('copy');
            note.on('click.selectNote', function(){
                selectNote($(this));
            });
            $(document).off('click.outsideNote');

        }
    });
}



/////////////////////////////////////////////////////
/////////////    WRITE IN LIST   ////////////////////
/////////////////////////////////////////////////////


$('.note').each(function(){
    $(this).on('dblclick.write', function(){
        writeList($(this));
    });
});

function writeList(note){

    note.off('click.selectList');
    note.off('dblclick.write');
    note.off('mousedown.drag');
    note.off('copy');
    note.attr("contenteditable", "true");

    $(document).on('click.update_content', function() {
        if (!note.is(event.target) && note.has(event.target).length === 0){

            content = note.html();
            $(document).off('click.update_content');
            id = note.attr('id')

            if (content == "") {
                current_y = document.documentElement.scrollTop;
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            } else {

                $.ajax({
                    url: '/update_content/' + pageID + '/' + user_id,
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
            }

            note.attr("contenteditable", "false");

            note.on('click.selectList', function() {
                selectList($(this));
            });

            note.on('dblclick.write', function(){
                writeList($(this));
            });

            note.on('mousedown.drag', function(){
                dragNote(note);
            });

        }

    });

}


// When clicking on the check-icon span inside a 'done' li, toggle its class between 'done' and 'to-do'
$(".check-icon").on("click", function() {
    console.log($(this));
    $(this).parent().toggleClass("done to-do");
});



/*
$(".to-do-list").on("keydown", function(event) {
    console.log(event.target);
    console.log("ieuheuh");
    if (event.keyCode === 13) {
        console.log("ueheuhueh");
        event.preventDefault();
        var newTask = $("<li>").addClass("to-do").append('<span class="check-icon"></span>' + "bloup");
        $(this).append(newTask);
    }
});
*/

$(".to-do-list").on("keydown", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault(); // Prevent the default behavior of the Enter key
        var newTask = $("<li>").addClass("to-do").append('<span class="check-icon"></span>' + "bloup");

        var currentLi = findFocusedLi();
        console.log(currentLi);
        if (currentLi) {
        currentLi.after(newTask);
        } else {
        // If no li is focused, add the new task at the end of the ul
        $(this).append(newTask);
        }
    }
});

var currentLi = null; // Variable to track the currently focused li element

function findFocusedLi() {

    var lis = $(".to-do-list li");
    for (var i = 0; i < lis.length; i++) {
        if ($(lis[i]).is(":focus")) {
        return $(lis[i]);
        }
    }
    return null; // If no li is focused, return null

}







