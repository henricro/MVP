from MVP import application, db, engine, basedir, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user

import urllib.request




@application.route("/youtube/<pageID>/<user_id>", methods=['POST'])
@user_required()
def youtube(pageID, user_id):

    if str(current_user.id) == user_id:

        print( "youtube route")

        #youtube_link = "https://www.youtube.com/watch?v=4y99orgXqUY"

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        request_data = request.get_json()
        youtube_link = str(request_data.get('data'))
        x = str(request_data.get('x'))
        y = str(request_data.get('y'))

        youtube_thumbnail = "hoho"
        youtube_id = "mama"

        if "youtube.com" in youtube_link :

            if "&list" in youtube_link :
                youtube_link = youtube_link.split("&list",1)[0]

            if "&" in youtube_link:
                youtube_link = youtube_link.split("&", 1)[0]

            print("youtube link : ", youtube_link)

            youtube_id = youtube_link.split("v=",1)[1]
            print("youtube_id : ", youtube_id)

            youtube_thumbnail = "http://img.youtube.com/vi/" + youtube_id + "/0.jpg"
            print("youtube_thumbnail : ", youtube_thumbnail)

        elif "youtu.be" in youtube_link :

            youtube_id = youtube_link.split(".be/", 1)[1]
            youtube_thumbnail = "http://img.youtube.com/vi/" + youtube_id + "/0.jpg"

            print(youtube_id)
            print(youtube_thumbnail)


        print(basedir)

        youtube_embed_link = youtube_link.replace("watch?v=", "embed/")
        print(youtube_embed_link)

        ### add a note in the XML with the x, y positions and the name of the file

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        # Extract ids and find the biggest id
        note_elements = tree.xpath('//note[not(@id="title" or @id="parents")]')
        biggest_id = 0
        for note in note_elements:
            id_attribute = note.get('id')
            if id_attribute is not None:
                current_id = int(id_attribute)
                biggest_id = max(biggest_id, current_id)

        id = str(biggest_id + 1)

        # add a note
        notes = root.find("notes")
        notes.append(etree.Element("note"))
        new_note = notes[-1]

        # set the note's x, y and content = "title" (for now)
        new_note.set("id", id)
        new_note.set("class", "youtube")
        etree.SubElement(new_note, "x").text = x
        etree.SubElement(new_note, "y").text = y
        etree.SubElement(new_note, "width").text = "200"
        etree.SubElement(new_note, "height").text = "132"
        etree.SubElement(new_note, "link").text = youtube_embed_link


        #print(etree.tostring(root, pretty_print=True))

        # save the changes in the xml

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"


