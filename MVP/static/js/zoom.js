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
        defineDrag();
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
        defineDrag();
    }

});


$("#zoomButton").bind("click", function() {
    //console.log("murder in the first degree");
});