from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
import uuid

import sys


@application.route("/change_image_imageLink/<pageID>/<user_id>", methods=['POST'])
def change_image_imageLink(pageID, user_id):

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("change image in imageLink", file=sys.stderr)

    ### add the image to uploads

    Request = request.form
    print(Request, file=sys.stderr)

    imageLink_id = Request.get('imageLink_id')
    file = request.files.get('file')
    print("printing the file", file=sys.stderr)
    print(imageLink_id, file, file=sys.stderr)
    # print(type(file))
    # print(dict(file))

    ### save the image

    type = file.filename[-4:]

    filename = file.filename
    filename = filename.replace(' ', '_')

    filename = '{}.{}'.format(str(uuid.uuid4()), filename.split('.')[-1])

    file.save(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + filename)

    ### keep the information that this image is in this page in the 'tags' many to many SQL table

    engine.execute("insert into Images (name, type) VALUES ( %(name)s, %(type)s )",
                   {'name': filename, 'type': type})

    image_id = engine.execute("SELECT id FROM Images ORDER BY id DESC LIMIT 1").fetchone()[0]
    print("image_id", file=sys.stderr)
    print(image_id, file=sys.stderr)

    engine.execute("insert into pages_images (page_id, image_id) VALUES ( %(page_id)s, %(image_id)s )",
                   {'page_id': pageID, 'image_id': image_id})

    ### open the XML

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    #find the note
    note = root.find("notes").find("note[@id='" + imageLink_id + "']")

    # set the note's x, y and content = "title" (for now)
    image = note.find('name')
    print(image, file=sys.stderr)

    image.text = str(filename)
    print(image, file=sys.stderr)
    etree.SubElement(note, "image_id").text = str(image_id)
    etree.SubElement(note, "width").text = "300"
    etree.SubElement(note, "height").text = "200"

    #print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"


