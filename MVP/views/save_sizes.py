from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree


@application.route("/save_sizes/<pageID>/<user_id>", methods=['GET', 'POST'])
def save_sizes(pageID, user_id):

    print("route : save sizes")

    request_data = request.get_json()
    id = str(request_data.get('id'))
    width = str(request_data.get('width'))
    height = str(request_data.get('height'))

    print(id, width, height)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    tree.xpath("/canvas/notes/note[@id='" + id + "']/width")[0].text = width
    tree.xpath("/canvas/notes/note[@id='" + id + "']/height")[0].text = height

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"

