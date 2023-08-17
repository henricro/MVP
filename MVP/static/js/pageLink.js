////////////////////////////////////////////////
/////////// BUILD THE PAGE LINKS //////////////
////////////////////////////////////////////////


$('.pageLink').each(function(){
    buildPageLink($(this));
});

function buildPageLink(note) {

    var id = note.attr("id");
    var pagetitle = note.attr("pagetitle");

    var XMLnote = xmlDoc.getElementById(id);

    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;


    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.html(pagetitle);

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
/////////////    CLICK ON PAGELINK   ////////////////////
///////////////////////////////////////////////////////

$('.pageLink').each(function(){
    $(this).on('click.selectPageLink', function(){
        selectPageLink($(this));
    });
});


function selectPageLink(note){

    event.stopPropagation();
    id = note.attr("id");
    pageLinkID= note.attr("pageID");

    // COPY THE NOTE
    note.on('copy', function() {
        copyNote(note);
    });

    styleSelect(note);

    // DELETE NOTE
    $(document).on('keyup.delete', function(){
        if (event.keyCode == 8){

            id = note.attr("id");
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

    note.off('click.selectPageLink');

    // second click : go to page
    note.on('click.gotopage', function(){
        $(document).off('keyup.delete');
        window.open('/open_page/'+ pageLinkID + '/' + user_id + "/0" , '_blank');
    });

    // if click outside pageLink
    $(document).on('click.outsidePageLink contextmenu.outsidePageLink', function(){
        if (!note.is(event.target) && !note.has(event.target).length > 0){

            styleDefault(note);
            $(document).off('copy');
            $(document).off('keyup.delete');
            note.off('click.gotopage');

            note.on('click.selectPageLink', function(){
                selectPageLink($(this));
            });
            $(document).off('click.outsidePageLink', 'contextmenu.outsidePageLink');

        }
    });
}



/////////////////////////////////////////////
///////////////// RIGHT CLICK ///////////////
/////////////////////////////////////////////


$(".pageLink").on('contextmenu', function(event) {

    event.preventDefault();
    new_x = event.pageX;
    new_y = event.pageY;

    note = $(this);
    id = note.attr("id");
    link = note.attr("link");

    $("#pageLinkRCBox").css("left", new_x);
    $("#pageLinkRCBox").css("top", new_y);
    $("#pageLinkRCBox").show();

    $(document).click(function(){
        if (!$("#pageLinkRCBox").is(event.target) && !$("#pageLinkRCBox").has(event.target).length > 0){
            $("#pageLinkRCBox").hide();
        }
    });

    // Change Image
    $('#pageLinkRC_1').bind('click', function(event) {

        event.stopPropagation();

        modalPageLink.show();
        modalPageLink.find('.drop-area').attr("pageLink_id", id);

        $(document).bind('click.drop' , function() {
            if (!event.target.classList.contains('drop-area')) {
                 modalPageLink.hide();
                 $(document).unbind('click.drop');
            }
        });

    });

    // style note
    $('#pageLinkRC_2').on('click', function(event) {

        event.stopPropagation();
        idToColor = id;

        $("#pageLinkRCBox").css("display", "none");

        event.preventDefault();
        new_x = event.pageX;
        new_y = event.pageY;

        $("#pageLinkStyleBox").css("left", new_x);
        $("#pageLinkStyleBox").css("top", new_y);
        $("#pageLinkStyleBox").css("display", "flex");

        oldColorValue = note.css("color");
        oldBackgroundColorValue = note.css('background-color');
        oldFontStyleValue = note.css('font-style');
        oldFontSizeValue = note.css('font-size');

        // click outside note StyleBox
        $(document).on('click.sendCss', function(event){
            event.stopPropagation();
            if ((!$(event.target).closest('#pageLinkStyleBox').length > 0 && !$(event.target).closest('.pcr-app').length > 0) &&
                (!$(event.target).closest('#font-size-container').length > 0 && !$(event.target).closest('#font-size-container').length > 0)) {

                $(document).off('click.sendCss');

                colorValue = note.css("color") !== oldColorValue ? note.css('color') : "same";
                backgroundColorValue = note.css("background-color") !== oldBackgroundColorValue ? note.css('background-color') : "same";
                fontSizeValue = note.css("font-size") !== oldFontSizeValue ? note.css("font-size") : "same";
                fontStyleValue = note.css("font-style") !== oldFontStyleValue ? note.css("font-style") : "same";

                console.log(colorValue, backgroundColorValue, fontSizeValue, fontStyleValue);

                // remove the choice Box
                $("#pageLinkStyleBox").css("display", "none");
                $("#font-size-container").css("display", "none");

                // send the new css
                css = note.attr("style");
                $.ajax({
                    url: '/add_css_pageLink/' + pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        color : colorValue,
                        backgroundColor : backgroundColorValue,
                        fontSize : fontSizeValue,
                        fontStyle : fontStyleValue,
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
        $('#pageLinkStyleBox_1').on('click', function() {

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

        //update italic
        $('#pageLinkStyleBox_4').on('click', function() {
            italic = (note.css('font-style') === 'italic');
            note.css('font-style', italic ? 'normal' : 'italic');
        });

    });

});


var pickrPageLink = Pickr.create({

    el: '#pageLinkStyleBox_2',
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
pickrPageLink.on('change', (color) => {

    const hexColor = color.toHEXA().toString();
    console.log('Selected color:', hexColor);
    note_to_color = $("#" + idToColor).css("color", hexColor);

});

var pickrPageLink2 = Pickr.create({

    el: '#pageLinkStyleBox_3',
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
pickrPageLink2.on('change', (color) => {

    const hexColor = color.toHEXA().toString();
    console.log('Selected color:', hexColor);
    note_to_color = $("#" + idToColor).css("background-color", hexColor);

});



$("#plusSign").bind("click", function(){

    new_x = event.pageX;
    new_y = event.pageY;

    $("#pageRCBox").css("display", "none");
    $("#plusSign").hide();

    $("#pageRCPlusBox").css("left", new_x);
    $("#pageRCPlusBox").css("top", new_y);
    $("#pageRCPlusBox").show();

    $(document).bind('click.pageRCPlusBox', function(){
        $(document).bind('click.pageRCPlusBox2', function(){
            if (!$("#pageRCPlusBox").is(event.target) && $("#pageRCPlusBox").has(event.target).length === 0){

                //console.log("mother of all mothers");
                $("#pageRCPlusBox").hide();
                $(document).unbind('click.pageRCPlusBox2');
                $(document).unbind('click.pageRCPlusBox2');
            }
        });
    });

});

$("#pageLinkRC_1").on('mouseover', function() {
    follower.html("add an image");
    follower.show();
});
$("#pageLinkRC_1").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#pageLinkRC_2").on('mouseover', function() {
    follower.html("style");
    follower.show();
});
$("#pageLinkRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$("#pageLinkRC_3").on('mouseover', function() {
    follower.html("open Canva");
    follower.show();
});
$("#pageLinkRC_3").on('mouseout', function() {
    follower.html("");
    follower.hide();
});




