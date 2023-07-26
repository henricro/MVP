function copyText(note){

    //console.log("copied a note");
    //console.log(note);
    id = note.attr("id");
    noteClass = note.attr("class");
    info = "yoloooo";
    //console.log(info);
    $('#myClipboard').show().attr("value", info);
    $('#myClipboard').select();
    $(document).execCommand("copy");
    $('#myClipboard').hide();

}

// bind a copy-note function to every note on the page
$(".note, .pageLink, .noteLink, .image, .pdf, .imagePageLink, .imageLink, .criteria, .category, iframe").each(function(){

    note = $(this);
    note.bind('copy', function() {
        copyNote(note);
    });

});


function copyNote(note){

    //console.log("copied a note");
    //console.log(note);
    id = note.attr("id");
    noteClass = note.attr("class");
    info = "paste_note, " + pageID + ", "  + id + ", "  + noteClass;
    //console.log(info);
    $('#myClipboard').show().attr("value", info);
    $('#myClipboard').select();
    $(document).execCommand("copy");
    $('#myClipboard').hide();

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


$(document).bind('paste', function(e) {

    var data = e.originalEvent.clipboardData.getData('Text');
    //var data = e.originalEvent.clipboardData;
    //IE9 Equivalent ==> window.clipboardData.getData("Text");

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

    console.log("data");
    console.log(data);

    if (data.includes("paste_note")) {

        data = data.split(", ")

        //console.log("pasted a note");

        originPageID = data[1];
        note_id = data[2];
        noteClass = data[3];

        pasteNote(note_id, noteClass, originPageID, pageID);

    } else if (data.includes("paste_selection")) {

        //console.log(data);

        data = data.split("; ")

        //console.log(data);
        //console.log("pasted a seleciton");

        originPageID = data[1];
        selection = data[2];

        //console.log(selection);

        pasteSelection(selection, originPageID, pageID);

    } else if (data.includes("youtube.com/")  || data.includes("youtu.be") ) {

        if( $('#mouse_position').find('#x_pos').html() ){
            x = $('#mouse_position').find('#x_pos').html();
            y = $('#mouse_position').find('#y_pos').html();
        } else {
            x = "500";
            y = "500";
        }

        //console.log("pasted youtube video");
        //console.log(data);

        $.ajax({
            url: '/youtube/'+pageID + '/' + user_id,
            type: "POST",
            data: JSON.stringify({
                data: data,
                x : x,
                y : y
            }),
            contentType: "application/json",
            success: function (data) {
                //console.log(data);
                current_y = document.documentElement.scrollTop;
                console.log("current y :", current_y);
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            },
            error: function (error) {
                //console.log("problem");
                current_y = document.documentElement.scrollTop;
                console.log("current y :", current_y);
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

        //console.log(originPageID, note_id, noteClass);

        if( $('#mouse_position').find('#x_pos').html() ){
            x = $('#mouse_position').find('#x_pos').html();
            y = $('#mouse_position').find('#y_pos').html();
        } else {
            x = "300";
            y = "300";
        }

        //console.log("last x and y");
        //console.log(x, y, noteClass);
        //console.log(typeof noteClass);

        if (noteClass.includes("pageLink")){

                $.ajax({
                    url: '/paste_pageLink/' + pageID + '/' + user_id,
                    type: "POST",

                    data: JSON.stringify({
                        originPageID : originPageID,
                        note_id : note_id,
                        x : x,
                        y : y,
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        //console.log(data);
                        current_y = document.documentElement.scrollTop;
                        console.log("current y :", current_y);
                        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                    },
                    error: function (error) {
                        //console.log("problem");
                        current_y = document.documentElement.scrollTop;
                        console.log("current y :", current_y);
                        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                    }
                });


        } else if (noteClass.includes("imagePageLink")){


                $.ajax({
                    url: '/paste_imagePageLink/' + pageID + '/' + user_id,
                    type: "POST",

                    data: JSON.stringify({
                        originPageID : originPageID,
                        note_id : note_id,
                        x : x,
                        y : y,
                        type : "child"
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        //console.log(data);
                        current_y = document.documentElement.scrollTop;
                        console.log("current y :", current_y);
                        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                    },
                    error: function (error) {
                        //console.log("problem");
                        current_y = document.documentElement.scrollTop;
                        console.log("current y :", current_y);
                        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                    }
                });


        } else {

            //console.log("pasting a note that is not a pageLink");

            $.ajax({

                url: '/paste_note/' + pageID + '/' + user_id,
                type: "POST",

                data: JSON.stringify({

                    originPageID : originPageID,
                    note_id : note_id,
                    x : x,
                    y : y

                }),
                contentType: "application/json",
                success: function (data) {
                    //console.log(data);
                    current_y = document.documentElement.scrollTop;
                    console.log("current y :", current_y);
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    //console.log("problem");
                    current_y = document.documentElement.scrollTop;
                    console.log("current y :", current_y);
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                }
            });

        }

}


function pasteSelection(selection, originPageID, pageID) {

        //console.log("pasting a selection");
        //console.log(selection);

        $.ajax({
            url: '/paste_selection/' + pageID + '/' + user_id,
            type: "POST",

            data: JSON.stringify({
                originPageID : originPageID,
                selection: selection,
            }),
            contentType: "application/json",
            success: function (data) {
                //console.log(data);
                current_y = document.documentElement.scrollTop;
                console.log("current y :", current_y);
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            },
            error: function (error) {
                //console.log("problem");
                current_y = document.documentElement.scrollTop;
                console.log("current y :", current_y);
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            }
        });

}

