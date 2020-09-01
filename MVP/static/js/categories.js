//////////////////////////////////////////////////
///////////// BUILD THE CATEGORIES ///////////////
//////////////////////////////////////////////////

$('.category').each(function(){
    createCategory($(this));
});

function createCategory(note) {

    id = note.attr("id");

    console.log(id);

    var XMLnote = xmlDoc.getElementById(id);
    console.log(XMLnote);

    var x = XMLnote.getElementsByTagName("x")[0].childNodes[0].nodeValue;
    var y = XMLnote.getElementsByTagName("y")[0].childNodes[0].nodeValue;

    var name = XMLnote.getElementsByTagName("name")[0].childNodes[0].nodeValue;

    var criteria_id = XMLnote.getElementsByTagName("criteria_id")[0].childNodes[0].nodeValue;

    //console.log("print elmnt");
    //console.log(elmnt);

    var criteriaNote = $('#'+str(criteria_id))

    note.css("top",y.concat("px"));
    note.css("left",x.concat("px"));

    var category = '<div class="category"'

    note.append(criteria_name);
    note.append(criteria_categories);

    categories = note.find(".criteria_categories")
    categories.css("width", width);
    categories.css("height", height);
    categories.css("left", "-100px");

    crit_name = note.find(".criteria_name");

    if ( XMLnote.getElementsByTagName("css")[0] ){

        if ( XMLnote.getElementsByTagName("css")[0].childNodes[0] ){

            var css = XMLnote.getElementsByTagName("css")[0].childNodes[0].nodeValue;

            crit_name.attr('style', css);

            note.attr('added_css', css);

        }

    }


}




