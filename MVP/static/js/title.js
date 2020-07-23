
///////////////////////////////////////////////////
/////////////    SET THE TITLE   //////////////////
///////////////////////////////////////////////////


/////////  the title  /////////

$('#title_title').html(title);

noteTitle = $("#title");

var XMLnote = xmlDoc.getElementById("title");
console.log(XMLnote);
var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

console.log(x,y);
console.log(noteTitle);

noteTitle.css("top",y.concat("px"));
noteTitle.css("left",x.concat("px"));

///////////  the parents  //////////

noteParents = $("#title_parents");

var XMLnote = xmlDoc.getElementById("parents");
var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
var width = XMLnote.getElementsByTagName("width")[0].childNodes[0].nodeValue;
var height = XMLnote.getElementsByTagName("height")[0].childNodes[0].nodeValue;

noteParents.css("top",y.concat("px"));
noteParents.css("left",x.concat("px"));
noteParents.css("width",width.concat("px"));
noteParents.css("height",height.concat("px"));



$('#title_title').bind('click.select', function(){
    selectNote($(this));
});

$('#title_title').bind('dblclick.write', function(){
    writeNote($(this));
});


///////////////////////////////
/////// SHOW PARENTS  /////////
///////////////////////////////


$(function() {

      "use strict";

      $.contextMenu({
        selector: '#title',
        callback: function(key, options) {

          if (key === 'showParents') {

            $("#title_parents").show();

            $("#title").unbind('mousedown.drag');

            $("#title_parents").bind('mousedown.drag', function(){
                note = $(this);
                mouseX = event.pageX;
                mouseY = event.pageY;
                noteX = parseInt(note.css("left").slice(0, -2));
                noteY = parseInt(note.css("top").slice(0, -2));
                dragFunc(note, noteX, noteY);
            });

            $("#title_parents").bind('click.resize', function() {
                resize($(this));
                $(this).unbind('mousedown.drag');
                $(this).bind('click.move', function() {
                    move($(this));
                });
            });

            function resize(note){
                note.css("border", "1px solid green");
                note.addClass('resizable');
            }

            function move(note){
                note.removeClass('resizable');
                note.css("border", "1px dashed green");
                note.bind('mousedown.drag', function(){
                    mouseX = event.pageX;
                    mouseY = event.pageY;
                    noteX = parseInt(note.css("left").slice(0, -2));
                    noteY = parseInt(note.css("top").slice(0, -2));
                    dragFunc(note, noteX, noteY);
                });
                note.bind('click.resize', function(){
                    resize(note);
                });
            }

            $(document).bind('click.hideParents', function(){
                $(document).bind('click.hideParents2', function(){
                    if (!$("#title_parents").is(event.target) && $("#title_parents").has(event.target).length === 0){
                        console.log("clicked outside of parent space");
                        $("#title_parents").hide();
                        $(document).unbind('click.hideParents2');
                        $(document).unbind('click.hideParents');
                        $("#title_parents").removeClass('resizable');

                        $("#title").bind('mousedown.drag', function(){

                            note= $(this);

                            mouseX = event.pageX;
                            mouseY = event.pageY;

                            noteX = parseInt(note.css("left").slice(0, -2));
                            noteY = parseInt(note.css("top").slice(0, -2));

                            dragFunc(note, noteX, noteY);

                        });

                    } else {
                        console.log("clicked in parent space");
                    }
                });
            });

          }
        },

        items: {
          'showParents': {
            name: "Show Parents",
            icon: "fa-sitemap"
          }
        }

      });

});

