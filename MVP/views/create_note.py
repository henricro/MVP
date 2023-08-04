from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

#import sys

@application.route("/create_note/<pageID>/<user_id>", methods=['POST'])
def create_note(pageID, user_id):

    # get the data for new note
    request_data = request.get_json()
    new_x = str(request_data.get('x'))
    new_y = str(request_data.get('y'))

    pageID = str(pageID)
    pageName = 'Page_' + pageID

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

    # set the note's x, y and content = "new note"
    new_note.set("id", id)
    new_note.set("class", "note")
    etree.SubElement(new_note, "x").text = new_x
    etree.SubElement(new_note, "y").text = new_y
    etree.SubElement(new_note, "content").text = "new content"

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"
