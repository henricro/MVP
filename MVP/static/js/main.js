

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

        console.log(clasis);

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
        // build the image divs (global)
        else if (clasis === "image global"){
            elem = "<div class='image global' id='" + id + "'></div>"
            $('body').append(elem);
        }

        // build the imageLink divs
        else if (clasis === "imageLink"){
            elem = '<div class="imageLink" id="' + id + '" ></div>';
            $('body').append(elem);
        }
        // build the imageLink divs
        else if (clasis === "imageLink global"){
            elem = '<div class="imageLink global" id="' + id + '" ></div>';
            $('body').append(elem);
        }

        // build the pdf divs
        else if (clasis === "pdf"){
            elem = "<div class='pdf' id='" + id + "'></div>"
            $('body').append(elem);
        }

        // build the docx divs
        else if (clasis === "docx"){
            elem = "<div class='docx' id='" + id + "'></div>"
            $('body').append(elem);
        }

        // build the xlsx divs
        else if (clasis === "xlsx"){
            elem = "<div class='xlsx' id='" + id + "'></div>"
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
            elem = "<div class='to-do-list' id='" + id + "'></div>"
            $('body').append(elem);
        }


    }
}


///////////////////////////////////////////////////////
//////  KEEP INFO OF LAST PLACE USER CLICKED //////////
///////////////////////////////////////////////////////

$(document).on('click.lastPosition', function(){

    if ($(event.target).is("html") || $(event.target).is("body")) {

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
    if ($(event.target).is("html") || $(event.target).is("body")) {

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

        // if click on first option (list)
        $('#pageRC_2').bind('click', function() {
            $('#pageRC_2').unbind('click');

            $.ajax({
                url: '/new_list/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    x : new_x,
                    y : new_y
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
        $('#pageRC_3').bind('click', function() {
            $('#pageRC_3').unbind('click');

            $.ajax({
                url: '/new_to_do_list/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    x : new_x,
                    y : new_y
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
        $('#pageRC_4').bind('click', function() {
            $('#pageRC_4').unbind('click');

            var value = prompt("export name", "");
            if (value != null) {
                downloadAsPDF(value);
            }

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
    follower.html("list (cmd+L)");
    follower.show();
});
$("#pageRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#pageRC_3").on('mouseover', function() {
    follower.html("to-do-list (cmd+T)");
    follower.show();
});
$("#pageRC_3").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#pageRC_4").on('mouseover', function() {
    follower.html("download page as PDF");
    follower.show();
});
$("#pageRC_4").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#plusZoom").on('mouseover', function() {
    follower.html("zoom in");
    follower.show();
});
$("#plusZoom").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#minusZoom").on('mouseover', function() {
    follower.html("zoom out");
    follower.show();
});
$("#minusZoom").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

if (xmlDoc.getElementsByTagName("background")[0]){
    var background = xmlDoc.getElementsByTagName("background")[0].nodeValue;
}

if (background == "grid") {
    $('body').addClass("background_grid")
}
if (background == "dots") {
    $('body').addClass("background_dots")
}