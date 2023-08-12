/////////////////////////////////////
////////   STYLE STUFF  /////////////
/////////////////////////////////////

function styleSelect(note) {

    note.css({"border-color" : "#4ba82d #fe9f66 #fe9f66 #4ba82d"});

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
        note.css({"border-width" : "1px"});
        note.find(".image_img").css({"opacity": "0.5"});
    }
    if (note_class == "pdf") {
        console.log("style pdf");
        note.css({"border-style" : "solid"});
        note.css({"border-width" : "1px"});
        note.find(".pdf_img").css({"opacity": "0.5"});
    }
    if (note_class == "docx") {
        console.log("style docx");
        note.css({"border-style" : "solid"});
        note.css({"border-width" : "1px"});
        note.find(".docx_img").css({"opacity": "0.7"});
    }
    if (note_class == "xlsx") {
        console.log("style xlsx");
        note.css({"border-style" : "solid"});
        note.css({"border-width" : "1px"});
        note.find(".xlsx_img").css({"opacity": "0.7"});
    }
    if (note_class == "imageLink") {
        note.css({"border-style" : "solid"});
        note.css({"border-width" : "1px"});
        note.find(".imageLink_img").css({"opacity": "1"});
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
        note.find("pageLink_name").css({"text-decoration" : "none"});
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
    if (note_class == "docx") {
        console.log("style docx");
        note.css({"border-width" : "Opx"});
        note.find(".docx_img").css({"opacity": "1"});
    }
    if (note_class == "xlsx") {
        console.log("style xlsx");
        note.css({"border-width" : "Opx"});
        note.find(".docx_img").css({"opacity": "1"});
    }
    if (note_class == "imagePageLink") {
        note.find("imagePageLink_name").css({"text-decoration" : "none"});
    }
    if (note_class == "imageLink") {
        note.css({"border-width" : "0px"});
        note.find(".imageLink_img").css({"opacity": "0.5"});
    }

}


