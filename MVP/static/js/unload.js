
$(document).on("keydown", function(event) {

    if ((event.metaKey || event.ctrlKey) && event.key === "r") {

        event.preventDefault();
        current_y = document.documentElement.scrollTop;
        //console.log(current_y);
        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;

    }

});

$(document).on("keydown", function(event) {

    if ((event.metaKey || event.ctrlKey) && event.key === "s") {

        event.preventDefault();
        current_y = document.documentElement.scrollTop;
        //console.log(current_y);
        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;

    }

});


