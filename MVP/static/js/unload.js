
/////////////////////////////////////////////////////////////////////////////
//////////// SAVE WIDTH AND LENGTH ON CLOSE/REFRESH/OPEN OTHER PAGE /////////
/////////////////////////////////////////////////////////////////////////////


$(window).on('beforeunload', function(){
    save_sizes();
});


function save_sizes(){

    console.log("unload function");
    var sizes = []

    $(".image, .imagePageLink, .imageLink, .pdf").each(function(){
        //console.log($(this));
        var id = $(this).attr("id");
        //console.log(id);
        var width = $(this).css("width").slice(0,-2);
        //console.log(width);
        var height = $(this).css("height").slice(0,-2);
        //console.log(height);
        var info = {id:id, width:width, height:height};
        sizes.push(info);
    })

    $.ajax({
        url: '/unload/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            data: sizes,
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


$(document).on("keydown", function(event) {

    if ((event.metaKey || event.ctrlKey) && event.key === "r") {

        event.preventDefault();
        refreshPage();

    }

});

$(document).on('keydown', function(event) {

    // Check if Cmd (Mac) or Ctrl (Windows) key is pressed
    var cmdPressed = event.metaKey || event.ctrlKey;

    if (cmdPressed && event.shiftKey && event.key === 'r') {

        console.log('Cmd + Shift + R pressed');
        event.preventDefault();
        refreshPage();

    }

});

function refreshPage(){
    save_sizes();
}
