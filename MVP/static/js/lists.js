////////////////////////////////////////////////
/////////// BUILD THE TO DO LISTS //////////////
////////////////////////////////////////////////
$('.to-do-list').each(function(){
    createToDoList($(this));
});

function createToDoList(note) {

    id = note.attr("id");

    //console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    //console.log(XMLnote);

    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;
    note.css("top", y.concat("px"));
    note.css("left", x.concat("px"));
    var elements = XMLnote.getElementsByTagName("element")

    console.log(XMLnote);
    console.log(elements);
    console.log(elements.length);

    note.append("<ul></ul>");
    list = note.find("ul");

    for (var i = 0; i < elements.length; i++){

        var element = elements[i]
        console.log(element)
        var content = element.getElementsByTagName("content")[0].childNodes[0].nodeValue;
        console.log(content);
        var clasis = element.getAttribute("class");

        if (clasis == "done") {
            list.append("<li style='color:green'>" + content+ "</li>");
        } else if (clasis == "ongoing") {
            list.append("<li style='color:orange'>" + content+ "</li>");
        } else if (clasis == "to-do") {
            list.append("<li style='color:red'>" + content+ "</li>");
        }

    }

}
