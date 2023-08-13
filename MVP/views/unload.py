from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user


@application.route("/unload/<pageID>/<user_id>", methods=['GET', 'POST'])
@user_required()
def unload(pageID, user_id):

    if str(current_user.id) == user_id:

        print("route : unloading")

        request_data = request.get_json()
        data = request_data.get('data')
        print(data)

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        for i in range(len(data)):

            id = str(data[i]["id"])
            width = str(data[i]["width"])
            height = str(data[i]["height"])

            tree.xpath("/canvas/notes/note[@id='" + id + "']/width")[0].text = width
            tree.xpath("/canvas/notes/note[@id='" + id + "']/height")[0].text = height

            #print(etree.tostring(root, pretty_print=True))

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"

