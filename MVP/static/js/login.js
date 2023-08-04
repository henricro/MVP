
$("#updates_popup").hide();

$("#updates_button").on('click', function() {
    $("#updates_popup").toggle();
});

$("#patreon").on('click', function(){
    window.open("https://www.patreon.com/gyst", '_blank');
})

$(document).click(function(){
    if (!$("#updates_popup").is(event.target) && $("#updates_popup").has(event.target).length === 0 && !$("#updates_button").is(event.target)){
        $("#updates_popup").hide();
    }
});
