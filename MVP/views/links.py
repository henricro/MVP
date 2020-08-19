from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree



@application.route("/add_link_note/<pageID>", methods=['POST'])
def add_link_note(pageID):
    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    link = str(request_data.get('link'))

    print(id, link)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    note.set("class", "noteLink")

    print(etree.tostring(note, pretty_print=True))

    etree.SubElement(note, "link").text = link

    print(etree.tostring(note, pretty_print=True))

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    pass

@application.route("/add_link_image/<pageID>", methods=['POST'])
def add_link_image(pageID):
    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    link = str(request_data.get('link'))

    print(id, link)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    note.set("class", "imageLink")

    print(etree.tostring(note, pretty_print=True))

    etree.SubElement(note, "link").text = link

    print(etree.tostring(note, pretty_print=True))

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    pass



@application.route("/change_link/<pageID>", methods=['POST'])
def change_link(pageID):
    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    link = str(request_data.get('link'))

    print(id, link)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    note.find("link").text = link

    print(etree.tostring(note, pretty_print=True))

    # etree.SubElement(note, "link").text = link

    print(etree.tostring(note, pretty_print=True))

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    pass


