

///////////////////////////////////////////////////////
/////////////   BUILD THE NOTES   ////////////////////
///////////////////////////////////////////////////////


buildNotes();

function buildNotes() {

    var notes = xmlDoc.getElementsByTagName("note");

    for (i = 0; i < notes.length; i++) {

        var note = notes[i];
        var id = note.getAttribute("id");
        var clasis = note.getAttribute("class");

        // build the noteLink divs
        if (clasis === "noteLink"){
            elem = '<div class="noteLink" id="' + id + '" ></div>';
            $('body').append(elem);
        }

        // build the note divs
        else if (clasis === "note") {
            elem = '<div class="note" id="' + id + '" contenteditable="false"></div>';
            $('body').append(elem);
        }

        // build the pageLink divs
        else if (clasis === "pageLink"){

            var type = note.getAttribute("type");
            var pageID = note.getAttribute("pageID");
            var title = pages[pageID];

            elem = '<div class="pageLink" ' + ' id="' + id + '" pageID=' + pageID + ' pageTitle="' + title + '" contenteditable="false"></div>';
            $('body').append(elem);

        }

        // build the image divs
        else if (clasis === "image"){
            elem = "<div class='image' id='" + id + "'></div>"
            $('body').append(elem);
        }

        // build the imageLink divs
        else if (clasis === "imageLink"){
            elem = '<div class="imageLink" id="' + id + '" ></div>';
            $('body').append(elem);
        }

        // build the pdf divs
        else if (clasis === "pdf"){
            elem = "<div class='pdf' id='" + id + "'></div>"
            $('body').append(elem);
        }

        // build the imagePageLink divs
        else if (clasis === "imagePageLink"){

            var type = note.getAttribute("type");
            var pageID = note.getAttribute("pageID");
            var title = pages[pageID];

            elem = '<div class="imagePageLink" ' + ' id="' + id + '" pageID='+ pageID + ' pageTitle="'+ title + '"></div>';
            $('body').append(elem);
        }

        // build the list divs
        else if (clasis === "list"){
            elem = "<ul class='list' id='" + id + "'></ul>"
            $('body').append(elem);
        }

        // build the to-do-list divs
        else if (clasis === "to-do-list"){
            elem = "<ul class='to-do-list' id='" + id + "'></ul>"
            $('body').append(elem);
        }

    }
}


///////////////////////////////////////////////////////
//////  KEEP INFO OF LAST PLACE USER CLICKED //////////
///////////////////////////////////////////////////////

$(document).bind('click', function(){

    if (event.target.nodeName === 'HTML'){

        x = event.pageX.toString();
        y = event.pageY.toString();

        $('#mouse_position').find('#x_pos').html(x);
        $('#mouse_position').find('#y_pos').html(y);

    }

});



////////////////////////////
///   set y position  //////
////////////////////////////

$(window).scrollTop(y_position);

var follower = $('#follower');
$("#follower").hide();


let lastClickPosition = {};

$(document).on('click', function(event) {
  lastClickPosition.x = event.pageX;
  lastClickPosition.y = event.pageY;
});

$(document).on('keydown', function(event) {

  if (event.originalEvent.metaKey && event.key === 'l') {
    event.preventDefault();
    console.log('CMD+L pressed!');
    console.log('Last click position: ', lastClickPosition);

    $.ajax({
        url: '/new_list/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            x : lastClickPosition.x,
            y : lastClickPosition.y
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

  } else if (event.originalEvent.metaKey && event.key === 'd') {
    event.preventDefault();
    console.log('CMD+T pressed!');
    console.log('Last click position: ', lastClickPosition);

    $.ajax({
        url: '/new_to_do_list/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            x : lastClickPosition.x,
            y : lastClickPosition.y
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

////////////////////////////////////////////////
/////////   RIGHT CLICK ON PAGE  ///////////////
////////////////////////////////////////////////

function refreshPage(pageID, user_id, current_y) {
    window.location.href = '/open_page/'+ pageID + '/' + user_id + '/' + current_y;
}

// if right click on page (white space)
$(document).bind('contextmenu.newPage', function(event) {
    event.preventDefault();
    console.log("dojdhudhd");
    console.log(event.target);
    if ($(event.target).is("html")) {

        new_x = event.pageX;
        new_y = event.pageY;
        console.log("newX", new_x);

        $("#pageRCBox").css("left", new_x);
        $("#pageRCBox").css("top", new_y);
        $("#pageRCBox").show();

        // if click outside RCbox
        $(document).bind('click.pageRCBox', function(event){
            if (!$("#pageRCBox").is(event.target) && $("#pageRCBox").has(event.target).length === 0){
                $("#pageRCBox").hide();
                $(document).unbind('click.pageRCBox');
            }
        });

        // if click on first button
        $('#pageRC_1').bind('click', function() {

            $("#pageRCBox").hide();

            //open prompt
            var title = prompt("Name", "");
            if (title === null) {
            } else {

                $.ajax({
                    url: '/new_page/' + pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        new_x : new_x,
                        new_y : new_y,
                        title : title
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        current_y = document.documentElement.scrollTop;
                        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;                },
                    error: function (error) {
                        current_y = document.documentElement.scrollTop;
                        setTimeout(
                            refreshPage(pageID, user_id, current_y),
                            1000
                        )
                    }
                });
            }
        });

        // if click on second button
        $('#pageRC_2').bind('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            x = event.pageX;
            y = event.pageY;

            // show new options
            $("#pageRCPlusBox").css("left", (new_x + 20).toString().concat("px"));
            $("#pageRCPlusBox").css("top", (new_y + 20).toString().concat("px"));
            $("#pageRCPlusBox").show();
            $("#pageRCBox").hide();


            // if click outside RCPlusBox
            $(document).bind('click.pageRCPlusBox', function(event){
                if (!$("#pageRCPlusBox").is(event.target) && $("#pageRCPlusBox").has(event.target).length === 0){
                    $("#pageRCPlusBox").hide();
                    $(document).unbind('click.pageRCPlusBox');
                }
            });

            // if click on first option (list)
            $('#pageRCPlus_1').bind('click', function() {
                $('#pageRCPlus_1').unbind('click');

                $.ajax({
                    url: '/new_list/' + pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
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
            });

            // if click on second option (to-do-list)
            $('#pageRCPlus_2').bind('click', function() {
                $('#pageRCPlus_2').unbind('click');

                $.ajax({
                    url: '/new_to_do_list/' + pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
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
            });

            // if click on second option (to-do-list)
            $('#pageRCPlus_3').bind('click', function() {
                $('#pageRCPlus_3').unbind('click');

                var value = prompt("export name", "");
                if (value != null) {
                    downloadAsPDF(value);
                }

            });

        });
    }
});


$("#pageRC_1").on('mouseover', function() {
    follower.html("new page");
    follower.show();
});
$("#pageRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#pageRC_2").on('mouseover', function() {
    follower.html("more");
    follower.show();
});
$("#pageRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#pageRCPlus_1").on('mouseover', function() {
    follower.html("list (cmd+L)");
    follower.show();
});
$("#pageRCPlus_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#pageRCPlus_2").on('mouseover', function() {
    follower.html("to-do-list (cmd+k)");
    follower.show();
});
$("#pageRCPlus_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#pageRCPlus_3").on('mouseover', function() {
    follower.html("download page as pdf");
    follower.show();
});
$("#pageRCPlus_3").on('mouseout', function() {
    follower.html("");
    follower.hide();
});