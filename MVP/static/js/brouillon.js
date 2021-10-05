
            $('#selectBox').bind('contextmenu', function(event) {

                console.log("hohohoho");
                console.log(event.target);

                event.preventDefault();

                new_x = event.pageX;
                new_y = event.pageY;

                $("#selectionRCBox").css("left", new_x);
                $("#selectionRCBox").css("top", new_y);
                $("#selectionRCBox").show();

                $(document).click(function(){

                    if (!$("#selectionRCBox").is(event.target) && $("#selectionRCBox").has(event.target).length === 0){

                        $("#selectionRCBox").hide();
                        newPage();

                    }

                });

                //alignItems(selection);

            });
/*
                if (!$("#selectBox").is(event.target) && $("#selectBox").has(event.target).length === 0){

                    newPage();

                } else {

                    new_x = event.pageX;
                    new_y = event.pageY;

                    $("#selectionRCBox").css("left", new_x);
                    $("#selectionRCBox").css("top", new_y);
                    $("#selectionRCBox").show();

                    console.log("selection RC");

                }
*/
                //alignItems(selection);

