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
    id = list.attr("id");

    $(document).on('click.outsideList', function(){
        if (!list.is(event.target) && !list.has(event.target).length > 0){
            console.log("iejijeije")
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



function writeList(list){

    list.off('mousedown.drag');
    list.off('copy');
    list.attr("contenteditable", "true");

    $(document).on('click.update_list', function() {
        if (!list.is(event.target) && !list.has(event.target).length > 0){

            content = note.html();
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






