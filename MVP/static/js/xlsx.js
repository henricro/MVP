////////////////////////////////////////////////
/////////////// BUILD xlsx ///////////////////
////////////////////////////////////////////////

$('.xlsx').each(function(){
    console.log("build an xl");
    buildXlsx($(this));
});

function buildXlsx(note) {

    id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    if (XMLnote.getElementsByTagName("width")[0].childNodes[0]){
        var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
        note.css("width", width);
    }
    if (XMLnote.getElementsByTagName("height")[0].childNodes[0]){
        var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;
        note.css("height", height);
    }
    var storage_name = XMLnote.getElementsByTagName("storage_name")[0].childNodes[0].nodeValue;
    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    var img_src = "/static/images/icons/xlsx.png"
    var img = "<img class='xlsx_img' draggable='false' src=" + img_src + " />";
    var name_div = "<div class='xlsx_name'><div>" + name + "</div></div>"

    xlsx_src = "/static/user_data/users/" + user_id + "/uploads/" + storage_name;
    note.attr("xlsx", xlsx_src );
    note.css("position", "absolute");
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));

    note.append(name_div);
    note.append(img);

    if ( XMLnote.getElementsByTagName("css")[0] ){
        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;
            var style = note.attr('style'); //it will return string
            style += css;
            note.find(".xlsx_img").attr('style', css);
            note.attr('style', style);
            note.attr('added_css', css);

        }
    }
}





///////////////////////////////////////////////////////
////////////////    SELECT xlsx   /////////////////////
///////////////////////////////////////////////////////

$('.xlsx').each(function(){
    $(this).on('click.selectxlsx', function(){
        selectXlsx($(this));
    });
});

function selectXlsx(note){

    id = note.attr("id");
    orWidth = note.css("width");
    orHeight = note.css("height");

    $(document).on('copy', function() {
        console.log("fefefefefe");
        copyNote(note);
    });

    console.log(id, orHeight, orWidth);

    var xlsx = note.attr("xlsx");

    styleSelect(note);
    note.addClass("resizable");
    note.off('mousedown.drag');
    note.off('click.selectxlsx');

    // delete the xlsx
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

    // SECOND CLICK on xlsx
    note.on('mousedown.gotoxlsx', function(){

        var left  = event.pageX;
        var top   = event.pageY;

        $(this).on('mouseup.gotoxlsx', function(){
            if (!(left != event.pageX || top != event.pageY)) {
                window.open(xlsx, '_blank');
            }
        });

    });

    $(document).on('click.outside', function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            id = note.attr("id");
            width = note.css("width");
            height = note.css("height");

            if (orHeight!=height || orWidth!=width) {
                saveSizes(id, width.slice(0,-2), height.slice(0, -2));
            }

            styleDefault(note);

            note.off('mousedown.gotoxlsx');
            note.off('mouseup.gotoxlsx');
            $(document).off('copy');
            note.removeClass("resizable");
            $(document).off('keyup.delete');
            $(document).off('click.outside');

            note.on('click.selectxlsx', function(){
                selectXlsx($(this));
            });

            note.on('mousedown.drag', function(){

                mouseX = event.pageX;
                mouseY = event.pageY;
                noteX = parseInt(note.css("left").slice(0, -2));
                noteY = parseInt(note.css("top").slice(0, -2));
                dragNote(note, noteX, noteY);

            });
        }
    });
}



/////////////////////////////////////////////////
///////////////// RIGHT CLICK xlsx ///////////////
/////////////////////////////////////////////////


$(".xlsx").on('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    id = $(this).attr("id");
    css = $(this).attr("added_css");

    $("#xlsxRCBox").css("left", new_x);
    $("#xlsxRCBox").css("top", new_y);
    $("#xlsxRCBox").show();

    //click outside
    $(document).on('click.outside', function(){
        if (!$("#xlsxRCBox").is(event.target) && $("#xlsxRCBox").has(event.target).length === 0){
            $("#xlsxRCBox").hide();
        }
    });

    //Style
    $('#xlsxRC_1').on('click', function() {
        if (css){var value = prompt("CSS", css);} else {var value = prompt("CSS", "");}

        if (value == null) {} else {

            $.ajax({
                url: '/add_css/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    css : value,
                    id : id,
                    type: "regular"
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

});


$("#xlsxRC_1").on('mouseover', function() {
    follower.html("download xlsx");
    follower.show();
});
$("#xlsxRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

