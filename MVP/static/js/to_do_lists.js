
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

    // for each <li> add an <i class='icon'> inside
    tdl_list.find("li").each(function(){
        icon = $("<i>").addClass("icon");
        $(this).append(icon);
    });

    // plus sign to add lines
    plus = $('<i>').addClass("plus-to-do");
    tdl_div.append(plus);

}

// add to-do when click on + sign
$(".plus-to-do").on('click', function() {
    li = $('<li>').addClass("to-do").append("do this");
    icon = $("<i>").addClass("icon");
    li.append(icon);
    ul = $(this).parent().find('ul');
    ul.append(li);
});

// change status when click on icon
$('.icon').on('click', function() {
    $(this).parent().toggleClass("done to-do");
});



$('.to-do-list').each(function(){
    $(this).on('click.selectToDoList', function(){
        selectToDoList($(this));
    });
});

function selectToDoList(list){

    list.off('click.selectToDoList');
    id = list.attr("id");

    $(document).on('click.outsideList', function(){
        if (!list.is(event.target) && !list.has(event.target).length > 0){

            styleDefault(list);
            $(document).off('keyup.delete');
            list.off('click.write');
            $(document).off('copy');
            list.on('click.selectToDoList', function(){
                selectToDoList($(this));
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
        writeToDoList($(this));
    });

}

/////////////////////////////////////////////////////
/////////////    WRITE IN TO-DO-LIST   ////////////////////
/////////////////////////////////////////////////////


function writeToDoList(list){

    list.on('keydown', function(event) {
        if (event.keyCode === 13) { // 13 is the keycode for the "Enter" key
            event.preventDefault(); // Prevent the form from being submitted
        }
    });

    list.off('mousedown.drag');
    list.off('copy');
    list.attr("contenteditable", "true");

    $(document).on('click.update_to_do_list', function() {
        if (!list.is(event.target) && !list.has(event.target).length > 0){

            content = note.find('ul').html();
            content = content.replace(/<i\s*class="icon"><\/i>/g, '');
            $(document).off('click.update_to_do_list');
            id = list.attr('id')

            if (content == "") {
                current_y = document.documentElement.scrollTop;
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            } else {
                $.ajax({
                    url: '/update_to_do_list/' + pageID + '/' + user_id,
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
            list.on('click.selectToDoList', function() {
                selectList($(this));
            });
            list.on('mousedown.drag', function(){
                dragNote(list);
            });

        }
    });
}

