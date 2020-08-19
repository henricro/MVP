function copyNote(note){

    console.log("copied a note");
    console.log(note);
    id = note.attr("id");
    noteClass = note.attr("class");
    info = "paste_note, " + pageID + ", "  + id + ", "  + noteClass;
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

        originPageID = data[1];
        note_id = data[2];
        noteClass = data[3];

        console.log(originPageID, note_id, noteClass);

        if( $('#mouse_position').find('#x_pos').html() ){
            x = $('#mouse_position').find('#x_pos').html();
            y = $('#mouse_position').find('#y_pos').html();
        } else {
            x = "300";
            y = "300";
        }

        console.log("last x and y");
        console.log(x, y, noteClass);
        console.log(typeof noteClass);

        if (noteClass.includes("pageLink")){

            $("#pasteBox").css("left", x.concat("px"));
            $("#pasteBox").css("top", y.concat("px"));
            $("#pasteBox").show();

            $(document).bind('click', function(){
                if (!$("#pasteBox").is(event.target) && $("#pasteBox").has(event.target).length === 0){
                    $("#pasteBox").hide();
                }
            });

            $('#paste_1').bind('click', function(){
                console.log("clicked child");
                $.ajax({
                    url: '/paste_pageLink/' + pageID,
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
                        console.log(data);
                        window.location.href='/open_page/'+pageID;
                    },
                    error: function (error) {
                        console.log("problem");
                        window.location.href='/open_page/'+pageID;
                    }
                });
            });

            $('#paste_2').bind('click', function(){
                console.log("clicked parent");
                $.ajax({
                    url: '/paste_pageLink/' + pageID,
                    type: "POST",

                    data: JSON.stringify({
                        originPageID : originPageID,
                        note_id : note_id,
                        type : "parent"
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
            });

            $('#paste_3').bind('click', function(){
                console.log("clicked visitor");
                $.ajax({
                    url: '/paste_pageLink/' + pageID,
                    type: "POST",

                    data: JSON.stringify({
                        originPageID : originPageID,
                        note_id : note_id,
                        x : x,
                        y : y,
                        type : "visitor"
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
            });

        } else if (noteClass.includes("imagePageLink")){

            $("#pasteBox").css("left", x.concat("px"));
            $("#pasteBox").css("top", y.concat("px"));
            $("#pasteBox").show();

            $(document).bind('click', function(){
                if (!$("#pasteBox").is(event.target) && $("#pasteBox").has(event.target).length === 0){
                    $("#pasteBox").hide();
                }
            });

            $('#paste_1').bind('click', function(){
                console.log("clicked child");
                $.ajax({
                    url: '/paste_imagePageLink/' + pageID,
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
                        console.log(data);
                        window.location.href='/open_page/'+pageID;
                    },
                    error: function (error) {
                        console.log("problem");
                        window.location.href='/open_page/'+pageID;
                    }
                });
            });

            $('#paste_2').bind('click', function(){
                console.log("clicked parent");
                $.ajax({
                    url: '/paste_imagePageLink/' + pageID,
                    type: "POST",

                    data: JSON.stringify({
                        originPageID : originPageID,
                        note_id : note_id,
                        type : "parent"
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
            });

            $('#paste_3').bind('click', function(){
                console.log("clicked visitor");
                $.ajax({
                    url: '/paste_imagePageLink/' + pageID,
                    type: "POST",

                    data: JSON.stringify({
                        originPageID : originPageID,
                        note_id : note_id,
                        x : x,
                        y : y,
                        type : "visitor"
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
            });

        } else {

            console.log("pasting a note that is not a pageLink");

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

        }

    } else {
        console.log("is not array");
    }

});

