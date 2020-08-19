from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree



@application.route("/link_notes/<pageID>", methods=['POST'])
def link_notes(pageID):

    print("route : link notes")

    # get the data for new note
    request_data = request.get_json()
    id_1 = str(request_data.get('id_1'))
    id_2 = str(request_data.get('id_2'))

    print(id_1, id_2)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    connexions = root.find("connexions")

    if connexions is not None:

        etree.SubElement(connexions, "connexion").text = id_1 + "," + id_2

    else:

        print("add connexions tag")
        root.append(etree.Element("connexions"))
        print("add a connexion")
        connexions = root.find("connexions")
        print("put the ids in that new connexion")
        etree.SubElement(connexions, "connexion").text = id_1 + "," + id_2

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    pass



