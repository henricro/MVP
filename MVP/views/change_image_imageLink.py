from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
import uuid

#import sys


@application.route("/change_image_imageLink/<pageID>/<user_id>", methods=['POST'])
def change_image_imageLink(pageID, user_id):

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("change image in imageLink", "yoyoyoyo")

    ### add the image to uploads

    Request = request.form
    print(Request, "yoyoyoyo")

    imageLink_id = Request.get('imageLink_id')
    file = request.files.get('file')
    print("printing the file", "yoyoyoyo")
    print(imageLink_id, file, "yoyoyoyo")
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
    print("image_id", "yoyoyoyo")
    print(image_id, "yoyoyoyo")

#    engine.execute("insert into pages_images (page_id, image_id) VALUES ( %(page_id)s, %(image_id)s )",
#                   {'page_id': pageID, 'image_id': image_id})

    ### open the XML

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    #find the note
    note = root.find("notes").find("note[@id='" + imageLink_id + "']")

    # set the note's x, y and content = "title" (for now)
    image = note.find('name')
    print(image, "yoyoyoyo")

    image.text = str(filename)
    print(image, "yoyoyoyo")
    etree.SubElement(note, "image_id").text = str(image_id)
    etree.SubElement(note, "width").text = "300"
    etree.SubElement(note, "height").text = "200"

    #print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"


