from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree


@application.route("/new_to_do_list/<pageID>/<user_id>", methods=['POST'])
def new_to_do_list(pageID, user_id):

    print("route add list")

    request_data = request.get_json()
    x = str(request_data.get('x'))
    y = str(request_data.get('y'))

    pageID = str(pageID)
    pageName = 'Page_' + pageID

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

    # set the note's x, y and first elements
    new_note.set("id", id)
    new_note.set("class", "to-do-list")
    etree.SubElement(new_note, "x").text = x
    etree.SubElement(new_note, "y").text = y

    new_note.append(etree.Element("element"))
    new_element = new_note[-1]
    new_element.set("class", "done")
    etree.SubElement(new_element, "content").text = "yo"

    new_note.append(etree.Element("element"))
    new_element = new_note[-1]
    new_element.set("class", "ongoing")
    etree.SubElement(new_element, "content").text = "hola"

    new_note.append(etree.Element("element"))
    new_element = new_note[-1]
    new_element.set("class", "to-do")
    etree.SubElement(new_element, "content").text = "wesh"

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"