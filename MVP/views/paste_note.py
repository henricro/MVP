from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

@application.route("/paste_note/<pageID>", methods=['POST'])
def paste_note(pageID):

    print("paste note route")

    # get the data of note to move and page to move to

    request_data = request.get_json()
    originPageID = str(request_data.get('originPageID'))
    note_id = str(request_data.get('note_id'))
    x = request_data.get('x')
    y = request_data.get('y')

    print(originPageID, note_id, x, y)

    ## Get the note in the xml from the page where it was copied from
    originPageName = 'Page_' + originPageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + originPageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + note_id + "']")

    print("copied the note :")
    print(etree.tostring(note, pretty_print=True))

    ## Copy that note in the current page

    PageName = 'Page_' + pageID
    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml')
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(note)

    # change the note's id
    note.set("id", id)

    ## if info about position, input the position
    if x is None :
        print("we have no information about position so we do not input it")
        print("x :", x, " , y : ", y)
    else :
        print("we have no information about position so we do not input it")
        print("x :", x, " , y : ", y)
        tree.xpath("/canvas/notes/note[@id='" + id + "']/x")[0].text = x
        tree.xpath("/canvas/notes/note[@id='" + id + "']/y")[0].text = y

    print("added the note to current page's xml :")
    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()


    pass



