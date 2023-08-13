
///////////////////////////////////////////////////
/////////////    SET THE TITLE   //////////////////
///////////////////////////////////////////////////


/////////  the title  /////////

$('#title_title').html(title);

noteTitle = $("#title");

var XMLnote = xmlDoc.getElementById("title");
var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;


noteTitle.css("top", y.concat("px"));
noteTitle.css("left", x.concat("px"));



///////////////////////////////////////////////////
/////////////    SELECT TITLE   ////////////////////
///////////////////////////////////////////////////
 $('#title').on('dblclick', function(event){
    event.preventDefault();
});

var titleBoxBool = false;

$('#title').on('click.selectTitle', function(event){
    selectTitle($(this));
});

function selectTitle(title){

    title.off('click.selectTitle');
    title_title = $("#title_title");
    event.stopPropagation();

    //if click outside of title
    $(document).on('click.outsideTitle', function(){
        if (!title.is(event.target) && title.has(event.target).length === 0){

            //console.log("clicked outside title ", "titleBoxBool : ", titleBoxBool);
            if (!titleBoxBool){
                $('#space-down').css("display", "none");
                $('#space-down').off("click.down-space");
                title.on('click.selectTitle', function(event){
                    selectTitle($(this));
                });
            }
        }
    });

    // show arrow to send all donw
    $('#space-down').css("display", "block");
    $('#space-down').on("click.down-space", function(){
        // send all down
        sendAllDown();
        $.ajax({
            url: '/send_all_down/' + pageID + '/' + user_id,
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                console.log(data);
            },
            error: function (error) {
                console.log("problem");
            }
        });
    });

    // SECOND CLICK
    title_title.on('click', function(event){
        //console.log("clicked second time on title");
        event.preventDefault();
        showTitleBox();
    });

}


function showTitleBox(){

    titleBoxBool = true;
    console.log("titleBoxBool", titleBoxBool);
    event.stopPropagation();

    $(document).on('click.outsideTitleBox', function(){
        console.log("click outside titleBox : ", event.target);
        if (!$("#titleDbClick").is(event.target) && !$("#titleDbClick").has(event.target).length > 0){
            titleBoxBool = false;
            hideTitleBox();
        }
    });

    // place titleBox
    title_x = noteTitle.offset().left;
    title_y = noteTitle.offset().top;
    width_title = noteTitle.css("width");
    x = (title_x + parseInt(width_title.slice(0,-2)) + 10).toString() + "px";
    y = (title_y + 10).toString() + "px"
    $("#titleDbClick").css("left", x);
    $("#titleDbClick").css("top", y);
    $("#titleDbClick").css("display", "flex");

}

// function to send All Down
function sendAllDown() {
    $('.note, .noteLink, .pageLink, .image, .imageLink, .imagePageLink, .list, .to-do-list, .pdf, .docx, .xlsx').each(function(){
        element = $(this);
        y_pos = element.css("top");
        y_pos = y_pos.slice(0, -2);
        y_pos = parseInt(y_pos);
        new_y_pos = y_pos + 40;
        new_y_pos = new_y_pos.toString();
        new_y_pos = new_y_pos + "px";
        element.css("top", new_y_pos);
    });
};



function hideTitleBox(){
    console.log("udhuhe");
    titleBoxBool = false;
    $("#titleDbClick").css("display", "none");
}


///////////////////////////////////////////////////
///////////////// RIGHT CLICK TITLE ///////////////
///////////////////////////////////////////////////

$("#title").bind('contextmenu', function(event) {

    event.preventDefault();

    title = $("#title_title").html();

    new_x = event.pageX;
    new_y = event.pageY;

    note = $(this);

    $("#titleRCBox").css("left", new_x);
    $("#titleRCBox").css("top", new_y);
    $("#titleRCBox").show();

    // if click outside
    $(document).click(function(){
        if (!$("#titleRCBox").is(event.target) && $("#titleRCBox").has(event.target).length === 0){
            $("#titleRCBox").hide();
        }
    });

    // Edit Title
    $('#titleRC_1').bind('click', function() {

        var value = prompt("Title", title);
        if (value != null && value!="") {

            $.ajax({
                url: '/edit_title/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    value : value
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

        } else {
            current_y = document.documentElement.scrollTop;
            window.location.href='/open_page/' + pageID + '/' + user_id + '/' + current_y;
        }

    });


});

$("#titleRC_1").on('mouseover', function() {
    follower.html("change title");
    follower.show();
});
$("#titleRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});



/////////////////////////////////
/////////   title box  /////////////
/////////////////////////////////


$('#tdb_title').html("Page info");

    if (lineage ==[]) {

        $("#tdb_path").append("thisi s the home page");

    } else {

    $("#tdb_path").append("<span>Path : </span>");
    for (var i = lineage.length-1; i > -1 ; i--){
        page = "<a href = /open_page/" + lineage[i][0] + "/" + user_id + "/0 target='_blank'>" + lineage[i][1] + " / " + "</a>";
        $("#tdb_path").append(page);
    }

}

console.log(lineage);

////////////////////////////////
// share status //////
/////////////////////////

$('.status_button:not(#status_password)').on('click', function(){

    console.log("clicked on status button");
    $('.status_button').not($(this)).removeClass("status_selected");
    $(this).addClass("status_selected");
    status = $(this).html();

    $.ajax({
        url: '/update_page_status/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            status : status
        }),
        contentType: "application/json",
        success: function (data) {
            current_y = document.documentElement.scrollTop;
        },
        error: function (error) {
            current_y = document.documentElement.scrollTop;
        }
    });

    console.log($(this).attr("id"));

    if ($(this).attr("id") == "status_public"){
        console.log("uduhduhdu");
        popup.textContent = "This page is now public and can be viewed by anyone with the link";
        popup.style.display = "block";

        setTimeout(function() {
          popup.style.display = "none";
        }, 5000);
    }else if ($(this).attr("id") == "status_private"){
        console.log("uduhduhdu");
        popup.textContent = "This page is now private and can only be accessed by you";
        popup.style.display = "block";

        setTimeout(function() {
          popup.style.display = "none";
        }, 5000);
    }

});

console.log("page share status : ", page_share_status);

if (page_share_status == "private") {
    $("#status_private").addClass("status_selected");
} else if (page_share_status == "public") {
    $("#status_public").addClass("status_selected");
} else if (page_share_status == "password") {
    $("#status_password").addClass("status_selected");
}


$("#status_private").on('mouseover', function() {
    follower.html("Page is private and can only be accessed by you");
    follower.show();
});
$("#status_private").on('mouseout', function() {
    follower.html("");
    follower.hide();
});


$("#status_public").on('mouseover', function() {
    follower.html("Page is public and can be viewed by anyone with the link");
    follower.show();
});
$("#status_public").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#status_public").on('mouseover', function() {
    follower.html("Page is public and can be viewed by anyone with the link");
    follower.show();
});
$("#status_public").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#status_password").on('mouseover', function() {
    follower.html("coming soon !");
    follower.show();
});
$("#status_password").on('mouseout', function() {
    follower.html("");
    follower.hide();
});


$('#btn_background_white').on('click', function(){
    $('body').removeClass();
    $.ajax({
        url: '/update_background/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            background : "white"
        }),
        contentType: "application/json",
        success: function (data) {
        },
        error: function (error) {
        }
    });
});

$('#btn_background_dots').on('click', function(){
    $('body').removeClass().addClass('background_dots');
    $.ajax({
        url: '/update_background/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            background : "dots"
        }),
        contentType: "application/json",
        success: function (data) {
        },
        error: function (error) {
        }
    });
});

$('#btn_background_grid').on('click', function(){
    $('body').removeClass().addClass('background_grid');
    $.ajax({
        url: '/update_background/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            background : "grid"
        }),
        contentType: "application/json",
        success: function (data) {
        },
        error: function (error) {
        }
    });
});

