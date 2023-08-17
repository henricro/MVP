

///////////////////////////////////////////////////////
////////////////    BUILD THE NOTES   /////////////////
///////////////////////////////////////////////////////


$('.note').each(function(){
    buildNote($(this));
});


function buildNote(note) {

    id = note.attr("id");

    var XMLnote = xmlDoc.getElementById(id);
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    note.css("top",y.concat("px"));
    note.css("left",x.concat("px"));
    note.html(content);

    // added CSS if there is some
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
/////////////    CREATE NEW NOTE   ////////////////////
///////////////////////////////////////////////////////

$('*:not("div")').dblclick(function(){

    if (event.target.nodeName === 'HTML'){
        x = event.pageX.toString();
        y = event.pageY.toString();

        $.ajax({
            url: '/create_note/' + pageID + '/' + user_id,
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

    }

});

///////////////////////////////////////////////////
/////////////    SELECT NOTE   ////////////////////
///////////////////////////////////////////////////

$('.note').each(function(){
    $(this).on('click.selectNote', function(){
        selectNote($(this));
    });
});


function selectNote(note){

    event.stopPropagation();
    id = note.attr("id");

    // COPY THE NOTE
    $(document).on('copy', function() {
        copyNote(note);
    });

    styleSelect(note);

    // DELETE NOTE
    $(document).on('keyup.delete', function(){
        if (event.keyCode == 8){

            $.ajax({
                url: '/delete_note/'+pageID + '/' + user_id,
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

    note.off('click.selectNote');

    // SECOND CLICK
    note.on('click.write', function(){
        $(document).off('keyup.delete');
        event.stopPropagation();
        writeNote($(this));
    });


    $(document).on('click.outsideNote contextmenu.outsideNote', function(){
        if (!note.is(event.target)){
            console.log("mumumumi");
            styleDefault(note);
            $(document).off('keyup.delete');
            note.off('click.write');
            $(document).off('copy');
            note.on('click.selectNote', function(){
                selectNote($(this));
            });
            $(document).off('click.outsideNote contextmenu.oustidNote');

        }
    });
}



/////////////////////////////////////////////////////
/////////////    WRITE IN NOTE   ////////////////////
/////////////////////////////////////////////////////


$('.note').each(function(){
    $(this).on('dblclick.write', function(){
        writeNote($(this));
    });
});

function writeNote(note){

    note.off('click.selectNote');
    note.off('dblclick.write');
    note.off('mousedown.drag');
    note.off('copy');
    note.attr("contenteditable", "true");

    $(document).on('click.update_content', function() {
        if (!note.is(event.target) && note.has(event.target).length === 0){

            content = note.html();
            $(document).off('click.update_content');
            id = note.attr('id')
            console.log("clicked outside of note ", content);

            if (content == "") {
                current_y = document.documentElement.scrollTop;
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            } else {

                $.ajax({
                    url: '/update_content/' + pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        id: id,
                        content: content
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (error) {
                        console.log("problem");
                    }
                });
            }

            note.attr("contenteditable", "false");

            note.on('click.selectNote', function() {
                selectNote($(this));
            });

            note.on('dblclick.write', function(){
                writeNote($(this));
            });

            note.on('mousedown.drag', function(){
                dragNote(note);
            });

        }

    });

}


//////////////////////////////////////////////////
///////////////// RIGHT CLICK NOTE ///////////////
//////////////////////////////////////////////////

var idToColor = "hher"

$(".note").on('contextmenu', function(event) {

    event.preventDefault();
    new_x = event.pageX;
    new_y = event.pageY;

    var note = $(this);
    var id = note.attr("id");

    $("#noteRCBox").css("left", new_x);
    $("#noteRCBox").css("top", new_y);
    $("#noteRCBox").css("display", "flex");

    // click outside
    $(document).click(function(){
        if (!$("#noteRCBox").is(event.target) && !$("#noteRCBox").has(event.target).length > 0){
            $("#noteRCBox").css("display", "none");
        }
    });

    // copy Note
    $('#noteRC_1').on('click.copyNote', function() {
        console.log("copy note");
        copyNote(note);
    });

    console.log("id of note selected/ to color : ", idToColor);

    // style note
    $('#noteRC_2').on('click', function(event) {

        event.stopPropagation();
        idToColor = id;

        $("#noteRCBox").css("display", "none");

        event.preventDefault();
        new_x = event.pageX;
        new_y = event.pageY;

        $("#noteStyleBox").css("left", new_x);
        $("#noteStyleBox").css("top", new_y);
        $("#noteStyleBox").css("display", "flex");

        oldColorValue = note.css("color");
        oldFontStyleValue = note.css('font-style');
        oldFontSizeValue = note.css('font-size');
        oldTextDecorationValue = note.css('text-decoration');

        // click outside note StyleBox
        $(document).on('click', function(event){
            console.log("dzuhudzh");
            if ((!$(event.target).closest('#noteStyleBox').length > 0 && !$(event.target).closest('.pcr-app').length > 0) &&
                (!$(event.target).closest('#font-size-container').length > 0 && !$(event.target).closest('#font-size-container').length > 0)) {

                console.log("heeeyyyyy");
                colorValue = note.css("color") !== oldColorValue ? note.css('color') : "same";
                fontSizeValue = note.css("font-size") !== oldFontSizeValue ? note.css("font-size") : "same";
                textDecorationValue = note.css("text-decoration") !== oldTextDecorationValue ? note.css('text-decoration') : "same";
                fontStyleValue = note.css("font-style") !== oldFontStyleValue ? note.css("font-style") : "same";

                // remove the choice Box
                $("#noteStyleBox").css("display", "none");
                $("#font-size-container").css("display", "none");

                // send the new css
                css = note.attr("style");
                $.ajax({
                    url: '/add_css_note/' + pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        color : colorValue,
                        fontSize : fontSizeValue,
                        fontStyle : fontStyleValue,
                        textDecoration : textDecorationValue,
                        id : id,
                        type: "regular"
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
        $('#noteStyleBox_1').on('click', function() {

            console.log("console log");
            var fontSizeRange = $("#font-size-range");
            var fontSizeDisplay = $("#font-size-display");
            console.log(fontSizeRange);
            console.log(fontSizeDisplay);
            console.log(new_x);
            console.log(new_y);
            //var sampleText = $("#sample-text");

            $('#font-size-container').css("left", new_x - 80 + "px");
            $('#font-size-container').css("top", new_y + 10 + "px");
            $('#font-size-container').css("display", "flex");

            fontSizeRange.on("input", updateFontSize);

            function updateFontSize() {
                var fontSize = fontSizeRange.val();
                console.log("update fontsize");
                console.log("ehhe", fontSizeRange);
                console.log(fontSize);
                fontSizeDisplay.html(fontSize) ;
                note.css('font-size', fontSize + "px");
            }

        });

        // update underline
        $('#noteStyleBox_3').on('click', function() {
            underline = (note.css('text-decoration').includes('underline'));
            note.css('text-decoration', underline ? 'none' : 'underline');
        });

        // update text-decoration
        $('#noteStyleBox_4').on('click', function() {
            linethrough = (note.css('text-decoration').includes('line-through'));
            note.css('text-decoration', linethrough ? 'none' : 'line-through');
        });

        //update italic
        $('#noteStyleBox_5').on('click', function() {
            italic = (note.css('font-style') === 'italic');
            note.css('font-style', italic ? 'normal' : 'italic');
        });

    });

});

var pickrNote = Pickr.create({

    el: '#noteStyleBox_2',
    theme: 'nano', // You can choose different themes
    comparison: false,

    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          input: true,
          clear: true,
          save: true
        }
    }

});

// Attach event listeners
pickrNote.on('change', (color) => {

    const hexColor = color.toHEXA().toString();
    console.log('Selected color:', hexColor);
    var css = "color : " + hexColor + ";";
    console.log(idToColor);
    console.log(hexColor);
    note_to_color = $("#" + idToColor).css("color", hexColor);

});


$("#noteRC_1").on('mouseover', function() {
    follower.html("copy note");
    follower.show();
});
$("#noteRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteRC_2").on('mouseover', function() {
    follower.html("style note");
    follower.show();
});
$("#noteRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_1").on('mouseover', function() {
    follower.html("size");
    follower.show();
});
$("#noteStyleBox_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_3").on('mouseover', function() {
    follower.html("underline");
    follower.show();
});
$("#noteStyleBox_3").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_4").on('mouseover', function() {
    follower.html("cross");
    follower.show();
});
$("#noteStyleBox_4").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_5").on('mouseover', function() {
    follower.html("italic");
    follower.show();
});
$("#noteStyleBox_5").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#noteStyleBox_6").on('mouseover', function() {
    follower.html("CSS");
    follower.show();
});
$("#noteStyleBox_6").on('mouseout', function() {
    follower.html("");
    follower.hide();
});