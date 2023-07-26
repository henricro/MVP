var resizableElement = $('.homothetic-resizable');

// Variables to store initial width and height
var initialWidth = resizableElement.offsetWidth;
var initialHeight = resizableElement.offsetHeight;

// Function to handle the resize event
function handleResize(event) {
    // Calculate the new width and height based on the aspect ratio
    var newWidth = initialHeight * (resizableElement.offsetWidth / initialWidth);

    // Apply the new width and height to maintain the aspect ratio
    resizableElement.css({"width": newWidth + 'px'});
}

// Add event listeners for the 'mousedown' event (when resizing starts) and the 'mousemove' event (when resizing)
resizableElement.bind('mousedown', function() {
    $(window).on('mousemove', handleResize);
});

// Add an event listener for the 'mouseup' event (when resizing ends)
$(window).bind('mouseup', function() {
    $(window).on('mousemove', handleResize);
});