
$(document).on("keydown", function(event) {

    if ((event.metaKey || event.ctrlKey) && event.key === "r") {

        event.preventDefault();
        current_y = document.documentElement.scrollTop;
        console.log(current_y);
        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;

    }

});

$(document).on("keydown", function(event) {

    if ((event.metaKey || event.ctrlKey) && event.key === "s") {

        event.preventDefault();
        current_y = document.documentElement.scrollTop;
        console.log(current_y);
        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;

    }

});

$(document).on('keydown', function(event) {

    // Check if Cmd (Mac) or Ctrl (Windows) key is pressed
    var cmdPressed = event.metaKey || event.ctrlKey;

    if (cmdPressed && event.shiftKey && event.key === 'r') {

        current_y = document.documentElement.scrollTop;
        console.log(current_y);
        window.location.href='/open_page/'+ pageID + '/' + user_id + '/' + current_y;

    }

});

