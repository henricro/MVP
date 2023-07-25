from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

#import sys


@application.route("/add_css/<pageID>/<user_id>", methods=['POST'])
def add_css(pageID, user_id):

    print("route : add css", "yoyoyoyo")

    request_data = request.get_json()
    id = str(request_data.get('id'))
    css = str(request_data.get('css'))

    print(id, css, "yoyoyoyo")

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    hehe = note.find("css")
    print(hehe, "yoyoyoyo")

    if hehe is not None:

        print("already was css", "yoyoyoyo")
        note.find("css").text = css

    else :

        print("had to create css", "yoyoyoyo")
        etree.SubElement(note, "css").text = css

    print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"

## add css to the text of an imagePageLink

@application.route("/add_css_title_ipl/<pageID>/<user_id>", methods=['POST'])
def add_css_text_ipl(pageID, user_id):

    print("route : add css imagePageLink title")

    request_data = request.get_json()
    id = str(request_data.get('id'))
    css = str(request_data.get('css'))

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")
    css_title = note.find("css_text")

    if css_title is not None:
        note.find("css_text").text = css
    else :
        etree.SubElement(note, "css_text").text = css

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"



## add css to the image of an imagePageLink

@application.route("/add_css_image_ipl/<pageID>/<user_id>", methods=['POST'])
def add_css_image_ipl(pageID, user_id):

    print("route : add css imagePageLink image")

    request_data = request.get_json()
    id = str(request_data.get('id'))
    css = str(request_data.get('css'))

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    hehe = note.find("css_image")

    if hehe is not None:
        note.find("css_image").text = css
    else :
        etree.SubElement(note, "css_image").text = css

    print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

    # save the changes in the xml
    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"


