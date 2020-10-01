////////////////////////////////////////////////
///////////// BUILD THE CRITERIA ///////////////
////////////////////////////////////////////////

$('.criteria').each(function(){
    createCriteria($(this));
});

function createCriteria(note) {

    id = note.attr("id");

    console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);
    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;
    var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;

    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    var criteria_name = "<div class='criteria_name'>" + name + "</div>"

    var criteria_categories = "<div class='criteria_categories resizable'></div>"

    var categoriesSpace = "<div class='categories'></div>"

    //console.log("print elmnt");
    //console.log(elmnt);
    note.css("top",y.concat("px"));
    note.css("left",x.concat("px"));

    note.append(criteria_name);
    note.append(criteria_categories);
    $('.criteria_categories').append(categoriesSpace);

    categories = note.find(".criteria_categories")
    categories.css("width", width);
    categories.css("height", height);
    categories.css("left", "-100px");

    crit_name = note.find(".criteria_name");

    if ( XMLnote.getElementsByTagName("css")[0] ){

        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;

            crit_name.attr('style', css);

            note.attr('added_css', css);

        }

    }


}


/*********************/

$(".criteria_categories").bind('contextmenu', function(event) {

    event.preventDefault();

    new_x = event.pageX;
    new_y = event.pageY;

    var criteria_id = $(this).parent().attr("id");

    $("#criteriaRCBox").css("left", new_x);
    $("#criteriaRCBox").css("top", new_y);
    $("#criteriaRCBox").show();

    $(document).click(function(){

        if (!$("#criteriaRCBox").is(event.target) && $("#criteriaRCBox").has(event.target).length === 0){

            $("#criteriaRCBox").hide();

        }

    });

    // Add Category
    $('#criteriaRC_1').bind('click', function() {

        var value = prompt("Category", "");

        if (value != null) {
            $.ajax({
                url: '/add_category/'+pageID + '/' + user_id,
                type: "POST",
                data: JSON.stringify({
                    category : value,
                    criteria_id : criteria_id
                }),
                contentType: "application/json",
                success: function (data) {
                    console.log(data);
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                },
                error: function (error) {
                    console.log("problem");
                    window.location.href='/open_page/'+ pageID + '/' + user_id;
                }
            });
        }

    });

});


///////////////////////////////////////////////////
/////////////    SELECT CRITERIA   ////////////////////
///////////////////////////////////////////////////

/*

$('.criteria').bind('click.select', function(){
    selectCriteria($(this));
});


function selectCriteria(note){

    console.log("selected a criteria");

    note.css({"border-color":"green"});

    note.unbind('click.select');

    // SECOND CLICK
    note.bind('click.parents', function(){

        showCategories(note);

    });

    $(document).click(function(){

        if (!note.is(event.target) && note.has(event.target).length === 0){

            note.css({"border-color":""});

            note.bind('click.select', function(){
                selectCriteria($(this));
            });

        }
    });

}
*/

/*********  SHOW CATEGORIES  *********/

/*

function showCategories(note){

    criteria_id = note.attr("id");

    console.log("show categories");

    console.log(note);

    note.find('.criteria_categories').show();

    note.unbind('mousedown.drag');

    $(".criteria_categories").bind('contextmenu', function(event) {

        event.preventDefault();

        new_x = event.pageX;
        new_y = event.pageY;

        $("#criteriaRCBox").css("left", new_x);
        $("#criteriaRCBox").css("top", new_y);
        $("#criteriaRCBox").show();

        $(document).click(function(){

            if (!$("#criteriaRCBox").is(event.target) && $("#criteriaRCBox").has(event.target).length === 0){

                $("#criteriaRCBox").hide();

            }

        });

        // Add Category
        $('#criteriaRC_1').bind('click', function() {

            var value = prompt("Category", "");

            if (value != null) {
                $.ajax({
                    url: '/add_category/'+pageID,
                    type: "POST",
                    data: JSON.stringify({
                        category : category,
                        criteria_id : criteria_id
                    }),
                    contentType: "application/json",
                    success: function (data) {
                        console.log(data);
                        window.location.href='/open_page/'+pageID;
                    },
                    error: function (error) {
                        console.log("problem");
                        window.location.href='/open_page/'+pageID;
                    }
                });
            }

        });

    });

    $(document).bind('click.hideCategories', function(){
        $(document).bind('click.hideCategories2', function(){

            console.log(event.target.classList);

            // if click outside of categories space
            if (!$(".criteria_categories").is(event.target) && $(".criteria_categories").has(event.target).length === 0){

                console.log(event.target);
                console.log("clicked outside of categories space");

                note.find(".criteria_categories").hide();

                $(document).unbind('click.hideCategories2');
                $(document).unbind('click.hideCategories');

                note.bind('mousedown.drag', function(){

                    note= $(this);

                    mouseX = event.pageX;
                    mouseY = event.pageY;

                    noteX = parseInt(note.css("left").slice(0, -2));
                    noteY = parseInt(note.css("top").slice(0, -2));

                    dragNote(note, noteX, noteY);

                });

            // if click in parent space
            } else {

                console.log("clicked in Categories space");
                console.log(event.target);

            }
        });
    });


}

*/