from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree




@application.route("/unload/<pageID>", methods=['GET', 'POST'])
def unload(pageID):

    print("UNLOADDDDIIIINNNNGGG")

    request_data = request.get_json()
    data = request_data.get('data')

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    print(data)

    for i in range(len(data)):
        id = str(data[i]["id"])
        width = str(data[i]["width"])
        height = str(data[i]["height"])
        print(id, height, width)

        tree.xpath("/canvas/notes/note[@id='" + id + "']/width")[0].text = width
        tree.xpath("/canvas/notes/note[@id='" + id + "']/height")[0].text = height

        print("funnymarco")

        print(etree.tostring(root, pretty_print=True))

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    pass
