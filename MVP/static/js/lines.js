createLines();

function createLines() {

    console.log("create the bloody lines");

    var lines = xmlDoc.getElementsByTagName("connexion");

    for (i = 0; i < lines.length; i++) {

        var line = lines[i];
        var ids = line.childNodes[0].nodeValue;
        var ids = ids.split(",");

        var id_1 = ids[0];
        var id_2 = ids[1];

        var line_id = id_1 + "_" +id_2

        elem = '<div class="line" id="' + line_id + '" ></div>';
        $('body').append(elem);

        var elem1 = $('#' + id_1);
        var elem2 = $('#' + id_2);

        console.log(elem1, elem2);

        var x1 = parseInt(elem1.css("left").slice(0, -2)) + (parseInt(elem1.css("width").slice(0, -2))/2);
        var x2 = parseInt(elem2.css("left").slice(0, -2)) + (parseInt(elem2.css("width").slice(0, -2))/2);
        var y1 = parseInt(elem1.css("top").slice(0, -2)) + (parseInt(elem1.css("height").slice(0, -2))/2);
        var y2 = parseInt(elem2.css("top").slice(0, -2)) + (parseInt(elem2.css("height").slice(0, -2))/2);

        console.log(x1, y1, x2, y2);

        var hypotenuse = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
        var angle = Math.atan2((y1-y2), (x1-x2)) *  (180/Math.PI);
        console.log(hypotenuse, angle);

        if(angle >= 90 && angle < 180){
            y1 = y1 - (y1-y2);
            x1 = x1 + (x2-x1);
        }
        if(angle > 0 && angle < 90){
            x1 = x1 - (x1-x2);
            y1 = y1 - (y1-y2);
        }
        if(angle <= 0 && angle > -90){
            x1 = x1 - (x1-x2);
            y1 = y1 - (y1-y2);
        }
        if(angle <= -90 ){
            angle = angle-180;
        }

        $("#" + line_id).offset({top: y1, left: x1});

        $("#" + line_id).rotate(angle);

        $("#" + line_id).css("transform-origin", "0% 100%");

        $("#" + line_id).width(hypotenuse);

        // Add the dynamic adaptation

        elem1.draggable({ delay: 0, distance: 0 },{

            drag: function(event, ui){
                var x1 = parseInt(elem1.css("left").slice(0, -2)) + (parseInt(elem1.css("width").slice(0, -2))/2);
                var x2 = parseInt(elem2.css("left").slice(0, -2)) + (parseInt(elem2.css("width").slice(0, -2))/2);
                var y1 = parseInt(elem1.css("top").slice(0, -2)) + (parseInt(elem1.css("height").slice(0, -2))/2);
                var y2 = parseInt(elem2.css("top").slice(0, -2)) + (parseInt(elem2.css("height").slice(0, -2))/2);

                var hypotenuse = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
                var angle = Math.atan2((y1-y2), (x1-x2)) *  (180/Math.PI);
                console.log(hypotenuse, angle);

                if(angle >= 90 && angle < 180){
                    y1 = y1 - (y1-y2);
                }
                if(angle > 0 && angle < 90){
                    x1 = x1 - (x1-x2);
                    y1 = y1 - (y1-y2);
                }
                if(angle <= 0 && angle > -90){
                    x1 = x1 - (x1-x2);
                }

                $("#" + line_id).queue(function(){
                    $(this).offset({top: y1, left: x1});
                    $(this).dequeue();
                }).queue(function(){
                    $(this).width(hypotenuse);
                    $(this).dequeue();
                }).queue(function(){
                    $(this).rotate(angle);
                    $(this).dequeue();
                });

            }

        });

        elem2.draggable({ delay: 0, distance: 0 },{
            drag: function(event, ui){
                var x1 = parseInt(elem1.css("left").slice(0, -2)) + (parseInt(elem1.css("width").slice(0, -2))/2);
                var x2 = parseInt(elem2.css("left").slice(0, -2)) + (parseInt(elem2.css("width").slice(0, -2))/2);
                var y1 = parseInt(elem1.css("top").slice(0, -2)) + (parseInt(elem1.css("height").slice(0, -2))/2);
                var y2 = parseInt(elem2.css("top").slice(0, -2)) + (parseInt(elem2.css("height").slice(0, -2))/2);

                var hypotenuse = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
                var angle = Math.atan2((y1-y2), (x1-x2)) *  (180/Math.PI);
                console.log(hypotenuse, angle);

                if(angle >= 90 && angle < 180){
                    y1 = y1 - (y1-y2);
                }
                if(angle > 0 && angle < 90){
                    x1 = x1 - (x1-x2);
                    y1 = y1 - (y1-y2);
                }
                if(angle <= 0 && angle > -90){
                    x1 = x1 - (x1-x2);
                }

                $("#" + line_id).queue(function(){
                    $(this).offset({top: y1, left: x1});
                    $(this).dequeue();
                }).queue(function(){
                    $(this).width(hypotenuse);
                    $(this).dequeue();
                }).queue(function(){
                    $(this).rotate(angle);
                    $(this).dequeue();
                });

            }

        });

    }

}
