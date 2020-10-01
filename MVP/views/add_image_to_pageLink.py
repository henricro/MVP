from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree


@application.route("/add_image_to_pageLink/<pageID>/<user_id>", methods=['POST'])
def add_image_to_pageLink(pageID, user_id):
    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("add image to pageLink")

    ### add the image to uploads

    Request = request.form
    print(Request)

    pageLink_id = Request.get('pageLink_id')
    file = request.files.get('file')
    print("printing the file")
    print(pageLink_id, file)
    # print(type(file))
    # print(dict(file))

    ### save the image

    type = file.filename[-4:]

    filename = file.filename
    filename = filename.replace(' ', '_')

    file.save(application.config['UPLOADED_PATH'] + filename)

    ### keep the information that this image is in this page in the 'tags' many to many SQL table

    engine.execute("insert into Images (name, type) VALUES ( %(name)s, %(type)s )",
                   {'name': filename, 'type': type})

    image_id = engine.execute("SELECT id FROM Images ORDER BY id DESC LIMIT 1").fetchone()[0]
    print("image_id")
    print(image_id)

    engine.execute("insert into pages_images (page_id, image_id) VALUES ( %(page_id)s, %(image_id)s )",
                   {'page_id': pageID, 'image_id': image_id})

    ### open the XML

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    #find the note
    note = root.find("notes").find("note[@id='" + pageLink_id + "']")

    # set the note's x, y and content = "title" (for now)
    note.set("class", "imagePageLink")
    etree.SubElement(note, "image").text = str(filename)
    etree.SubElement(note, "image_id").text = str(image_id)
    etree.SubElement(note, "width").text = "100"
    etree.SubElement(note, "height").text = "50"

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"


