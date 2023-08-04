/////////////////////////////////////
////////   STYLE STUFF  /////////////
/////////////////////////////////////

function styleSelect(note) {

    note.css({"border-color" : "green"});

    note_class = note.attr("class");
    console.log("styling something", note_class);

    if (note_class == "pageLink") {
        note.css({"text-decoration" : "underline"});
        note.css({"text-decoration-color" : "green"});
    }
    if (note_class == "imagePageLink") {
        note.find(".imagePageLink_name").css({"text-decoration" : "underline"});
        note.find(".imagePageLink_name").css({"text-decoration-color" : "green"});
    }
    if (note_class == "image") {
        note.css({"border-style" : "solid"});
        note.css({"border-width" : "1px"});
        note.find(".image_img").css({"opacity": "0.5"});
    }
    if (note_class == "pdf") {
        console.log("style pdf");
        note.css({"border-style" : "solid"});
        note.css({"border-width" : "1px"});
        note.find(".pdf_img").css({"opacity": "0.5"});
    }

}

function styleDefault(note) {

    console.log("style default");

    note.css({"border-color" : "rgb(0, 0, 0, 0)"});
    note_class = note.attr("class");

    if (note_class == "pageLink") {
        note.css({"text-decoration" : "none"});
    }
    if (note_class == "pageLink") {
        note.find("imagePageLink_name").css({"text-decoration" : "none"});
    }
    if (note_class == "image") {
        note.css({"border-width" : "0px"});
        note.find(".image_img").css({"opacity": "1"});
    }
    if (note_class == "pdf") {
        console.log("style pdf");
        note.css({"border-width" : "Opx"});
        note.find(".pdf_img").css({"opacity": "1"});
    }

}


