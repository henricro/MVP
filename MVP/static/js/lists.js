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
    var list = XMLnote.childNodes[0].nodeValue;

    //console.log("list", list);

    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
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

    tdl_div.append(tdl_list);

    plus = $('<i>').addClass("plus-to-do");
    tdl_div.append(plus);


    tdl_list.find("li").each(function(){
        icon = $("<i>").addClass("icon");
        console.log(icon);
        console.log($(this));
        $(this).append(icon);
    });

    //console.log(length_li);
    //console.log(list, x, y);
    //console.log(tdl_list);

}

$(".plus-to-do").on('click', function() {
    li = $('<li>').addClass("to-do").append("do this");
    icon = $("<i>").addClass("icon");
    li.append(icon);
    console.log($(this));
    ul = $(this).parent().find('ul');
    console.log(ul);
    ul.append(li);
    console.log(li);
});


$('.icon').on('click', function() {
    $(this).parent().toggleClass("done to-do");
});




///////////////////////////////////////////////////
/////////////    SELECT LIST   ////////////////////
///////////////////////////////////////////////////

$('.list').each(function(){
    $(this).on('click.selectList', function(){
        selectList($(this));
    });
});


function selectList(list){

    list.off('click.selectList');
    event.stopPropagation();
    id = list.attr("id");

    $(document).on('click.outsideList', function(){
        if (!list.is(event.target) && list.has(event.target).length === 0){

            styleDefault(list);
            $(document).off('keyup.delete');
            list.off('click.write');
            $(document).off('copy');
            list.on('click.selectList', function(){
                selectList($(this));
            });
        }
    });

    styleSelect(list);

    // COPY THE NOTE
    $(document).on('copy', function() {
        copyNote(list);
    });

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

    // SECOND CLICK
    list.on('click.write', function(){
        $(document).off('keyup.delete');
        writeList($(this));
    });

}


/////////////////////////////////////////////////////
/////////////    WRITE IN LIST   ////////////////////
/////////////////////////////////////////////////////


$('.list').each(function(){
    $(this).on('dblclick.write', function(){
        writeList($(this));
    });
});

function writeList(list){

    list.off('mousedown.drag');
    list.off('copy');
    list.attr("contenteditable", "true");

    $(document).on('click.update_content', function() {
        if (!list.is(event.target) && !list.has(event.target).length > 0){

            content = note.html();
            //console.log(content);
            $(document).off('click.update_list');
            id = list.attr('id')

            if (content == "") {
                current_y = document.documentElement.scrollTop;
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            } else {
                $.ajax({
                    url: '/update_list/' + pageID + '/' + user_id,
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

            list.attr("contenteditable", "false");
            list.on('click.selectList', function() {
                selectList($(this));
            });
            list.on('mousedown.drag', function(){
                dragNote(list);
            });

        }
    });
}











$('.to-do-list').each(function(){
    $(this).on('click.selectList', function(){
        selectToDoList($(this));
    });
});

function selectToDoList(note){

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
        writeToDoList($(this));
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

            content = note.find('ul').html();
            content = content.replace(/<i\s*class="icon"><\/i>/g, '');
            $(document).off('click.update_content');
            id = note.attr('id');

            if (content == "") {
                current_y = document.documentElement.scrollTop;
                //window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
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





$('.to-do-list').each(function(){
    $(this).on('dblclick.write', function(){
        writeToDoList($(this));
    });
});

function writeToDoList(note){

    note.off('click.selectList');
    note.off('dblclick.write');
    note.off('mousedown.drag');
    note.off('copy');
    note.attr("contenteditable", "true");

    $(document).on('click.update_content', function() {
        if (!note.is(event.target) && note.has(event.target).length === 0){

            content = note.find('ul').html();
            console.log("to do list content");
            console.log(content);
            content = content.replace(/<i\s*class="icon"><\/i>/g, '');
            console.log(content);
            $(document).off('click.update_content');
            id = note.attr('id');

            if (content == "") {
                current_y = document.documentElement.scrollTop;
                //window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
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




