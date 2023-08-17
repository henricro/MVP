$("#pickr").on('mouseover', function() {
    follower.html("color");
    follower.show();
});
$("#pickr").on('mouseout', function() {
    follower.html("");
    follower.hide();
});

$(".pickr").attr("id", "pickr");

$(".pcr-button").on("click", function(event){


    console.log("clicked on color");

    x = event.pageX + 20;
    y = event.pageY + 20;
    console.log(x, y);

    $(".pcr-app").css("top", y + "px");
    $(".pcr-app").css("left",x + "px");

});