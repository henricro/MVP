from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user


@application.route("/new_to_do_list/<pageID>/<user_id>", methods=['POST'])
@user_required()
def new_to_do_list(pageID, user_id):

    if str(current_user.id) == user_id:

        print("route add to-do list")

        request_data = request.get_json()
        x = str(request_data.get('x'))
        y = str(request_data.get('y'))

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

        id = str(biggest_id + 1)

        # add a note
        notes = root.find("notes")
        notes.append(etree.Element("note"))
        new_note = notes[-1]

        # set the note's x, y and first elements
        new_note.set("id", id)
        new_note.set("class", "to-do-list")
        etree.SubElement(new_note, "x").text = x
        etree.SubElement(new_note, "y").text = y

        list_text = '<li class="done">do this</li><li class="to-do">do that</li>'
        new_note.text = list_text

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"



@application.route("/new_list/<pageID>/<user_id>", methods=['POST'])
@user_required()
def new_list(pageID, user_id):

    if str(current_user.id) == user_id:

        print("route create list")

        request_data = request.get_json()
        x = str(request_data.get('x'))
        y = str(request_data.get('y'))

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

        list_text = '<li>hey</li><li>ho</li>'
        new_note.text = list_text

        # set the note's x, y and first elements
        new_note.set("id", id)
        new_note.set("class", "list")
        etree.SubElement(new_note, "x").text = x
        etree.SubElement(new_note, "y").text = y

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"



@application.route("/update_list/<pageID>/<user_id>", methods=['POST'])
@user_required()
def update_list(pageID, user_id):

    if str(current_user.id) == user_id:

        print("update list")

        request_data = request.get_json()
        _id = str(request_data.get('id'))
        content = str(request_data.get('content'))
        content = content.replace("'", "\\'")

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        tree.xpath("/canvas/notes/note[@id='" + _id + "']")[0].text = content

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"

