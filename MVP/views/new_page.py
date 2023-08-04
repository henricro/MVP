from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

#import sys

@application.route("/new_page/<page_id>/<user_id>", methods=['POST'])
def new_page(page_id, user_id):

#    print("route : new page")
#    print(page_id)

    request_data = request.get_json()
    x = str(request_data.get('new_x'))
    y = str(request_data.get('new_y'))
    title = str(request_data.get('title'))
    title = title.replace("'", "\\'")

    # create new page in DB
    engine.execute("insert into Pages (user_id, title) VALUES (%s, %s)", (user_id, title))
    # get the newly created id
    new_page_id = Page.query.all()[-1].id
    print("new page id : ", new_page_id)

    # ajouter relation parent-enfant dans la DB
    engine.execute(
        "insert into parents "
        "(parent_page_id, child_page_id) "
        "VALUES ( %(page_id)s, %(new_page_id)s )",
        {'page_id': page_id, 'new_page_id': new_page_id}
    )

    # create new xml page
    newPageName = 'Page_' + str(new_page_id)

    tree = etree.parse(application.config['TEMPLATES_PATH'] + 'newPage.xml')
    root = tree.getroot()

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + newPageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    # create link to new page on current page

    page_id = str(page_id)
    pageName = 'Page_' + page_id

    # open current page XML
    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    # Extract ids and find the biggest id
    note_elements = tree.xpath('//note[not(@id="title" or @id="parents")]')
    biggest_id = 0
    for note in note_elements:
        id_attribute = note.get('id')
        print(id_attribute)
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
    new_note.set("class", "pageLink")
    new_note.set("pageID", str(new_page_id))
    etree.SubElement(new_note, "x").text = x
    etree.SubElement(new_note, "y").text = y
    etree.SubElement(new_note, "content").text = title

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"

