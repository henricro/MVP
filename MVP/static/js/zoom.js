$("#plusZoom").bind("click.zoomIn", function() {

    //console.log("zoom in");

    zoomLevel = $('body').css("zoom");
    //console.log("zoom level ", zoomLevel);
    //console.log(typeof(zoomLevel));
    zoomLevel = parseFloat(zoomLevel);
    //console.log("zoom level ", zoomLevel);
    //console.log(typeof(zoomLevel));
    newZoomLevel = zoomLevel + 0.05;

    //console.log(2+3);

    //console.log("new zoom level ", newZoomLevel);


    if (zoomLevel < 0.96) {
        //console.log("should zoom in");
        $('body').css("zoom", newZoomLevel);
    }

});

$("#minusZoom").bind("click.zoomOut", function() {

    zoomLevel = $('body').css("zoom");
    //console.log("zoom level ", zoomLevel);
    //console.log(typeof(zoomLevel));
    newZoomLevel = zoomLevel - 0.05;
    //console.log("new zoom level ", newZoomLevel);

    if (zoomLevel > 0.1) {
        $('body').css("zoom", newZoomLevel);
    }

});

var maxLeft = -Infinity;
var maxWidth = 0;

// Iterate through all elements and find the one with the biggest 'left'
$('*').each(function() {
    var $this = $(this);
    var leftValue = parseFloat($this.css('left'));
    var widthValue = $this.outerWidth();

    if (!isNaN(leftValue) && leftValue > maxLeft) {
        maxLeft = leftValue;
        maxWidth = widthValue;
    }
});

// Calculate the sum of 'left' and width
var totalWidth = maxLeft + maxWidth;

// Set the body width to the calculated sum
$('body').css('width', totalWidth + 'px');
$('html').css('width', totalWidth + 'px');












/*

let initialDistance = 0;
let currentDistance = 0;
let isZooming = false;
let lastTouchMove = null;
let currentScale = 1;

$(document).on('touchstart', function(event) {
    if (event.originalEvent.touches.length === 2) {
        const touch1 = event.originalEvent.touches[0];
        const touch2 = event.originalEvent.touches[1];
        initialDistance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
        isZooming = true;
    }
});

$(document).on('touchmove', function(event) {
    if (isZooming && event.originalEvent.touches.length === 2) {
        const touch1 = event.originalEvent.touches[0];
        const touch2 = event.originalEvent.touches[1];
        currentDistance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);

        if (lastTouchMove !== null) {
            const touchMoveDistance = Math.abs(currentDistance - initialDistance);
            const scrollThreshold = 10; // Adjust this value to control pinch-to-zoom vs. scroll sensitivity

            if (touchMoveDistance > scrollThreshold) {
                // Pinch-to-zoom
                const distanceDifference = currentDistance - initialDistance;
                const scaleFactor = 0.005; // Adjust this value to control zoom speed
                const newScale = currentScale - distanceDifference * scaleFactor;
                currentScale = Math.max(0.5, Math.min(newScale, 2)); // Limit zoom scale
                console.log(currentScale);
                $('*:not(#title):not(body)').each(function(){
                    $(this).css('transform', `scale(${currentScale})`);
                    var originalTop = parseFloat($(this).css('top'));
                    var originalLeft = parseFloat($(this).css('left'));
                    var newTop = originalTop * currentScale;
                    var newLeft = originalLeft * currentScale;
                    $(this).css({
                        top: newTop + 'px',
                        left: newLeft + 'px'
                    });
                });

            } else {
                // Regular touch scrolling, do nothing
            }
        }

        lastTouchMove = currentDistance;
    }
    event.preventDefault();
});

$(document).on('touchend', function(event) {
    isZooming = false;
    lastTouchMove = null;
});

$(document).on('wheel', function(event) {
    event.preventDefault();
    const scaleFactor = 0.005; // Adjust this value to control zoom speed
    const delta = event.originalEvent.deltaY;
    currentScale += delta > 0 ? -scaleFactor : scaleFactor;
    currentScale = Math.max(0.5, Math.min(currentScale, 2)); // Limit zoom scale
    console.log(currentScale);
    $('*:not(#title, #title *):not(body):not(html):not(head)').each(function(){
        $(this).css('transform', `scale(${currentScale})`);
        var originalTop = parseFloat($(this).css('top'));
        var originalLeft = parseFloat($(this).css('left'));
        var newTop = originalTop * currentScale;
        var newLeft = originalLeft * currentScale;
        $(this).css({
            top: newTop + 'px',
            left: newLeft + 'px'
        });
    });


});

*/




















/*
$(document).on("mousewheel", function(e) {

    if (e.ctrlKey) {
        e.preventDefault();
        e.stopImmediatePropagation();

        console.log(e.deltaX, e.deltaX);

        $("body").css({'zoom':'0.5'});
        console.log('yolo');
        // perform desired zoom action here
    }

});


$(document).on("mousewheel", function(event) {

    console.log(event.deltaX);

    console.log(event.deltaY);

    console.log(event.deltaZ);

});
*/
/*
$('body').on('mousewheel DOMMouseScroll', function(e){

  if(typeof e.originalEvent.detail == 'number' && e.originalEvent.detail !== 0) {
    if(e.originalEvent.detail > 0) {
      console.log('Down');
      zoom = $('body').css("zoom");
      console.log(zoom);
    } else if(e.originalEvent.detail < 0){
        console.log('Up');
        zoom = $('body').css("zoom");
        console.log(zoom);
    }
  } else if (typeof e.originalEvent.wheelDelta == 'number') {
    if(e.originalEvent.wheelDelta < 0) {
        console.log('Down');
        zoom = $('body').css("zoom");
        console.log(zoom);
        #newZoom = zoom - 0.01;
        #$('body').css("zoom", newZoom);
    } else if(e.originalEvent.wheelDelta > 0) {
        console.log('Up');
        zoom = $('body').css("zoom");
        console.log(zoom);
        /*newZoom = zoom + 0.01;
        /*$('body').css("zoom", newZoom);
    }
  }
});


function myFunction(event) {
  var y = event.deltaY;
  console.log("printing deltaY");
  console.log(y);
  var currentSize = event.target.style.width;
  if (y > 0) {
    newSize = parseInt(currentSize) + 10;
  } else {
    newSize = parseInt(currentSize) - 10;
  }
  event.target.style.width = newSize + "px";
  event.target.style.height = newSize + "px";
}
*/

/*
function myZoomFunction(event) {

    var y = event.deltaY;
    var x = event.deltaX;
    var z = event.deltaZ;

    console.log("print deltas");

    console.log(x, y, z);

}

*/

/*
let initialDistance = 0;
let currentDistance = 0;
let isZooming = false;
let lastTouchMove = null;
let currentScale = 1;

$(document).on('touchstart', function(event) {
    if (event.originalEvent.touches.length === 2) {
        const touch1 = event.originalEvent.touches[0];
        const touch2 = event.originalEvent.touches[1];
        initialDistance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);
        isZooming = true;
    }
});

$(document).on('touchmove', function(event) {
    if (isZooming && event.originalEvent.touches.length === 2) {
        const touch1 = event.originalEvent.touches[0];
        const touch2 = event.originalEvent.touches[1];
        currentDistance = Math.hypot(touch2.pageX - touch1.pageX, touch2.pageY - touch1.pageY);

        if (lastTouchMove !== null) {
            const touchMoveDistance = Math.abs(currentDistance - initialDistance);
            const scrollThreshold = 10; // Adjust this value to control pinch-to-zoom vs. scroll sensitivity

            if (touchMoveDistance > scrollThreshold) {
                // Pinch-to-zoom
                const distanceDifference = currentDistance - initialDistance;
                const scaleFactor = 0.005; // Adjust this value to control zoom speed
                const newScale = currentScale - distanceDifference * scaleFactor;
                currentScale = Math.max(0.5, Math.min(newScale, 2)); // Limit zoom scale
                $('body').css('transform', `scale(${currentScale})`);
            } else {
                // Regular touch scrolling, do nothing
            }
        }

        lastTouchMove = currentDistance;
    }
    event.preventDefault();
});

$(document).on('touchend', function(event) {
    isZooming = false;
    lastTouchMove = null;
});

$(document).on('wheel', function(event) {
    event.preventDefault();
    const scaleFactor = 0.005; // Adjust this value to control zoom speed
    const delta = event.originalEvent.deltaY;
    currentScale += delta > 0 ? -scaleFactor : scaleFactor;
    currentScale = Math.max(0.5, Math.min(currentScale, 2)); // Limit zoom scale
    $('body').css('transform', `scale(${currentScale})`);
});
*/