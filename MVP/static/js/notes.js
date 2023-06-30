

///////////////////////////////////////////////////////
////////////////    BUILD THE NOTES   /////////////////
///////////////////////////////////////////////////////


$('.note').each(function(){
    createNote($(this));
});


function createNote(note) {

    id = note.attr("id");

    console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var content = XMLnote.getElementsByTagName("content")[0].childNodes[0].nodeValue;
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    console.log(content, x, y);

    //console.log("print elmnt");
    //console.log(elmnt);

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

    //console.log(event.target.nodeName);

    //console.log("double clicked on page");

    id = biggest + 1;
    //console.log(id);

    if (event.target.nodeName === 'HTML'){
        x = event.pageX.toString();
        y = event.pageY.toString();

        // CREATE HTML NOTE

        //console.log(x, y);

        //elem = '<div class="note"><input type="text" class="input" value=""/><div class="content"></div></div>';
        //$('body').append(elem);

        //var elmnt = $(".note:last");
        //console.log("print elmnt");
        //console.log(elmnt);
        //elmnt.css("position","absolute");
        //elmnt.css("top",y.concat("px"));
        //elmnt.css("left",x.concat("px"));
        //elmnt.attr("id",id);
        //elmnt.find('.content').text("new content");


        $.ajax({
            url: '/create_note/'+pageID + '/' + user_id,
            type: "POST",
            data: JSON.stringify({
                x : x,
                y : y
            }),
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                current_y = document.documentElement.scrollTop;
                console.log("current y :", current_y);
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;

            },
            error: function (error) {
                //console.log("problem");
                current_y = document.documentElement.scrollTop;
                console.log("current y :", current_y);
                window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;
            }
        });

    }


});

///////////////////////////////////////////////////
/////////////    SELECT NOTE   ////////////////////
///////////////////////////////////////////////////

$('.note').each(function(){
    $(this).bind('click.select', function(){
        selectNote($(this));
    });
});



function selectNote(note){

    id = note.attr("id");

    // COPY THE NOTE
    note.bind('copy', function() {
        //console.log("clicked to copy note");
        copyNote(note);
    });

    //console.log("select note");

    note.css({"border-color":"green"});

    // DELETE NOTE
    $(document).bind('keyup.delete', function(){

        if (event.keyCode == 8){

            //console.log(id);
            //console.log(event.keyCode);

            $.ajax({
                url: '/delete_note/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    id: id
                }),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    //window.location.href='/open_page/'+ pageID + '/' + user_id;
                },
                error: function (error) {
                    console.log("problem");
                    //window.location.href='/open_page/'+ pageID + '/' + user_id;
                }
            });
        }
    });

    note.unbind('click.select');

    // SECOND CLICK
    note.bind('click.write', function(){

        $(document).unbind('keyup.delete')

        writeNote($(this));

    });

    $(document).bind('contextmenu', function(event) {

        event.preventDefault();

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            $(document).unbind('keyup.delete');

            note.unbind('click.write');

            note.unbind('copy');

            note.bind('click.select', function(){
                selectNote($(this));
            });

            $(document).unbind('copy');

        }

    });

    $(document).click(function(){

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            $(document).unbind('keyup.delete');

            note.unbind('click.write');

            note.unbind('copy');

            note.bind('click.select', function(){
                selectNote($(this));
            });

            $(document).unbind('copy');

        }
    });

}




/////////////////////////////////////////////////////
/////////////    WRITE IN NOTE   ////////////////////
/////////////////////////////////////////////////////


$('.note').each(function(){
    $(this).bind('dblclick.write', function(){
        //console.log("double clicked on note");
        writeNote($(this));
    });
});

function writeNote(note){


    note.unbind('click.select');
    note.unbind('dblclick.write');
    note.unbind('mousedown.drag');
    note.unbind('copy');

    note.attr("contenteditable", "true");

    $(document).bind('click.update_content', function() {

        if (!note.is(event.target) && note.has(event.target).length === 0){

            content = note.html();

            $(document).unbind('click.update_content');

            id = note.attr('id')

            $.ajax({
                url: '/update_content/'+pageID + '/' + user_id,
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

            note.attr("contenteditable", "false");

            note.bind('click.select', function() {
                selectNote($(this));
            });

            note.bind('dblclick.write', function(){
                writeNote($(this));
            });

            note.bind('mousedown.drag', function(){

                mouseX = event.pageX;
                mouseY = event.pageY;

                noteX = parseInt(note.css("left").slice(0, -2));
                noteY = parseInt(note.css("top").slice(0, -2));

                dragNote(note, noteX, noteY);
            });

        }

    });

}


//////////////////////////////////////////////////
///////////////// RIGHT CLICK NOTE ///////////////
//////////////////////////////////////////////////

$(".note").bind('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    var note= $(this);

    id = note.attr("id");
    //console.log("note id : ", id);
    css = $(this).attr('added_css');

    $("#noteRCBox").css("left", new_x);
    $("#noteRCBox").css("top", new_y);
    $("#noteRCBox").show();

    $(document).click(function(){

        if (!$("#noteRCBox").is(event.target) && $("#noteRCBox").has(event.target).length === 0){

            $("#noteRCBox").hide();

        }

    });

    // Add Link
    $('#noteRC_1').bind('click', function() {

        var value = prompt("Lien", "");

        if (value != null) {

            $.ajax({
                url: '/add_link_note/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    link : value,
                    id : id
                }),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
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

    // Copy Note
    $('#noteRC_2').bind('click', function() {
        copyNote(note);
    });

    // Style
    $('#noteRC_3').bind('click', function() {
        if (css){
            var value = prompt("CSS", css);
        } else {
            var value = prompt("CSS", "");
        }

        if (value != null) {

            //console.log("sending css");

            $.ajax({
                url: '/add_css/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    css : value,
                    id : id
                }),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
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

