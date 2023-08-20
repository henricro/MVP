function copyText(note){

    id = note.attr("id");
    noteClass = note.attr("class");
    info = "yoloooo";
    $('#myClipboard').show().attr("value", info);
    $('#myClipboard').select();
    $(document).execCommand("copy");
    $('#myClipboard').hide();

}



function copyNote(note){

    console.log("function copyNote");
    id = note.attr("id");
    noteClass = note.attr("class");
    info = "paste_note, " + pageID + ", "  + id + ", "  + noteClass;
    $('#myClipboard').show().attr("value", info);
    $('#myClipboard').select();
    $(document).execCommand("copy");
    $('#myClipboard').hide();

}

function copyToClipboard(text) {
    var tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = text;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
}



function copySelection(selection){

    console.log(selection);
    console.log("copy selection");
    yolk = "paste_selection; " + pageID + "; " + selection ;
    console.log(yolk);
    $('#myClipboard').show().attr("value", yolk);
    $('#myClipboard').select();
    $(document).execCommand("copy");
    $('#myClipboard').hide();

}


$(document).on('paste', function(e) {

    var data = e.originalEvent.clipboardData.getData('Text');
    var items = e.originalEvent.clipboardData.items;

    for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          var file = items[i].getAsFile();
          var reader = new FileReader();

          reader.onload = function(event) {
            var imageData = event.target.result;
            // Process the image data here
            console.log(imageData);
          };

          reader.readAsDataURL(file);
          break;
        }
    }

    if (e.originalEvent.clipboardData.files.length > 0) {
        console.log("pasted a file");
        pastedFile = e.originalEvent.clipboardData.files[0];
        if (pastedFile.type.startsWith("image/")) {
            console.log("file is an image");

            var form_data = new FormData();
            form_data.append('file', pastedFile);
            form_data.append('x', x);
            form_data.append('y', y);

            if( $('#mouse_position').find('#x_pos').html() ){
                x = $('#mouse_position').find('#x_pos').html();
                y = $('#mouse_position').find('#y_pos').html();
            } else {
                x = "300";
                y = "300";
            }

            $.ajax({
                type: 'POST',
                url:  '/upload_image/' + pageID + '/' + user_id,
                data: form_data,
                contentType: false,
                cache: false,
                processData: false,
                success: function (data) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href= '/open_page/' + pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    current_y = document.documentElement.scrollTop;
                    window.location.href= '/open_page/' + pageID + '/' + user_id + '/' + current_y;
                }
            });

        } else {

        }
    }

    if (data.includes("paste_note")) {

        data = data.split(", ")

        originPageID = data[1];
        note_id = data[2];
        noteClass = data[3];

        pasteNote(note_id, noteClass, originPageID, pageID);

    } else if (data.includes("paste_selection")) {

        data = data.split("; ")

        originPageID = data[1];
        selection = data[2];

        pasteSelection(selection, originPageID, pageID);

    } else if (data.includes("youtube.com/")  || data.includes("youtu.be") ) {

        if( $('#mouse_position').find('#x_pos').html() ){
            x = $('#mouse_position').find('#x_pos').html();
            y = $('#mouse_position').find('#y_pos').html();
        } else {
            x = "500";
            y = "500";
        }

        console.log("pasted youtube video");
        console.log(data);

        $.ajax({
            url: '/youtube/' + pageID + '/' + user_id,
            type: "POST",
            data: JSON.stringify({
                data: data,
                x : x,
                y : y
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

    } else if (data.includes("https://")  || data.includes("http://") ) {

        if( $('#mouse_position').find('#x_pos').html() ){
            x = $('#mouse_position').find('#x_pos').html();
            y = $('#mouse_position').find('#y_pos').html();
        } else {
            x = "500";
            y = "500";
        }

        $.ajax({
            url: '/paste_note_link/' + pageID + '/' + user_id,
            type: "POST",
            data: JSON.stringify({
                data : data,
                x : x ,
                y : y
            }),
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                current_y = document.documentElement.scrollTop;
                //console.log("current y :", current_y);
                window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
            },
            error: function (error) {
                console.log("problem");
                current_y = document.documentElement.scrollTop;
                //console.log("current y :", current_y);
                window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;

            }
        });

    }

});


function pasteNote(note_id, noteClass, originPageID, pageID) {

    if( $('#mouse_position').find('#x_pos').html() ){
        x = $('#mouse_position').find('#x_pos').html();
        y = $('#mouse_position').find('#y_pos').html();
    } else {
        x = "300";
        y = "300";
    }

    console.log("paste note")

    $.ajax({

        url: '/paste_note/' + pageID + '/' + user_id,
        type: "POST",

        data: JSON.stringify({
            note_class : noteClass,
            originPageID : originPageID,
            note_id : note_id,
            x : x,
            y : y
        }),
        contentType: "application/json",
        success: function (data) {
            current_y = document.documentElement.scrollTop;
            window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
        },
        error: function (error) {
            current_y = document.documentElement.scrollTop;
            window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
        }
    });

}


function pasteSelection(selection, originPageID, pageID) {

        $.ajax({
            url: '/paste_selection/' + pageID + '/' + user_id,
            type: "POST",

            data: JSON.stringify({
                originPageID : originPageID,
                selection: selection,
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

