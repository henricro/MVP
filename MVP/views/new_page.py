from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree



@application.route("/new_page/<pageID>/<user_id>", methods=['POST'])
def new_page(pageID, user_id):

    print("route : new page")

    page_title = Page.query.filter_by(id=pageID).first().title

    request_data = request.get_json()
    new_page_title = str(request_data.get('title'))
    new_page_title = new_page_title.replace("'", "\\'")

    print(new_page_title)
    print("testing")

    # creer une nouvelle ligne dans la table 'Pages' de la DB

    engine.execute("insert into Pages (user_id, title) VALUES (%s, %s)", (user_id, new_page_title))

    # obtenir l'ID de cette nouvelle page dans la DB

    newPageID = Page.query.all()[-1].id + 1

    print(newPageID)

    # ajouter relation parent-enfant dans la DB
    engine.execute("insert into parents (parent_page_id, child_page_id) VALUES ( %(pageID)s, %(newPageID)s )",
                   {'pageID': pageID, 'newPageID': newPageID})

    # A partir de cette ID créer le nom de la nouvelle page XML

    newPageName = 'Page_' + str(newPageID)

    print(newPageName)

    # Créer une nouvelle page XML

    tree = etree.parse(application.config['TEMPLATES_PATH'] + 'newPage.xml')
    root = tree.getroot()

    # get x and y of title
    title_x = root.find("notes").find("note[@id='title']").find("x").text
    title_y = root.find("notes").find("note[@id='title']").find("y").text

    print(title_x, title_y)

    # ajouter la note 'page parente' dans le xml
    # c'est une note de class="pageLink", type="parent", id=1, pageID=pageID, x = title_x -10, y = title_y- 30, content=title

    # create a new note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # classifier/parametrer la note
    new_note.set("id", "1")
    new_note.set("class", "pageLink")
    new_note.set("pageID", str(pageID))
    new_note.set("type", "parent")
    etree.SubElement(new_note, "x").text = "0"
    etree.SubElement(new_note, "y").text = "0"
    etree.SubElement(new_note, "content").text = page_title

    # biggest id=1
    tree.xpath("/canvas/meta/biggest_id")[0].text = "1"

    print(etree.tostring(root, pretty_print=True))

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + newPageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    # Créer un lien vers cette page sur la page en cours

    new_x = str(request_data.get('new_x'))
    new_y = str(request_data.get('new_y'))

    print(new_x, new_y)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

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

    # set the note's x, y and content = "title" (for now)
    new_note.set("id", id)
    new_note.set("class", "pageLink")
    new_note.set("pageID", str(newPageID))
    new_note.set("type", 'child')
    etree.SubElement(new_note, "x").text = new_x
    etree.SubElement(new_note, "y").text = new_y
    etree.SubElement(new_note, "content").text = new_page_title

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

