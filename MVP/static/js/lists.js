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



////////////////////////////////////////////////
/////////// BUILD THE TO DO LISTS //////////////
////////////////////////////////////////////////

$('.to-do-list').each(function(){
    buildToDoList($(this));
});

function buildToDoList(tdl_div) {

    id = tdl_div.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var list = XMLnote.childNodes[0].nodeValue;

    tdl_div.css("top", y.concat("px"));
    tdl_div.css("left", x.concat("px"));

    var tdl_list = $('<ul>').addClass('to-do-list-list').append(list);
    var length_li = tdl_list.find("li").length;

    console.log(tdl_list);
    console.log("nb elements in list", length_li);

    tdl_div.append(tdl_list);

    // for each li in a to-do-list,

    // build an icon element to put on the body
    // give it it's position based on the li
    // give it the same class as li
    // make it so that if the li is removed from dom, so is the icon


    //get the list as <li class='done'>uhfz</li><li class='to-do'>diuhdz</li>
    //get the nb of elements in list
    //give the <li>s ids
    //for each id build an icon with that id and same class as li
    //for each icon go and place it to the right of the li with same id
/*
    for (var i = 0; i < length_li; i++){

        tdl_list.find("li").eq(i).attr("id", i.toString());
        li_class = tdl_list.find("li").eq(i).attr("class");
        icon =$('<i>').addClass("icon").addClass(li_class).attr("id", i.toString());
        console.log(icon);
        checks.append(icon);

    }

    $(".icon").each(function(){
        icon = $(this);
        id = icon.attr("id");
        li = icon.parent().parent().find('li#' + id);
        icon.on('click', function() {
            li.toggleClass("done to-do");
            $(this).toggleClass("done to-do");
        });
    });
*/
    console.log(length_li);
    console.log(list, x, y);
    console.log(tdl_list);
    //console.log(checks);

}

function generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }
    return result;
}

console.log("ECMAScript version: " + new Date().toDateString());


// for each line in a to-do list
$(".to-do-list-list li").each(function(){

    // generate an id for that line
    li =$(this);
    id =generateRandomString(4);
    li.attr("id", id);

    //create an icon, give it the same id
    icon = $('i').addClass()

});


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

/*
// When clicking on the check-icon span inside a 'done' li, toggle its class between 'done' and 'to-do'
$(".icon").on("click", function() {
    console.log($(this));
    $(this).parent().toggleClass("done to-do");
});
*/


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
/*
$(document).on("click", ".to-do-list", function() {
      var cursorPosition = getCursorPosition();
      console.log("Current Cursor Position:", cursorPosition);
    });

function getCursorPosition() {
      var selection = document.getSelection();
      if (selection.rangeCount > 0) {
        var range = selection.getRangeAt(0);
        var currentNode = range.commonAncestorContainer;
        var listElement = $(currentNode).closest("li");
        var cursorPosition = listElement.index() + 1;
        return cursorPosition;
      }
      return null;
    }


$(".to-do-list").on("keydown", function(event) {
    if (event.keyCode === 13) {
        console.log("gdddkkooouuieheue");
        event.preventDefault(); // Prevent the default behavior of the Enter key
        var newTask = $("<li>").addClass("to-do");
        var icon = $("<li>").addClass("icon");
        var text = "hhygguue";
        newTask.append(icon).append(text);
        console.log(newTask);

        var cursorPosition = getCursorPosition();
        if (cursorPosition !== null) {
            console.log($(this));
            var listItems = $(this).find('li');
            console.log(listItems);
            console.log("here", cursorPosition, listItems.length);
            if (cursorPosition <= listItems.length) {
                console.log("inferior");
                console.log(cursorPosition, typeof(cursorPosition));
                current_list_item = listItems.eq(cursorPosition);
                console.log(current_list_item);
                current_list_item.after(newTask);
            } else {
              $(".to-do-list").append(newTask);
            }
        }

        console.log(newTask);
        $(this).append(newTask);
        // Set focus on the new task and select its contents

        newTask.focus().select();
    }
});

*/




$(".myDiv").on("click", function(e) {
    // Calculate the click position within .myDiv
    var clickX = e.clientX - $(this).offset().left;
    var clickY = e.clientY - $(this).offset().top;

    // Define the range for the spot
    var spotStartX = $(this).width() - 30; // Adjust as needed
    var spotEndX = $(this).width() - 10;   // Adjust as needed
    var spotStartY = 0;
    var spotEndY = $(this).height();

    // Check if the click is within the spot range
    if (clickX >= spotStartX && clickX <= spotEndX && clickY >= spotStartY && clickY <= spotEndY) {
        // Code to run when the spot is clicked
        alert("Spot clicked!");
    }
});




