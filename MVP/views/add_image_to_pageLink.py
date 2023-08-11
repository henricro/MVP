from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
import uuid

#import sys


@application.route("/add_image_to_pageLink/<pageID>/<user_id>", methods=['POST'])
def add_image_to_pageLink(pageID, user_id):

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("route : add image to pageLink", "yoyoyoyo")

    ### add the image to uploads

    Request = request.form
    print(Request, "yoyoyoyo")

    pageLink_id = Request.get('pageLink_id')
    file = request.files.get('file')

    ### save the image

    type = file.filename[-4:]

    filename = file.filename
    filename = filename.replace(' ', '_')

    storage_name = '{}.{}'.format(str(uuid.uuid4()), filename.split('.')[-1])

    file.save(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + storage_name)

    ### open the XML

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    #find the note
    note = root.find("notes").find("note[@id='" + pageLink_id + "']")

    # set the note's x, y and content = "title" (for now)
    note.set("class", "imagePageLink")
    etree.SubElement(note, "image").text = str(storage_name)
    etree.SubElement(note, "width").text = "150"
    etree.SubElement(note, "height").text = "150"

    #print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"


