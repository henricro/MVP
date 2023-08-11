
function saveSizes(id, width, height){

    $.ajax({
        url: '/save_sizes/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            height : height,
            width : width,
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
