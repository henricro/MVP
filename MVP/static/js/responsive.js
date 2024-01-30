if (window.matchMedia("(max-width: 600px)").matches) {

    $('.note, .pageLink, .imagePageLink_name, .imageLink_link, .noteLink').each(function(){
        // Get the original font size in pixels
        var originalFontSize = parseFloat($(this).css('font-size'));
        // Calculate the new font size by multiplying the original value by 1.5
        var newFontSize = originalFontSize * 1.5;
        // Set the new font size
        $(this).css('font-size', newFontSize + 'px');
    });


}
