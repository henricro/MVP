from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree



@application.route("/to_do_list/<pageID>/<user_id>", methods=['POST'])
def to_do_list(pageID, user_id):

    print("route : to do list")

    request_data = request.get_json()
    new_x = str(request_data.get('new_x'))
    new_y = str(request_data.get('new_y'))
    print(new_x, new_y, "yoyoyoyo")

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    print(id, "yoyoyoyo")
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # set the note's x, y and content = "new note"
    new_note.set("id", id)
    new_note.set("class", "to_do_list")
    etree.SubElement(new_note, "x").text = new_x
    etree.SubElement(new_note, "y").text = new_y
    etree.SubElement(new_note, "width").text = "500"
    etree.SubElement(new_note, "height").text = "550"
    etree.SubElement(new_note, "name").text = criteria

    # print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"
