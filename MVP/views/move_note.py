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

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + note_id + "']")

    print(etree.tostring(note, pretty_print=True))

    note.getparent().remove(note)

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    destPageName = 'Page_' + page_id
    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml')
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
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    pass



