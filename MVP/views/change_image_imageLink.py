from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
import uuid
from flask_login import LoginManager, UserMixin, current_user

#import sys


@application.route("/change_image_imageLink/<pageID>/<user_id>", methods=['POST'])
@user_required()
def change_image_imageLink(pageID, user_id):

    if str(current_user.id) == user_id:

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        print("change image in imageLink", "yoyoyoyo")

        ### add the image to uploads

        Request = request.form
        print(Request, "yoyoyoyo")

        imageLink_id = Request.get('imageLink_id')
        file = request.files.get('file')
        print("printing the file", "yoyoyoyo")
        print(imageLink_id, file, "yoyoyoyo")
        # print(type(file))
        # print(dict(file))

        ### save the image

        type = file.filename[-4:]

        filename = file.filename
        filename = filename.replace(' ', '_')

        filename = '{}.{}'.format(str(uuid.uuid4()), filename.split('.')[-1])

        file.save(application.config['USER_DATA_PATH'] + user_id + '/uploads/' + filename)

        ### open the XML

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        #find the note
        note = root.find("notes").find("note[@id='" + imageLink_id + "']")

        # set the note's x, y and content = "title" (for now)
        image = note.find('name')
        print(image, "yoyoyoyo")

        image.text = str(filename)
        print(image, "yoyoyoyo")
        etree.SubElement(note, "width").text = "300"
        etree.SubElement(note, "height").text = "200"

        #print(etree.tostring(root, pretty_print=True))

        # save the changes in the xml

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"


