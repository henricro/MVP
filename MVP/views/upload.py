from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from pdf2image import convert_from_path

import uuid
import os


@application.route("/upload_pdf/<pageID>/<user_id>", methods=['POST'])
def upload_pdf(pageID, user_id):

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("upload pdf route")

    ### add the pdf to uploads

    Request = request.form
    print(Request)

    x = Request.get('x')
    y = Request.get('y')
    file = request.files.get('file')
    print(x, y, file)
    # print(type(file))
    # print(dict(file))

    type = file.filename[-4:]

    filename = file.filename
    filename = filename.replace(' ', '_')

    filename = '{}.{}'.format(str(uuid.uuid4()), filename.split('.')[-1])

    file.save(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + filename)

    ### keep the information that this file is in this page in the 'tags' many to many SQL table

    engine.execute("insert into Pdfs (name) VALUES ( %(name)s )",
                   {'name': file.filename})

    pdf_id = engine.execute("SELECT id FROM Pdfs ORDER BY id DESC LIMIT 1").fetchone()[0]
    print("pdf_id")
    print(pdf_id)

    engine.execute("insert into pages_pdfs (page_id, pdf_id) VALUES ( %(page_id)s, %(pdf_id)s )",
                   {'page_id': pageID, 'pdf_id': pdf_id})

    ### add a note in the XML with the x, y positions and the name of the file

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    ### get the first page of the pdf as an image

    pages = convert_from_path(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + filename, 500)
    first_page = pages[0]
    first_page.save(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + filename + ".first_page.jpg",
                    'JPEG')

    # save the first page as jpeg in DB

    engine.execute("insert into Images (name, type) VALUES ( %(name)s, %(type)s )",
                   {'name': filename + ".first_page.jpg", 'type': ".jpg"})

    # save relationship between pdf and first page image in DB

    image_id = engine.execute("SELECT id FROM Images ORDER BY id DESC LIMIT 1").fetchone()[0]
    print("image_id")
    print(image_id)

    engine.execute("insert into pdfs_images (pdf_id, image_id) VALUES ( %(pdf_id)s, %(image_id)s )",
                   {'pdf_id': pdf_id, 'image_id': image_id})

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
    new_note.set("class", "pdf")
    etree.SubElement(new_note, "x").text = x
    etree.SubElement(new_note, "y").text = y
    etree.SubElement(new_note, "name").text = str(filename)
    etree.SubElement(new_note, "image").text = str(filename + ".first_page.jpg")
    etree.SubElement(new_note, "pdf_id").text = str(pdf_id)
    etree.SubElement(new_note, "width").text = "100"
    etree.SubElement(new_note, "height").text = "150"

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"





@application.route("/upload_xlsx/<pageID>/<user_id>", methods=['POST'])
def upload_xlsx(pageID, user_id):

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("upload xlsx route")

    return "yo"
