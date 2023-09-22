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
    if (note_class == "noteLink") {
        noteLink_link = note.find('.noteLink_link');
        noteLink_link.show();
        noteLink_link.css("opacity", 1);
        noteLink_link.css("font-size", "20px");
        content = note.find('.noteLink_content');
        content.css("opacity", 0.15);
        favicon = note.find('.noteLink_favicon');
        favicon.css("opacity", 1);
        favicon.css("width", "40px");
        favicon.css("height", "40px");
        favicon.css("bottom", "32px");
        favicon.css("right", "-32px");
    }
    if (note_class == "imagePageLink") {
        note.find(".imagePageLink_name").css({"text-decoration" : "underline"});
    }
    if (note_class == "image") {
        note.css({"border-width" : "1px"});
        note.find(".image_img").css({"opacity": "0.5"});
    }
    if (note_class == "youtube") {
        console.log("style youtube");
        note.css({"border-width" : "1px"});
    }
    if (note_class == "pdf") {
        console.log("style pdf");
        note.css({"border-width" : "1px"});
    }
    if (note_class == "docx") {
        console.log("style docx");
        note.css({"border-width" : "1px"});
    }
    if (note_class == "xlsx") {
        console.log("style xlsx");
        note.css({"border-width" : "1px"});
    }
    if (note_class.includes("imageLink")) {
        note.css({"border-style" : "solid"});
        note.css({"border-width" : "1px"});
        note.find(".imageLink_img").css({"opacity": "0.5"});
    }

}

function styleDefault(note) {

    console.log("style default");

    note.css({"border-color" : "rgb(0, 0, 0, 0)"});
    note_class = note.attr("class");
    console.log(note_class);

    if (note_class == "pageLink") {
        note.css({"text-decoration" : "none"});
    }
    if (note_class == "noteLink") {
        noteLink_link.css("opacity", 0);
        noteLink_link.css("font-size", "15px");
        favicon.css("opacity", 0.7);
        favicon.css("width", "23px");
        favicon.css("height", "23px");
        favicon.css("bottom", "-7px");
        favicon.css("right", "-10px");
        content.css("opacity", 1);
        note.css({"cursor":""});
    }
    if (note_class.includes("imagePageLink")) {
        console.log("ozihodzihdzihdz");
        note.find(".imagePageLink_name").css({"text-decoration" : "none"});
    }
    if (note_class.includes("image")) {
        console.log("back to ;style default image")
        note.css({"border-width" : "0px"});
        note.find(".image_img").css({"opacity": "1"});
    }
    if (note_class.includes("youtube")) {
        console.log("style youtube");
        note.css({"border-width" : "Opx"});
    }
    if (note_class.includes("pdf")) {
        console.log("style pdf");
        note.css({"border-width" : "Opx"});
    }
    if (note_class.includes("docx")) {
        console.log("style docx");
        note.css({"border-width" : "Opx"});
    }
    if (note_class.includes("xlsx")) {
        console.log("style xlsx");
        note.css({"border-width" : "Opx"});
    }
    if (note_class.includes("imageLink")) {
        note.css({"border-width" : "0px"});
        note.find(".imageLink_img").css({"opacity": "1"});
    }

}


