from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user

#import sys

@application.route("/new_page/<page_id>/<user_id>", methods=['POST'])
@user_required()
def new_page(page_id, user_id):

    if str(current_user.id) == user_id:

        #    print("route : new page")
    #    print(page_id)

        request_data = request.get_json()
        x = str(request_data.get('new_x'))
        y = str(request_data.get('new_y'))
        title = str(request_data.get('title'))
        title = title.replace("'", "\\'")

        print(title)

        # create new page in DB
        new_page_id = get_next_page_id_for_user(user_id)
        new_global_id = get_next_global_id()

        official_parent_id = Page.query.filter_by(id = page_id, user_id=user_id).first().global_id

        engine.execute("insert into Pages (global_id, user_id, title, id, official_parent_id) VALUES (%s, %s, %s, %s, %s)",
                       (new_global_id, user_id, title, new_page_id, official_parent_id))

        #ajouter relation parent-enfant dans la DB
        engine.execute(
            "insert into page_links "
            "(parent_id, child_id) "
            "VALUES ( %(parent_id)s, %(child_id)s )",
            {'parent_id': official_parent_id, 'child_id': new_global_id}
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



def get_next_page_id_for_user(user_id):
    max_page_id = db.session.query(db.func.max(Page.id)).filter(Page.user_id == user_id).scalar()
    return (max_page_id or 0) + 1

def get_next_global_id():
    max_page_id = db.session.query(db.func.max(Page.global_id)).scalar()
    return (max_page_id or 0) + 1