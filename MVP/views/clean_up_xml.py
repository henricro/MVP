from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

# go fetch the pages IDs in the DB

pages = engine.execute("select id from Pages").fecthall()

# for each ID go open the corresponding page in /static/user_data/users/pages









################

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
new_note.set("class", "note")
etree.SubElement(new_note, "x").text = new_x
etree.SubElement(new_note, "y").text = new_y
etree.SubElement(new_note, "content").text = "new content"

# print(etree.tostring