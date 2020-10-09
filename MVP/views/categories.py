from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

import random


@application.route("/new_criteria/<pageID>/<user_id>", methods=['POST'])
def new_criteria(pageID, user_id):

    print("route : new criteria")

    request_data = request.get_json()
    new_x = str(request_data.get('new_x'))
    new_y = str(request_data.get('new_y'))
    criteria = str(request_data.get('criteria'))
    print(new_x, new_y, criteria)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    print(id)
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # set the note's x, y and content = "new note"
    new_note.set("id", id)
    new_note.set("class", "criteria")
    etree.SubElement(new_note, "x").text = new_x
    etree.SubElement(new_note, "y").text = new_y
    etree.SubElement(new_note, "width").text = "300"
    etree.SubElement(new_note, "height").text = "250"
    etree.SubElement(new_note, "name").text = criteria

    #print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"


@application.route("/add_category/<pageID>/<user_id>", methods=['POST'])
def add_category(pageID, user_id):

    print("route : add category")

    request_data = request.get_json()
    category = str(request_data.get('category'))
    criteria_id = str(request_data.get('criteria_id'))
    print(criteria_id, category)

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

    # set the note's x, y and content = "new note"
    new_note.set("id", id)
    new_note.set("class", "category")
    new_note.set("criteria_id", criteria_id)

    par_x = str(random.randint(0, 300))
    par_y = str(random.randint(0, 250))

    etree.SubElement(new_note, "x").text = par_x
    etree.SubElement(new_note, "y").text = par_y
    etree.SubElement(new_note, "name").text = category

    #print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"

