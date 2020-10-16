from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
#import sys


@application.route("/add_link_note/<pageID>/<user_id>", methods=['POST'])
def add_link_note(pageID, user_id):
    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    link = str(request_data.get('link'))

    print(id, link, "yoyoyoyo")

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    note.set("class", "noteLink")

    print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

    etree.SubElement(note, "link").text = link

    print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"

@application.route("/add_link_image/<pageID>/<user_id>", methods=['POST'])
def add_link_image(pageID, user_id):
    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    link = str(request_data.get('link'))

    print(id, link, "yoyoyoyo")

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    note.set("class", "imageLink")

    print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

    etree.SubElement(note, "link").text = link

    print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"



@application.route("/change_link/<pageID>/<user_id>", methods=['POST'])
def change_link(pageID, user_id):
    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    link = str(request_data.get('link'))

    print(id, link, "yoyoyoyo")

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    note.find("link").text = link

    print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

    # etree.SubElement(note, "link").text = link

    print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"


