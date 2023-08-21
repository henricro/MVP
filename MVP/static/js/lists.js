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


    ////console.log("list", list);

    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.append(list);

    // added CSS if there is some
    if ( XMLnote.getElementsByTagName("css")[0] ){
        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;
            var style = note.attr('style'); //it will return string

            style += css;
            note.attr('style', style);

        }
    }

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
            //console.log("iejijeije")
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
                        //console.log(data);
                    },
                    error: function (error) {
                        //console.log("problem");
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


$(".list").on('contextmenu', function(event) {

    event.preventDefault();
    new_x = event.pageX;
    new_y = event.pageY;

    var note = $(this);
    var id = note.attr("id");

    event.stopPropagation();

    //console.log("id of note selected/ to color : ", idToColor);

    $("#listStyleBox").css("left", new_x);
    $("#listStyleBox").css("top", new_y);
    $("#listStyleBox").css("display", "flex");

    oldFontSizeValue = note.css('font-size');

    // click outside note StyleBox
    $(document).on('click', function(event){
        //console.log("dzuhudzh");
        if ((!$(event.target).closest('#listStyleBox').length > 0 && !$(event.target).closest('.pcr-app').length > 0) &&
            (!$(event.target).closest('#font-size-container').length > 0 && !$(event.target).closest('#font-size-container').length > 0)) {

            //console.log("heeeyyyyy");
            fontSizeValue = note.css("font-style") !== oldFontSizeValue ? note.css("font-size") : "same";

            // remove the choice Box
            $("#listStyleBox").css("display", "none");
            $("#font-size-container").css("display", "none");

            // send the new css
            css = note.attr("style");
            $.ajax({
                url: '/add_css_list/' + pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    fontSize : fontSizeValue,
                    id : id
                }),
                contentType: "application/json",
                success: function (data) {
                    current_y = document.documentElement.scrollTop;
                },
                error: function (error) {
                    current_y = document.documentElement.scrollTop;
                }
            });

        }
    });

    // update font size
    $('#listStyleBox_1').on('click', function() {

        //console.log("console log");
        var fontSizeRange = $("#font-size-range");
        var fontSizeDisplay = $("#font-size-display");
        //var sampleText = $("#sample-text");

        $('#font-size-container').css("left", new_x - 80 + "px");
        $('#font-size-container').css("top", new_y + 10 + "px");
        $('#font-size-container').css("display", "flex");

        fontSizeRange.on("input", updateFontSize);

        function updateFontSize() {
            var fontSize = fontSizeRange.val();
            //console.log("update fontsize");
            //console.log("ehhe", fontSizeRange);
            //console.log(fontSize);
            fontSizeDisplay.html(fontSize) ;
            note.css('font-size', fontSize + "px");
        }

    });

});



