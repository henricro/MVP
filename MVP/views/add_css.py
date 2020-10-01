from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree



@application.route("/add_css/<pageID>/<user_id>", methods=['POST'])
def add_css(pageID, user_id):

    print("route : add css")

    request_data = request.get_json()
    id = str(request_data.get('id'))
    css = str(request_data.get('css'))

    print(id, css)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    hehe = note.find("css")
    print(hehe)

    if hehe is not None:

        print("already was css")
        note.find("css").text = css

    else :

        print("had to create css")
        etree.SubElement(note, "css").text = css

    print(etree.tostring(note, pretty_print=True))

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"




