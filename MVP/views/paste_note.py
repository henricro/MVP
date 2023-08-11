from MVP import application, db, engine
from MVP.models import *
import random

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

#import sys

@application.route("/paste_note/<pageID>/<user_id>", methods=['POST'])
def paste_note(pageID, user_id):

    print("paste note route")

    request_data = request.get_json()
    originPageID = str(request_data.get('originPageID'))
    note_id = str(request_data.get('note_id'))
    x = request_data.get('x')
    y = request_data.get('y')
    note_class = request_data.get('note_class')

    ## Get the note in the xml from the page where it was copied from
    originPageName = 'Page_' + originPageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + originPageName + ".xml")
    root = tree.getroot()

    note_to_copy = root.find("notes").find("note[@id='" + note_id + "']")
    print(note_to_copy)

    if note_class == "pageLink" or note_class == "imagePageLink" :

        destPage_id = note_to_copy.get('pageID')

        parent_id = Page.query.filter_by(id = pageID, user_id=user_id).first().global_id
        child_id = Page.query.filter_by(id = destPage_id, user_id=user_id).first().global_id

        #ajouter relation parent-enfant dans la DB
        engine.execute(
            "insert into page_links "
            "(parent_id, child_id) "
            "VALUES ( %(parent_id)s, %(child_id)s )",
            {'parent_id': parent_id, 'child_id': child_id}
        )


    ## Copy that note in the current page

    pageName = 'Page_' + pageID
    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    # Extract ids and find the biggest id
    note_elements = tree.xpath('//note[not(@id="title" or @id="parents")]')
    biggest_id = 0
    for note in note_elements:
        id_attribute = note.get('id')
        if id_attribute is not None:
            current_id = int(id_attribute)
            biggest_id = max(biggest_id, current_id)

    id = str(biggest_id + 1)

    copied_note = etree.Element(note_to_copy.tag, attrib=note_to_copy.attrib)
    for child_element in note_to_copy.iterchildren():
        new_element = etree.Element(child_element.tag, attrib=child_element.attrib)
        new_element.text = child_element.text
        copied_note.append(new_element)
    if note_to_copy.text :
        copied_note.text = note_to_copy.text

    copied_note.set("id", id)
    copied_note.find("x").text = x
    copied_note.find("y").text = y

    notes = root.find("notes")
    notes.append(copied_note)

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()


    return "yo"




@application.route("/paste_selection/<pageID>/<user_id>", methods=['POST'])
def paste_selection(pageID, user_id):

    print("paste selection route")

    # get the data of note to move and page to move to

    request_data = request.get_json()
    originPageID = str(request_data.get('originPageID'))
    selection = request_data.get('selection')
    originPageName = 'Page_' + originPageID

    originTree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + originPageName + ".xml")
    originRoot = originTree.getroot()

    selection = selection.split(',')

    destPageName = 'Page_' + pageID
    destTree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml")
    destRoot = destTree.getroot()

    for note_id in selection :

        note_id = str(note_id)

        ## Copy that note in the current page
        note_to_copy = originTree.xpath(f"//note[@id='{note_id}']")[0]

        # Extract ids and find the biggest id
        note_elements = destTree.xpath('//note[not(@id="title" or @id="parents")]')
        biggest_id = 0
        for note in note_elements:
            id_attribute = note.get('id')
            if id_attribute is not None:
                current_id = int(id_attribute)
                biggest_id = max(biggest_id, current_id)

        id = str(biggest_id + 1)

        copied_note = etree.Element(note_to_copy.tag, attrib=note_to_copy.attrib)
        for child_element in note_to_copy.iterchildren():
            new_element = etree.Element(child_element.tag, attrib=child_element.attrib)
            new_element.text = child_element.text
            copied_note.append(new_element)
        if note_to_copy.text:
            copied_note.text = note_to_copy.text

        copied_note.set("id", id)

        notes = destRoot.find("notes")
        notes.append(copied_note)

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml", 'wb')
        f.write(etree.tostring(destRoot, pretty_print=True))
        f.close()

    return "yo"


