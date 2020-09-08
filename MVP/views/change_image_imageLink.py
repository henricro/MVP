from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree


@application.route("/change_image_imageLink/<pageID>", methods=['POST'])
def change_image_imageLink(pageID):

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("change image in imageLink")

    ### add the image to uploads

    Request = request.form
    print(Request)

    imageLink_id = Request.get('imageLink_id')
    file = request.files.get('file')
    print("printing the file")
    print(imageLink_id, file)
    # print(type(file))
    # print(dict(file))

    ### save the image

    type = file.filename[-4:]

    filename = file.filename
    filename = filename.replace(' ', '_')

    file.save("/Users/macbook/PycharmProjects/MVP/MVP/static/uploads/" + filename)

    ### keep the information that this image is in this page in the 'tags' many to many SQL table

    engine.execute("insert into Images (name, type) VALUES ( %(name)s, %(type)s )",
                   {'name': filename, 'type': type})

    image_id = engine.execute("SELECT id FROM Images ORDER BY id DESC LIMIT 1").fetchone()[0]
    print("image_id")
    print(image_id)

    engine.execute("insert into pages_images (page_id, image_id) VALUES ( %(page_id)s, %(image_id)s )",
                   {'page_id': pageID, 'image_id': image_id})

    ### open the XML

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    #find the note
    note = root.find("notes").find("note[@id='" + imageLink_id + "']")

    # set the note's x, y and content = "title" (for now)
    image = note.find('name')
    print(image)

    image.text = str(filename)
    print(image)
    etree.SubElement(note, "image_id").text = str(image_id)
    etree.SubElement(note, "width").text = "300"
    etree.SubElement(note, "height").text = "200"

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"


