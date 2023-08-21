
////////////////////////////////////////////////
/////////////// BUILD IMAGE-PAGE-LINK ///////////////////
////////////////////////////////////////////////

$('.imagePageLink').each(function(){
    buildImagePageLink($(this));
});


function buildImagePageLink(note) {

    id = note.attr("id");
    var pageTitle = note.attr("pageTitle");

    var XMLnote = xmlDoc.getElementById(id);

    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;

    var image = XMLnote.getElementsByTagName("image")[0].childNodes[0].nodeValue;
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;

    var src = "/static/user_data/users/" + user_id + "/uploads/" + image
    var img_div = "<img class='imagePageLink_img' draggable='false' src=" + src + " />";
    var title_div = "<div class='imagePageLink_name'>" + pageTitle + "</div>"

    note.attr("title", "go to page ".concat(pageTitle));
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    note.css("width", width.concat("px"));
    note.css("height", height.concat("px"));
    note.append(img_div);
    note.append(title_div);

    // css for image if there is some
    if ( XMLnote.getElementsByTagName("css_image")[0] ){
        if ( XMLnote.getElementsByTagName("css_image")[0].childNodes[0] ){

            var css_image = XMLnote.getElementsByTagName("css_image")[0].childNodes[0].nodeValue;
            var image = note.find(".imagePageLink_img");

            image.attr('style', css_image);
            image.attr('added_css', css_image);

        }
    }

    // css for title if there is some
    if ( XMLnote.getElementsByTagName("css_text")[0] ){
        if ( XMLnote.getElementsByTagName("css_text")[0].childNodes[0] ){

            var css_title = XMLnote.getElementsByTagName("css_text")[0].childNodes[0].nodeValue;
            var title = note.find(".imagePageLink_name");

            title.attr('style', css_title);
            title.attr('added_css', css_title);

        }
    }

}



//////////////////////////////////////////////////////////////////
////////////////    SELECT IMAGE-PAGE-LINK   /////////////////////
//////////////////////////////////////////////////////////////////

$('.imagePageLink').each(function(){
    $(this).on('click.selectImagePageLink', function(){
        selectImagePageLink($(this));
    });
});

function selectImagePageLink(note){

    event.stopPropagation();
    note.off('click.selectImagePageLink');

    id = note.attr("id");
    orWidth = note.css("width");
    orHeight = note.css("height");
    imagePageLink_id= note.attr("pageID");

    //console.log(id, orWidth, orHeight);

    // COPY THE NOTE
    $(document).bind('copy', function() {
        copyNote(note);
    });

    //console.log("select image page link");

    // style the element when clicked on
    styleSelect(note);

    // DELETE NOTE
    $(document).bind('keyup.delete', function(){
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
    note.on('mousedown.gotopage', function(){
        if (event.which !== 3 && event.button !== 2) {
            // Your code here (excluding right-click)
            var left  = event.pageX;
            var top   = event.pageY;

            $(this).bind('mouseup.gotopage', function(){
                if (!(left != event.pageX || top != event.pageY)) {
                    window.open('/open_page/'+ imagePageLink_id + '/' + user_id + '/0', '_blank');
                }
            });
          }
    });

    note.addClass("resizable");
    note.off('mousedown.drag');
    note.off('click.selectImagePageLink');

    $(document).on('click.outsideImagePageLink', function(){
        if (!note.is(event.target) && !note.has(event.target).length > 0){

            //console.log("clicked oustide imagePageLink");

            event.stopPropagation();
            $(document).off('click.outsideImagePageLink');
            id = note.attr("id");
            width = note.css("width");
            height = note.css("height");

            //console.log(id, width, height, orWidth, orHeight)

            if (orHeight!=height || orWidth!=width) {
                saveSizes(id, width.slice(0,-2), height.slice(0,-2));
            }

            note.removeClass("resizable");
            styleDefault(note);
            note.off('mousedown.gotopage');
            note.off('mouseup.gotopage');
            $(document).off('copy');
            $(document).off('keyup.delete');

            note.on('click.selectImagePageLink', function(){
                selectImagePageLink($(this));
            });
            note.bind('mousedown.drag', function(event){
                dragNote(note);
            });

        }
    });
}




/////////////////////////////////////////////////////////////
///////////////// RIGHT CLICK IMAGE-PAGE-LINK ///////////////
/////////////////////////////////////////////////////////////


$(".imagePageLink").bind('contextmenu', function(event) {
    event.preventDefault();
    event.stopPropagation();

    new_x = event.pageX;
    new_y = event.pageY;

    id = $(this).attr("id");
    link = $(this).attr("link");
    css_title = $(this).find(".imagePageLink_name").attr("style");
    css_image = $(this).find(".imagePageLink_img").attr("style");
    iPl = $(this);
    iPl_img = iPl.find('.imagePageLink_img');
    iPl_name = iPl.find('.imagePageLink_name');
    console.log(id);
    console.log(iPl);

    $("#imagePageLinkRCBox").css("left", new_x);
    $("#imagePageLinkRCBox").css("top", new_y);
    $("#imagePageLinkRCBox").show();

    oldStyleIPL = iPl.attr("class");

    // hide if click outside
    $(document).on('click', function(event){
        if (!$("#imagePageLinkRCBox").is(event.target) && !$("#imagePageLinkRCBox").has(event.target).length > 0){
            $("#imagePageLinkRCBox").hide();

            id = iPl.attr('id');
            styleIPL = iPl.attr("class") !== oldStyleIPL ? iPl.attr("class") : "same";

            if (styleIPL != "same"){
                $.ajax({
                    url: '/change_IPL_style/' + pageID + '/' + user_id,
                    type: "POST",
                    data: JSON.stringify({
                        styleIPL : styleIPL,
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
        }
    });

    // Change Image
    $('#imagePageLinkRC_2').bind('click', function(event) {
        //console.log("uehue");
        event.stopPropagation();

        modalImagePageLink.show();
        modalImagePageLink.find('.drop-area').attr("imagePageLink_id", id);

        $(document).bind('click.drop' , function() {
            if (!event.target.classList.contains('drop-area')) {
                 modalImagePageLink.hide();
                 $(document).unbind('click.drop');
            }
        });

    });

    // Style title
    $('#imagePageLinkRC_3').on('click', function() {

        console.log(iPl, iPl.attr("id"));

        if (iPl.hasClass('style2_iPl')) {
            //console.log("there");
            iPl.removeClass('style2_iPl');
            iPl_name.removeClass('style2_iPl_name');
            iPl_img.find('.imagePageLink_img').removeClass('style2_iPl_img');

        } else {
            //console.log("here");
            iPl.addClass('style2_iPl');
            //console.log(iPl_img, iPl_name);
            iPl_name.addClass('style2_iPl_name');
            iPl_img.addClass('style2_iPl_img');
        }

    });

});


// Listen for mousemove event on the document
$(document).on('mousemove', function() {
    // Update the follower div's position to the current mouse coordinates
    follower.css({"left" : (event.pageX - 25) + 'px'}); // Subtract half of the width
    follower.css({"top" : top = (event.pageY - 50) + 'px'});  // Subtract half of the height
});

$("#imagePageLinkRC_2").on('mouseover', function() {
    //console.log("over");
    follower.html("change image");
    follower.show();
});

$("#imagePageLinkRC_2").on('mouseout', function() {
    //console.log("out");
    follower.html("");
    follower.hide();
});

$("#imagePageLinkRC_3").on('mouseover', function() {
    //console.log("over");
    follower.html("switch style");
    follower.show();
});

$("#imagePageLinkRC_3").on('mouseout', function() {
    //console.log("out");
    follower.html("");
    follower.hide();
});




