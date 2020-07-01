//////////////////////////////////////////
/////////////  DROP IMAGES ///////////////
//////////////////////////////////////////

$('*:not("div")').on(
    'dragover',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$('*:not("div")').on(
    'dragenter',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$('*:not("div")').on(
    'drop',
    function(e){
        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                /*UPLOAD FILES HERE*/

                file = e.originalEvent.dataTransfer.files[0];

                x = e.pageX;
                y = e.pageY;
                console.log("hehehehehehehehehhehe");
                console.log(file);
                var type = file['name'].slice(-4);
                console.log(type);

                var form_data = new FormData();
                form_data.append('file', file);
                form_data.append('x', x);
                form_data.append('y', y);

                if (type ==".png" || type ==".jpg") {

                    console.log("upload image ajax")

                    $.ajax({
                        type: 'POST',
                        url:  '/upload_image/'+pageID,
                        data: form_data,
                        contentType: false,
                        cache: false,
                        processData: false,
                        success: function (data) {
                            console.log("success");
                            window.location.href='/open_page/'+pageID;
                        },
                        error: function (error) {
                            console.log("problem");
                            window.location.href='/open_page/'+pageID;
                        }
                    });

                }

                if (type ==".pdf") {

                    console.log("upload pdf ajax")

                    $.ajax({
                        type: 'POST',
                        url:  '/upload_pdf/'+pageID,
                        data: form_data,
                        contentType: false,
                        cache: false,
                        processData: false,
                        success: function (data) {
                            console.log("success");
                            //window.location.href='/open_page/'+pageID;
                        },
                        error: function (error) {
                            console.log("problem");
                            //window.location.href='/open_page/'+pageID;
                        }
                    });

                }
            }
        }
    }
);



///////////////////////////////////////////////////////
/////////////  DROP IMAGES in DROP AREA ///////////////
//////////////////////////////////////////////////////

$('#drop-area').on(
    'dragover',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$('#drop-area').on(
    'dragenter',
    function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
)
$('#drop-area').on(
    'drop',
    function(e){
        if(e.originalEvent.dataTransfer){
            if(e.originalEvent.dataTransfer.files.length) {
                e.preventDefault();
                e.stopPropagation();
                /*UPLOAD FILES HERE*/

                file = e.originalEvent.dataTransfer.files[0];

                console.log("drop image in drop area");
                console.log(file);

                pageLink_id = $(this).attr("pageLink_id");

                var form_data = new FormData();
                form_data.append('file', file);
                form_data.append('pageLink_id', pageLink_id);

                $.ajax({
                    type: 'POST',
                    url:  '/add_image_to_pageLink/'+pageID,
                    data: form_data,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function (data) {
                        console.log("success");
                        //window.location.href='/open_page/'+pageID;
                    },
                    error: function (error) {
                        console.log("problem");
                        //window.location.href='/open_page/'+pageID;
                    }
                });

                modal.hide();


            }
        }
    }
);
