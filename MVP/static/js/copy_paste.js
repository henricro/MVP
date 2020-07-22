function copyNote(){

    console.log("copied a note");
    id = note.attr("id");
    info = "paste_note, " + pageID + ", "  + id;
    console.log(info);
    $('#myClipboard').show().attr("value", info);
    $('#myClipboard').select();
    document.execCommand("copy");
    $('#myClipboard').hide();

}


$(document).bind('paste', function(e) {

    var data = e.originalEvent.clipboardData.getData('Text');
    //IE9 Equivalent ==> window.clipboardData.getData("Text");

    if (data.includes("paste_note")) {

        data = data.split(", ")

        console.log("pasted a note");

        console.log(data);

        originPageID = data[1];
        note_id = data[2];

        console.log(originPageID, note_id);

        if( $('#mouse_position').find('#x_pos').html() ){
            x = $('#mouse_position').find('#x_pos').html();
            y = $('#mouse_position').find('#y_pos').html();
        } else {
            x = null;
            y = null;
        }

        console.log("last x and y");
        console.log(x, y);

        $.ajax({
            url: '/paste_note/' + pageID,
            type: "POST",

            data: JSON.stringify({
                originPageID : originPageID,
                note_id : note_id,
                x : x,
                y : y
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

    } else {
        console.log("is not array");
    }

});