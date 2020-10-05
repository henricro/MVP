/*
$(document).ready(function() {
    var ctrlDown = false,
        ctrlKey = 17,
        cmdKey = 91,
        vKey = 86,
        cKey = 67;

    $(document).keydown(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = true;
    }).keyup(function(e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) ctrlDown = false;
    });

    $(".no-copy-paste").keydown(function(e) {
        if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
    });

    // Document Ctrl + C/V
    $(document).keydown(function() {
        if (ctrlDown && (event.keyCode == cKey)) {
        console.log("copy");
        }
        if (ctrlDown && (event.keyCode == vKey)) {
        console.log("paste");
        console.log(event.clipboardData.getData('text'));
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('number-only');
    input.addEventListener('paste', function(event) {
        event.preventDefault();
        event.stopPropagation();

        const pastedText = event.clipboardData.getData('text');
        const numbersOnly = pastedText.replace(/\D/g, '');
        input.value = numbersOnly;
    });
});


$(document).bind('paste', function() {
      setTimeout(function() {
        alert(event.originalEvent.clipboardData);
      }, 1000);
});
*/

$(document).bind('paste', function(e) {
    var data = e.originalEvent.clipboardData.getData('Text');
    //IE9 Equivalent ==> window.clipboardData.getData("Text");

    if (data.includes("youtube.com/")) {

        if( $('#mouse_position').find('#x_pos').html() ){
            x = $('#mouse_position').find('#x_pos').html();
            y = $('#mouse_position').find('#y_pos').html();
        } else {
            x = "500";
            y = "500";
        }

        console.log("pasted youtube video");

        console.log(data);

        $.ajax({
            url: '/youtube/'+pageID + '/' + user_id,
            type: "POST",
            data: JSON.stringify({
                data: data,
                x : x,
                y : y
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