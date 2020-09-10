from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

@application.route("/move_note/<pageID>", methods=['POST'])
def move_note(pageID):

    # get the data of note to move and page to move to
    request_data = request.get_json()
    note_id = str(request_data.get('note_id'))
    page_id = str(request_data.get('page_id'))

    print(page_id, note_id)

    pageID = str(pageID)
    print(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['STATIC_PATH'] + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + note_id + "']")

    print(etree.tostring(note, pretty_print=True))

    note.getparent().remove(note)

    # save the changes in the xml
    f = open(application.config['STATIC_PATH'] + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    destPageName = 'Page_' + page_id
    tree = etree.parse(application.config['STATIC_PATH'] + destPageName + '.xml')
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(note)

    # set the note's x, y and content = "new note"
    note.set("id", id)

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml
    f = open(application.config['STATIC_PATH'] + destPageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"



@application.route("/move_notes/<pageID>", methods=['POST'])
def move_notes(pageID):

    print("route : move notes")

    # get the data of notes to move and page to move to

    request_data = request.get_json()
    selection = request_data.get('selection')
    page_id = str(request_data.get('page_id'))

    print(page_id, selection)

    pageID = str(pageID)
    print(pageID)
    pageName = 'Page_' + pageID

    destPageName = 'Page_' + page_id


    for note_id in selection :

        tree = etree.parse(application.config['STATIC_PATH'] + pageName + ".xml")
        root = tree.getroot()

        note_id = str(note_id)
        print(note_id)

        note = root.find("notes").find("note[@id='" + note_id + "']")

        print(note)

        note.getparent().remove(note)

        # save the changes in the xml
        f = open(application.config['STATIC_PATH'] + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        tree = etree.parse(application.config['STATIC_PATH'] + destPageName + '.xml')
        root = tree.getroot()

        # get the biggest id in the xml and increment the value
        id = tree.xpath("/canvas/meta/biggest_id")[0].text
        id = int(id) + 1
        id = str(id)
        tree.xpath("/canvas/meta/biggest_id")[0].text = id

        # add a note
        notes = root.find("notes")
        notes.append(note)

        # set the note's x, y and content = "new note"
        note.set("id", id)

        print(etree.tostring(root, pretty_print=True))

        # save the changes in the xml
        f = open(application.config['STATIC_PATH'] + destPageName + '.xml', 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

    return "yo"




