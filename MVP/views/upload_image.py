from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
import uuid
import os
#import sys

@application.route("/upload_image/<pageID>/<user_id>", methods=['POST'])
def upload_image(pageID, user_id):
    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("upload image route", "yoyoyoyo")

    ### add the image to uploads

    Request = request.form
    print(Request, "yoyoyoyo")

    x = Request.get('x')
    y = Request.get('y')
    file = request.files.get('file')
    print(x, y, file, "yoyoyoyo")
    # print(type(file))
    # print(dict(file))

    print(file.content_length, "yoyoyoyo")

    filename = file.filename
    filename = filename.replace(' ', '_')

    filename = '{}.{}'.format(str(uuid.uuid4()), filename.split('.')[-1])

    type = file.filename[-4:]

    if type ==".png" or type ==".jpg" or type =="jpeg" :
        pass
    else :
        filename = filename + '.png'

    print(filename, "yoyoyoyo")

    file.save(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + filename)

    ### keep the information that this file is in this page in the 'tags' many to many SQL table

    engine.execute("insert into Images (name, type) VALUES ( %(name)s, %(type)s )",
                   {'name': filename, 'type': type})

    image_id = engine.execute("SELECT id FROM Images ORDER BY id DESC LIMIT 1").fetchone()[0]
    print("image_id", "yoyoyoyo")
    print(image_id, "yoyoyoyo")

    engine.execute("insert into pages_images (page_id, image_id) VALUES ( %(page_id)s, %(image_id)s )",
                   {'page_id': pageID, 'image_id': image_id})

    ### add a note in the XML with the x, y positions and the name of the file

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # set the note's x, y and content = "title" (for now)
    new_note.set("id", id)
    new_note.set("class", "image")
    etree.SubElement(new_note, "x").text = x
    etree.SubElement(new_note, "y").text = y
    etree.SubElement(new_note, "width").text = "300"
    etree.SubElement(new_note, "height").text = "200"
    etree.SubElement(new_note, "name").text = str(filename)
    etree.SubElement(new_note, "image_id").text = str(image_id)


    #print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"

