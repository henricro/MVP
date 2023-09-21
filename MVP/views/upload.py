from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from pdf2image import convert_from_path

import uuid
import os
from flask_login import LoginManager, UserMixin, current_user

from docx import Document

#import sys


@application.route("/upload_pdf/<pageID>/<user_id>", methods=['POST'])
@user_required()
def upload_pdf(pageID, user_id):

    if str(current_user.id) == user_id:

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        print("upload pdf route")

        Request = request.form
        #print(Request)

        x = Request.get('x')
        y = Request.get('y')
        file = request.files.get('file')
        # print(x, y, file, "yoyoyoyo")
        # print(type(file))
        # print(dict(file))

        type = file.filename[-4:]

        filename = file.filename
        filename = filename.replace(' ', '_')
        print(filename)

        storage_name = '{}.{}'.format(str(uuid.uuid4()), filename.split('.')[-1])

        file.save(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + storage_name)

        print(filename, storage_name)

        ### add a note in the XML with the x, y positions and the name of the file

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        ### get the first page of the pdf as an image

        #pages = convert_from_path(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + storage_name, 500)
        #first_page = pages[0]
        #first_page.save(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + storage_name + ".first_page.jpg",
        #                'JPEG')

        # save the first page as jpeg in DB

        #engine.execute("insert into Images (name, type) VALUES ( %(name)s, %(type)s )",
         #              {'name': filename + ".first_page.jpg", 'type': ".jpg"})

        # save relationship between pdf and first page image in DB

        #image_id = engine.execute("SELECT id FROM Images ORDER BY id DESC LIMIT 1").fetchone()[0]
        #print("image_id", "yoyoyoyo")
        #print(image_id, "yoyoyoyo")

        #engine.execute("insert into pdfs_images (pdf_id, image_id) VALUES ( %(pdf_id)s, %(image_id)s )",
        #               {'pdf_id': pdf_id, 'image_id': image_id})

        # Extract ids and find the biggest id
        note_elements = tree.xpath('//note[not(@id="title" or @id="parents")]')
        biggest_id = 0
        for note in note_elements:
            id_attribute = note.get('id')
            if id_attribute is not None:
                current_id = int(id_attribute)
                biggest_id = max(biggest_id, current_id)

        id = str(biggest_id + 1)

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
        etree.SubElement(new_note, "storage_name").text = str(storage_name)
        etree.SubElement(new_note, "image").text = str(storage_name + ".first_page.jpg")
        etree.SubElement(new_note, "width").text = "100"
        etree.SubElement(new_note, "height").text = "110"

        #print(etree.tostring(root, pretty_print=True))

        # save the changes in the xml

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"





@application.route("/upload_docx/<pageID>/<user_id>", methods=['POST'])
@user_required()
def upload_docx(pageID, user_id):

    if str(current_user.id) == user_id:

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        print("upload docx route")

        x = request.form.get('x')
        y = request.form.get('y')
        file = request.files.get('file')

        filename = file.filename
        filename = filename.replace(' ', '_')
        print(filename)

        storage_name = '{}.{}'.format(str(uuid.uuid4()), filename.split('.')[-1])

        file.save(os.path.join(application.config['USER_DATA_PATH'], user_id, 'uploads', storage_name))

        print(filename, storage_name)

        # Create a note in the XML file
        xml_path = os.path.join(application.config['USER_DATA_PATH'], user_id, 'pages', pageName + '.xml')
        tree = etree.parse(xml_path)
        root = tree.getroot()

        # Extract ids and find the biggest id
        note_elements = tree.xpath('//note[not(@id="title" or @id="parents")]')
        biggest_id = 0
        for note in note_elements:
            id_attribute = note.get('id')
            if id_attribute is not None:
                current_id = int(id_attribute)
                biggest_id = max(biggest_id, current_id)

        id = str(biggest_id + 1)

        # Add a note
        notes = root.find("notes")
        notes.append(etree.Element("note"))
        new_note = notes[-1]

        # Set the note's x, y, and content
        new_note.set("id", id)
        new_note.set("class", "docx")
        etree.SubElement(new_note, "x").text = x
        etree.SubElement(new_note, "y").text = y
        etree.SubElement(new_note, "name").text = str(filename)
        etree.SubElement(new_note, "storage_name").text = str(storage_name)
        etree.SubElement(new_note, "width").text = "100"
        etree.SubElement(new_note, "height").text = "100"

        # Save the changes in the XML
        with open(xml_path, 'wb') as xml_file:
            xml_file.write(etree.tostring(root, pretty_print=True))

        return "yo"





@application.route("/upload_xlsx/<pageID>/<user_id>", methods=['POST'])
@user_required()
def upload_xlsx(pageID, user_id):

    if str(current_user.id) == user_id:

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        print("upload xlsx route")

        x = request.form.get('x')
        y = request.form.get('y')
        file = request.files.get('file')

        filename = file.filename
        filename = filename.replace(' ', '_')
        print(filename)

        storage_name = '{}.{}'.format(str(uuid.uuid4()), filename.split('.')[-1])

        file.save(os.path.join(application.config['USER_DATA_PATH'], user_id, 'uploads', storage_name))

        print(filename, storage_name)

        # Create a note in the XML file
        xml_path = os.path.join(application.config['USER_DATA_PATH'], user_id, 'pages', pageName + '.xml')
        tree = etree.parse(xml_path)
        root = tree.getroot()

        # Extract ids and find the biggest id
        note_elements = tree.xpath('//note[not(@id="title" or @id="parents")]')
        biggest_id = 0
        for note in note_elements:
            id_attribute = note.get('id')
            if id_attribute is not None:
                current_id = int(id_attribute)
                biggest_id = max(biggest_id, current_id)

        id = str(biggest_id + 1)

        # Add a note
        notes = root.find("notes")
        notes.append(etree.Element("note"))
        new_note = notes[-1]

        # Set the note's x, y, and content
        new_note.set("id", id)
        new_note.set("class", "xlsx")
        etree.SubElement(new_note, "x").text = x
        etree.SubElement(new_note, "y").text = y
        etree.SubElement(new_note, "name").text = str(filename)
        etree.SubElement(new_note, "storage_name").text = str(storage_name)
        etree.SubElement(new_note, "width").text = "100"
        etree.SubElement(new_note, "height").text = "100"

        # Save the changes in the XML
        with open(xml_path, 'wb') as xml_file:
            xml_file.write(etree.tostring(root, pretty_print=True))

        return "yo"

