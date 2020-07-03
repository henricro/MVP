
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


    $.ajax({
        url: '/unload/'+pageID,
        type: "POST",
        data: JSON.stringify({
            data: sizes
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


