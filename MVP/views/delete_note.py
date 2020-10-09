from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

import os
import sys

@application.route("/delete_note/<pageID>/<user_id>", methods=['POST'])
def delete_note(pageID, user_id):

    print( "route : delete note", file=sys.stderr)

    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    print(id, file=sys.stderr)

    pageID = str(pageID)
    print(pageID, file=sys.stderr)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    noteClass = note.get("class")

    print(etree.tostring(note, pretty_print=True), file=sys.stderr)

    note.getparent().remove(note)
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    connexions = root.find("connexions")

    if connexions is not None:

        test1 = tree.xpath("/canvas/connexions/connexion[ @id_1='" + id + "' ] ")
        test2 = tree.xpath("/canvas/connexions/connexion[ @id_2='" + id + "' ] ")

        print("test1, test2", file=sys.stderr)
        print(test1, test2, file=sys.stderr)

        if test1:
            line = test1[0]
            line.getparent().remove(line)

            # save the changes in the xml
            f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
            f.write(etree.tostring(root, pretty_print=True))
            f.close()

        elif test2:
            line = test2[0]
            line.getparent().remove(line)

            # save the changes in the xml
            f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
            f.write(etree.tostring(root, pretty_print=True))
            f.close()

    if noteClass == "pageLink" or noteClass  =="imagePageLink" :

        type = note.get("type")
        destPageID = note.get("pageID")
        destPageName = 'Page_' + destPageID

        if type =="child" :

            destTree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml")
            destRoot = destTree.getroot()
            note = destRoot.find("notes").find("note[@pageID='" + pageID + "']")
            note.getparent().remove(note)
            f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml", 'wb')
            f.write(etree.tostring(destRoot, pretty_print=True))
            f.close()
            # engine.execute("delete from parents where parent_page_id = %(pageID)s and child_page_id = %(destPageID)s ",
             #              {'pageID': pageID, 'destPageID': destPageID})
        if type =="parent" :

            destTree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml")
            destRoot = destTree.getroot()
            note = destRoot.find("notes").find("note[@pageID='" + pageID + "']")
            note.getparent().remove(note)
            f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml", 'wb')
            f.write(etree.tostring(destRoot, pretty_print=True))
            f.close()
            # engine.execute("delete from parents where parent_page_id = %(destPageID)s and child_page_id = %(pageID)s ",
             #              {'pageID': pageID, 'destPageID': destPageID})
        if type =="visitor" :
            return "yo"
            # engine.execute("delete from visitors where visitor_page_id = %(destPageID)s and visited_page_id = %(pageID)s ",
             #              {'pageID': pageID, 'destPageID': destPageID})




@application.route("/delete_notes/<pageID>/<user_id>", methods=['POST'])
def delete_notes(pageID, user_id):

    print("route : delete notes", file=sys.stderr)

    # get the data for new note
    request_data = request.get_json()
    selection = request_data.get('selection')
    selection = selection.split(",")

    print(selection, file=sys.stderr)

    pageID = str(pageID)
    print(pageID, file=sys.stderr)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    for id in selection :

        note = root.find("notes").find("note[@id='" + id + "']")

        noteClass = note.get("class")

        note.getparent().remove(note)

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        connexions = root.find("connexions")

        if connexions is not None:

            test1 = tree.xpath("/canvas/connexions/connexion[ @id_1='" + id + "' ] ")
            test2 = tree.xpath("/canvas/connexions/connexion[ @id_2='" + id + "' ] ")

            print("test1, test2", file=sys.stderr)
            print(test1, test2, file=sys.stderr)

            if test1:
                line = test1[0]
                line.getparent().remove(line)

                # save the changes in the xml
                f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
                f.write(etree.tostring(root, pretty_print=True))
                f.close()

            elif test2:
                line = test2[0]
                line.getparent().remove(line)

                # save the changes in the xml
                f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
                f.write(etree.tostring(root, pretty_print=True))
                f.close()

        if noteClass == "pageLink" or noteClass == "imagePageLink":

            type = note.get("type")
            destPageID = note.get("pageID")
            destPageName = 'Page_' + destPageID

            if type == "child":
                destTree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml")
                destRoot = destTree.getroot()
                note = destRoot.find("notes").find("note[@pageID='" + pageID + "']")
                note.getparent().remove(note)
                f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml", 'wb')
                f.write(etree.tostring(destRoot, pretty_print=True))
                f.close()
                # engine.execute("delete from parents where parent_page_id = %(pageID)s and child_page_id = %(destPageID)s ",
                #              {'pageID': pageID, 'destPageID': destPageID})
            if type == "parent":
                destTree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml")
                destRoot = destTree.getroot()
                note = destRoot.find("notes").find("note[@pageID='" + pageID + "']")
                note.getparent().remove(note)
                f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml", 'wb')
                f.write(etree.tostring(destRoot, pretty_print=True))
                f.close()
                # engine.execute("delete from parents where parent_page_id = %(destPageID)s and child_page_id = %(pageID)s ",
                #              {'pageID': pageID, 'destPageID': destPageID})
            if type == "visitor":
                return "yo"
                # engine.execute("delete from visitors where visitor_page_id = %(destPageID)s and visited_page_id = %(pageID)s ",
                #              {'pageID': pageID, 'destPageID': destPageID})

    return "yo"



