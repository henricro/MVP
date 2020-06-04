
///////////////////////////////////////////////////
/////////////    SET THE TITLE   //////////////////
///////////////////////////////////////////////////

note = $(".title");

id = note.attr("id");

console.log(id);

var XMLnote = xmlDoc.getElementById(id);
console.log(XMLnote);
var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;


    //console.log("print elmnt");
    //console.log(elmnt);
note.css("position","absolute");
note.css("top",y.concat("px"));
note.css("left",x.concat("px"));
note.html(title);

$(".title").addClass("title");

$('.title').bind('click.select', function(){
    selectNote($(this));
});

$('.title').bind('dblclick.write', function(){
    writeNote($(this));
});