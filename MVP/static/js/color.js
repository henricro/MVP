var pickr = Pickr.create({

    el: '#noteStyleBox_2',
    theme: 'nano', // You can choose different themes
    comparison: false,

    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          input: true,
          clear: true,
          save: true
        }
    }

});

// Attach event listeners
pickr.on('change', (color) => {

    const hexColor = color.toHEXA().toString();
    console.log('Selected color:', hexColor);
    var css = "color : " + hexColor + ";";
    console.log(idToColor);
    console.log(hexColor);
    note_to_color = $("#" + idToColor).css("color", hexColor);

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