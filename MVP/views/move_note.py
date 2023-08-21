from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
#import sys
from flask_login import LoginManager, UserMixin, current_user

@application.route("/move_note/<pageID>/<user_id>", methods=['POST'])
@user_required()
def move_note(pageID, user_id):

    if str(current_user.id) == user_id:

        print("route : move note to other page")

        # get the data of note to move and page to move to
        request_data = request.get_json()
        note_id = str(request_data.get('note_id'))
        page_id = str(request_data.get('page_id'))
        note_class = str(request_data.get('note_class'))
        print(page_id)

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        note_to_move = tree.xpath(f"//note[@id='{note_id}']")[0]
        note_to_move.getparent().remove(note_to_move)

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        destPageName = 'Page_' + page_id
        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml")
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

        copied_note = etree.Element(note_to_move.tag, attrib=note_to_move.attrib)
        for child_element in note_to_move.iterchildren():
            new_element = etree.Element(child_element.tag, attrib=child_element.attrib)
            new_element.text = child_element.text
            copied_note.append(new_element)

        copied_note.set("id", id)

        notes = root.find("notes")
        notes.append(copied_note)

        #print(etree.tostring(root, pretty_print=True))

        print(note_class)

        if note_class == "pageLink" or note_class == "imagePageLink" :

            print("note class is pageLink or imagePageLink")
            # destPage_id = page id de la pageLink qu'on bouge
            destPage_id = note_to_move.get('pageID')

            # pageID = page_id de la page sur laquelle on était : on veut qu'elle ne soit plus parent
            pageID = pageID

            # page_id = page_id de la page dans laquelle on la bouge
            page_id = page_id

            print("note_to_move's id : ", destPage_id)
            print("previos page's id : ", pageID)
            print("new page's id : ", page_id)

            prev_parent_id = Page.query.filter_by(id = pageID, user_id=user_id).first().global_id
            child_id = Page.query.filter_by(id = destPage_id, user_id=user_id).first().global_id
            new_parent_id = Page.query.filter_by(id = page_id, user_id=user_id).first().global_id

            # in any case : change the parent of destPage_id to page_id (it used to be pageID)
            # make the change in page_links

            engine.execute(
                "update page_links set "
                "parent_id = %(new_parent_id)s where "
                "parent_id = %(prev_parent_id)s and child_id = %(child_id)s",
                {'prev_parent_id': prev_parent_id, 'child_id': child_id, 'new_parent_id': new_parent_id}
            )

            # if destPage_id's official parent_id == pageID
            # then change the official parent_id to page_id

            official_parent_id = Page.query.filter_by(id = destPage_id, user_id=user_id).first().official_parent_id
            if official_parent_id == prev_parent_id :

                engine.execute(
                    "update Pages set official_parent_id = %(new_parent_id)s "
                    "where global_id=%(child_id)s",
                    {'child_id': child_id, 'new_parent_id': new_parent_id}
                )


        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"



@application.route("/move_notes/<pageID>/<user_id>", methods=['POST'])
@user_required()
def move_notes(pageID, user_id):

    if str(current_user.id) == user_id:

        print("route : move selection to another page")

        request_data = request.get_json()
        selection = request_data.get('selection')
        page_id = str(request_data.get('page_id'))

        pageID = str(pageID)
        pageName = 'Page_' + pageID
        destPageName = 'Page_' + page_id

        for note_id in selection :

            tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
            root = tree.getroot()

            note_to_move = tree.xpath(f"//note[@id='{note_id}']")[0]
            note_to_move.getparent().remove(note_to_move)

            # save the changes in the xml
            f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
            f.write(etree.tostring(root, pretty_print=True))
            f.close()

            tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml")
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

            copied_note = etree.Element(note_to_move.tag, attrib=note_to_move.attrib)
            for child_element in note_to_move.iterchildren():
                new_element = etree.Element(child_element.tag, attrib=child_element.attrib)
                new_element.text = child_element.text
                copied_note.append(new_element)
            if note_to_move.text:
                copied_note.text = note_to_move.text

            copied_note.set("id", id)

            notes = root.find("notes")
            notes.append(copied_note)

            # save the changes in the xml
            f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + destPageName + ".xml", 'wb')
            f.write(etree.tostring(root, pretty_print=True))
            f.close()

        return "yo"




