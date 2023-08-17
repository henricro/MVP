
////////////////////////////////////////////////
/////////////// BUILD IMAGE ///////////////////
////////////////////////////////////////////////

$('.image').each(function(){
    buildImage($(this));
});

function buildImage(note) {

    var id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;
    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    if (note.hasClass('global')) {
        console.log("is global");
        var img_src = "/static/images/welcome_page/" + name;
    } else {
        console.log("is not global");
        var img_src = "/static/user_data/users/" + user_id + "/uploads/" + name;
    }

    var img_div = "<img class='image_img' draggable='false' src=" + img_src + " />";
    var name_div = "<div class='image_name'><div>" + name + "</div></div>"

    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.css("width", width);
    note.css("height", height);
    note.append(img_div);

    // css if any
    if ( XMLnote.getElementsByTagName("css")[0] ){
        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;
            var style = note.attr('style'); //it will return string

            style += css;
            note.attr('style', style);
            note.attr('added_css', css);

        }
    }
}



///////////////////////////////////////////////////////
////////////////    SELECT IMAGE   /////////////////////
///////////////////////////////////////////////////////

$('.image').each(function(){
    $(this).on('click.selectImage', function(){
        selectImage($(this));
    });
});

function selectImage(note){

    note.off('click.selectImage');

    id = note.attr("id");
    orWidth = note.css("width");
    orHeight = note.css("height");
    //console.log(id, orWidth, orHeight);

    // COPY THE IMAGE
    $(document).on('copy', function() {
        copyNote(note);
    });

    // change style after click
    styleSelect(note);
    note.addClass("resizable");
    note.off('mousedown.drag');

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

    // if click outside
    $(document).on('click.outsideImage', function(){
        if (!note.is(event.target) && !note.has(event.target).length > 0){

            id = note.attr("id");
            width = note.css("width");
            height = note.css("height");

            if (orHeight!=height || orWidth!=width) {
                saveSizes(id, width.slice(0,-2), height.slice(0,-2));
            }

            note.removeClass("resizable");
            styleDefault(note);
            $(document).off('copy');
            $(document).off('keyup.delete');
            note.on('click.selectImage', function(){
                selectImage($(this));
            });
            $(document).off('click.outsideImage');

            note.on('mousedown.drag', function(event){
                dragNote($(this));
            });

        }
    });

}



//////////////////////////////////////////////////
///////////////// RIGHT CLICK IMAGE ///////////////
//////////////////////////////////////////////////

$(".image").on('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    var note = $(this);

    id = note.attr("id");
    src = $(this).find(".image_img").attr("src");

    $("#imageRCBox").css("left", new_x);
    $("#imageRCBox").css("top", new_y);
    $("#imageRCBox").show();

    $(document).click(function(){
        if (!$("#imageRCBox").is(event.target) && $("#imageRCBox").has(event.target).length === 0){
            $("#imageRCBox").hide();
        }
    });

    // Add Link
    $('#imageRC_1').on('click.addLink', function() {

        var value = prompt("Link", "");
        if (value == null){} else {
            $.ajax({
                url: '/add_link_image/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    link : value,
                    id : id
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

    //Change Image
    $('#imageRC_2').on('click', function() {
        console.log("iejijeijeij");
        $.ajax({
            url: '/download_image',
            type: "POST",
            data: JSON.stringify({
                src : src
            }),
            contentType: "application/json",
            success: function (data) {
                current_y = document.documentElement.scrollTop;
            },
            error: function (error) {
                current_y = document.documentElement.scrollTop;
            }
        });

    });


});


$("#imageRC_1").on('mouseover', function() {
    follower.html("add a link");
    follower.show();
});
$("#imageRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#imageRC_2").on('mouseover', function() {
    follower.html("download image");
    follower.show();
});
$("#imageRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});
