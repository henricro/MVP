from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
import uuid
import os
#import sys
from flask_login import LoginManager, UserMixin, current_user

@application.route("/upload_image/<pageID>/<user_id>", methods=['POST'])
@user_required()
def upload_image(pageID, user_id):

    if str(current_user.id) == user_id:

        #print("upload image route")

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        Request = request.form
        x = Request.get('x')
        y = Request.get('y')
        file = request.files.get('file')
        filename = file.filename
        filename = filename.replace(' ', '_')

        storage_name = '{}.{}'.format(str(uuid.uuid4()), filename.split('.')[-1])

        #print(filename)
        #print(storage_name)

        type = file.filename[-4:]

        if type ==".png" or type ==".jpg" or type =="jpeg" :
            pass
        else :
            filename = filename + '.png'

        file.save(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + storage_name)

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        # Extract ids and find the biggest id
        note_elements = tree.xpath('//note[not(@id="title" or @id="parents")]')
        biggest_id = 0
        for note in note_elements:
            id_attribute = note.get('id')
            if id_attribute is not None:
                current_id = int(id_attribute)
                biggest_id = max(biggest_id, current_id)

        id = str(biggest_id+1)

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
        etree.SubElement(new_note, "file_name").text = str(filename)
        etree.SubElement(new_note, "name").text = str(storage_name)


        ##print(etree.tostring(root, pretty_print=True))

        # save the changes in the xml

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"

