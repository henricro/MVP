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

pickr.on('save', (color) => {

    const hexColor = color.toHEXA().toString();
    console.log('Saved color:', hexColor);
    var css = "color : " + hexColor + ";";
    console.log(idToColor);
    console.log(hexColor);
    note_to_color = $("#" + idToColor).css("color", hexColor);

    $.ajax({
        url: '/add_css/' + pageID + '/' + user_id,
        type: "POST",
        data: JSON.stringify({
            id: idToColor,
            css: css,
            type: "color"
        }),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
        }
    });

});



$(".pickr").attr("id", "pickr");
