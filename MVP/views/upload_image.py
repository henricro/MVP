from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree



@application.route("/upload_image/<pageID>", methods=['POST'])
def upload_image(pageID):
    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("upload image route")

    ### add the image to uploads

    Request = request.form
    print(Request)

    x = Request.get('x')
    y = Request.get('y')
    file = request.files.get('file')
    print(x, y, file)
    # print(type(file))
    # print(dict(file))

    print(file.content_length)

    type = file.filename[-4:]

    file.save("/Users/macbook/PycharmProjects/MVP/MVP/static/uploads/" + file.filename)

    ### keep the information that this file is in this page in the 'tags' many to many SQL table

    engine.execute("insert into Images (name, type) VALUES ( %(name)s, %(type)s )",
                   {'name': file.filename, 'type': type})

    image_id = engine.execute("SELECT id FROM Images ORDER BY id DESC LIMIT 1").fetchone()[0]
    print("image_id")
    print(image_id)

    engine.execute("insert into pages_images (page_id, image_id) VALUES ( %(page_id)s, %(image_id)s )",
                   {'page_id': pageID, 'image_id': image_id})

    ### add a note in the XML with the x, y positions and the name of the file

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
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
    etree.SubElement(new_note, "name").text = str(file.filename)
    etree.SubElement(new_note, "image_id").text = str(image_id)
    width = etree.Element('width')
    height = etree.Element('height')
    new_note.insert(0, height)
    new_note.insert(0, width)

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    pass

