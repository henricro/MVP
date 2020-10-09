from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
import sys


@application.route("/update_position/<pageID>/<user_id>", methods=['POST'])
def update_position(pageID, user_id):
    print("update position", file=sys.stderr)

    request_data = request.get_json()
    _id = str(request_data.get('id'))
    new_x = str(request_data.get('x'))[:-2]
    new_y = str(request_data.get('y'))[:-2]
    print(_id, new_x, new_y, file=sys.stderr)

    pageID = str(pageID)
    print(pageID, file=sys.stderr)
    pageName = 'Page_' + pageID
    print(pageName, file=sys.stderr)

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    #print(etree.tostring(root, pretty_print=True))

    tree.xpath("/canvas/notes/note[@id='" + _id + "']/x")[0].text = new_x
    tree.xpath("/canvas/notes/note[@id='" + _id + "']/y")[0].text = new_y

    #print(etree.tostring(root, pretty_print=True))

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"


@application.route("/update_positions/<pageID>/<user_id>", methods=['POST'])
def update_positions(pageID, user_id):

    print("route : update positions", file=sys.stderr)

    request_data = request.get_json()
    positions = request_data.get('positions')
    print(positions, file=sys.stderr)

    pageID = str(pageID)
    print(pageID, file=sys.stderr)
    pageName = 'Page_' + pageID
    print(pageName, file=sys.stderr)

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    #print(etree.tostring(root, pretty_print=True))

    for note in positions:

        print(note, file=sys.stderr)

        id = note[0]
        x = str(note[1])
        y = str(note[2])

        tree.xpath("/canvas/notes/note[@id='" + id + "']/x")[0].text = x
        tree.xpath("/canvas/notes/note[@id='" + id + "']/y")[0].text = y

        #print(etree.tostring(root, pretty_print=True))

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

    return "yo"



@application.route("/update_content/<pageID>/<user_id>", methods=['POST'])
def update_content(pageID, user_id):
    print("update content", file=sys.stderr)

    request_data = request.get_json()
    _id = str(request_data.get('id'))
    content = str(request_data.get('content'))
    content = content.replace("'", "\\'")

    print(content, _id, file=sys.stderr)

    pageID = str(pageID)

    # change title in DB if the note changed is the title.
    if _id == 'title':
        print("change title", file=sys.stderr)
        engine.execute("Update Pages set title = %(content)s where id= %(pageID)s ",
                       {'content': content, 'pageID': pageID})

    else:
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        tree.xpath("/canvas/notes/note[@id='" + _id + "']/content")[0].text = content

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

    return "yo"

