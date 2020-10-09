from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

import sys

@application.route("/unload/<pageID>/<user_id>", methods=['GET', 'POST'])
def unload(pageID, user_id):

    print("UNLOADDDDIIIINNNNGGG", file=sys.stderr)

    request_data = request.get_json()
    data = request_data.get('data')

    parents_x = str(request_data.get('parents_x'))
    parents_y = str(request_data.get('parents_y'))
    parents_width = str(request_data.get('parents_width'))
    parents_height = str(request_data.get('parents_height'))

    print(parents_x, parents_y, parents_width, parents_height, file=sys.stderr)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()


    tree.xpath("/canvas/notes/note[@id='parents']/x")[0].text = parents_x
    tree.xpath("/canvas/notes/note[@id='parents']/y")[0].text = parents_y
    tree.xpath("/canvas/notes/note[@id='parents']/width")[0].text = parents_width
    tree.xpath("/canvas/notes/note[@id='parents']/height")[0].text = parents_height


    for i in range(len(data)):

        id = str(data[i]["id"])
        width = str(data[i]["width"])
        height = str(data[i]["height"])
        #print(id, height, width, file=sys.stderr)

        tree.xpath("/canvas/notes/note[@id='" + id + "']/width")[0].text = width
        tree.xpath("/canvas/notes/note[@id='" + id + "']/height")[0].text = height

        #print(etree.tostring(root, pretty_print=True))

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"

