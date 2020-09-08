from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree



@application.route("/delete_note/<pageID>", methods=['POST'])
def delete_note(pageID):
    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    print(id)

    pageID = str(pageID)
    print(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    noteClass = note.get("class")

    print(etree.tostring(note, pretty_print=True))

    note.getparent().remove(note)
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    if noteClass == "pageLink" or noteClass  =="imagePageLink" :

        type = note.get("type")
        destPageID = note.get("pageID")
        destPageName = 'Page_' + destPageID

        if type =="child" :

            destTree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml')
            destRoot = destTree.getroot()
            note = destRoot.find("notes").find("note[@pageID='" + pageID + "']")
            note.getparent().remove(note)
            f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml', 'wb')
            f.write(etree.tostring(destRoot, pretty_print=True))
            f.close()
            # engine.execute("delete from parents where parent_page_id = %(pageID)s and child_page_id = %(destPageID)s ",
             #              {'pageID': pageID, 'destPageID': destPageID})
        if type =="parent" :

            destTree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml')
            destRoot = destTree.getroot()
            note = destRoot.find("notes").find("note[@pageID='" + pageID + "']")
            note.getparent().remove(note)
            f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml', 'wb')
            f.write(etree.tostring(destRoot, pretty_print=True))
            f.close()
            # engine.execute("delete from parents where parent_page_id = %(destPageID)s and child_page_id = %(pageID)s ",
             #              {'pageID': pageID, 'destPageID': destPageID})
        if type =="visitor" :
            return "yo"
            # engine.execute("delete from visitors where visitor_page_id = %(destPageID)s and visited_page_id = %(pageID)s ",
             #              {'pageID': pageID, 'destPageID': destPageID})




@application.route("/delete_notes/<pageID>", methods=['POST'])
def delete_notes(pageID):

    print("route : delete notes")

    # get the data for new note
    request_data = request.get_json()
    selection = request_data.get('selection')
    selection = selection.split(",")

    print(selection)

    pageID = str(pageID)
    print(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    for id in selection :

        note = root.find("notes").find("note[@id='" + id + "']")

        note.getparent().remove(note)

        # save the changes in the xml
        f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

    return "yo"



