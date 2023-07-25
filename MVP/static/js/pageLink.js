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
    $(this).bind('click.select', function(){
        selectPageLink($(this));
    });
});

function styleClickPageLink(note){
    note.css({"border-color":"rgb(96, 168, 53) rgb(246, 140, 87) rgb(246, 140, 87) rgb(96, 168, 53)"});
    note.css({"text-decoration": "underline"});
    note.css({"text-decoration-color": "#F68C57"});
    note.css({"cursor":"pointer"});
}

function defaultStylePageLink(note){
    note.css({"border-color":"rgb(200, 240, 149, 0.3) rgb(246, 140, 87) rgb(246, 140, 87) rgb(200, 240, 149, 0.3)"});
    note.css({"text-decoration": ""});
    note.css({"cursor":"default"});
}

function selectPageLink(note){

    // COPY THE NOTE
    note.bind('copy', function() {
        copyNote(note);
    });

    styleClickPageLink(note);

    pageLinkID= note.attr("pageID");

    // DELETE NOTE
    $(document).bind('keyup.delete', function(){
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

    note.unbind('click.select');

    // second click : go to page
    note.bind('click.gotopage', function(){
        $(document).unbind('keyup.delete');
        window.open('/open_page/'+ pageLinkID + '/' + user_id + "/0" , '_blank');
    });

    // if click outside pageLink
    $(document).click(function(){
        if (!note.is(event.target) && note.has(event.target).length === 0){

            defaultStylePageLink(note)

            note.unbind('copy');
            $(document).unbind('keyup.delete');
            note.unbind('click.gotopage');

            note.bind('click.select', function(){
                selectPageLink($(this));
            });
        }
    });
}



/////////////////////////////////////////////
///////////////// RIGHT CLICK ///////////////
/////////////////////////////////////////////


$(".pageLink").bind('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    note = $(this);
    id = note.attr("id");
    link = note.attr("link");
    css = note.attr("added_css");

    $("#pageLinkRCBox").css("left", new_x);
    $("#pageLinkRCBox").css("top", new_y);
    $("#pageLinkRCBox").show();

    $(document).click(function(){

        if (!$("#pageLinkRCBox").is(event.target) && $("#pageLinkRCBox").has(event.target).length === 0){

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

    // Style
    $('#pageLinkRC_2').bind('click', function() {

        if (css){var value = prompt("CSS", css);} else {var value = prompt("CSS", "");}
        if (value != null) {

            $.ajax({
                url: '/add_css/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    css : value,
                    id : id
                }),
                contentType: "application/json",
                success: function (data) {
                    //console.log(data);
                    current_y = document.documentElement.scrollTop;
                    console.log("current y :", current_y);
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                },
                error: function (error) {
                    console.log("problem");
                    current_y = document.documentElement.scrollTop;
                    console.log("current y :", current_y);
                    window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
                }
            });

        }
    });

});


$("#plusSign").bind("click", function(){

    //console.log("forever young");

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
    follower.html("style title");
    follower.show();
});
$("#pageLinkRC_2").on('mouseout', function() {
    follower.html("");
    follower.hide();
});