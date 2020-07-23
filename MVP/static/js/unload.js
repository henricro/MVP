
/////////////////////////////////////////////////////
//////////// SAVE WIDTH AND LENGTH ON CLOSE /////////
/////////////////////////////////////////////////////


$(window).on( "unload", function(){
    save_sizes();
});


$(window).on('beforeunload', function(){
    save_sizes();
});


function save_sizes(){

    var sizes = []

    $(".image, .imagePageLink, .imageLink, .pdf").each(function(){
        console.log($(this));
        var id = $(this).attr("id");
        console.log(id);
        var width = $(this).css("width").slice(0,-2);
        console.log(width);
        var height = $(this).css("height").slice(0,-2);
        console.log(height);
        var info = {id:id, width:width, height:height};
        sizes.push(info);
    })

    var parents = $("#title_parents");

    var parents_x = parents.css("left").slice(0,-2);
    var parents_y = parents.css("top").slice(0,-2);
    var parents_width = parents.css("width").slice(0,-2);
    var parents_height = parents.css("height").slice(0,-2);

    $.ajax({
        url: '/unload/'+pageID,
        type: "POST",
        data: JSON.stringify({
            data: sizes,
            //parents_x : parents_x,
            //parents_y : parents_y,
            //parents_width : parents_width,
            //parents_height : parents_height
        }),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            //window.location.href='/open_page/'+pageID;
        },
        error: function (error) {
            console.log("problem");
            //window.location.href='/open_page/'+pageID;
        }
    });

}

