from MVP import application, db, engine, basedir
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

import urllib.request

# urllib.request.urlretrieve("http://img.youtube.com/vi/WHUVJyfbMRg/0.jpg", "/Users/macbook/PycharmProjects/MVP/MVP/static/uploads/youtube-WHUVJyfbMRg.jpg")

### example
#resource = urllib.request.urlopen("http://img.youtube.com/vi/WHUVJyfbMRg/0.jpg")
#output = open(application.config['UPLOADED_PATH']+"file02.jpg","wb")
#output.write(resource.read())
#output.close()


@application.route("/youtube/<pageID>", methods=['POST'])
def youtube(pageID):

    print( "youtube route")

    # code : import youtube thumbnail

    #youtube_link = "https://www.youtube.com/watch?v=4y99orgXqUY"

    request_data = request.get_json()
    youtube_link = str(request_data.get('data'))

    if "&list" in youtube_link :
        youtube_link = youtube_link.split("&list",1)[0]

    print("youtube link : ", youtube_link)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    youtube_id = youtube_link.split("v=",1)[1]
    print("youtube_id : ", youtube_id)

    youtube_thumbnail = "http://img.youtube.com/vi/" + youtube_id + "/0.jpg"
    print("youtube_thumbnail : ", youtube_thumbnail)

    print(basedir)
    print(application.config['UPLOADED_PATH'])

    resource = urllib.request.urlopen(youtube_thumbnail)
    youtube_image = "youtube-" + youtube_id + ".jpg"
    output = open(application.config['UPLOADED_PATH']+ youtube_image ,"wb")
    output.write(resource.read())
    output.close()

    ### keep the information that this file is in this page in the 'tags' many to many SQL table

    engine.execute("insert into Images (name, type) VALUES ( %(name)s, %(type)s )",
                   {'name': youtube_image, 'type': "jpg"})

    image_id = engine.execute("SELECT id FROM Images ORDER BY id DESC LIMIT 1").fetchone()[0]
    print("image_id")
    print(image_id)

    engine.execute("insert into pages_images (page_id, image_id) VALUES ( %(page_id)s, %(image_id)s )",
                   {'page_id': pageID, 'image_id': image_id})

    ### add a note in the XML with the x, y positions and the name of the file

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # set the note's x, y and content = "title" (for now)
    new_note.set("id", id)
    new_note.set("class", "imageLink")
    etree.SubElement(new_note, "x").text = "500"
    etree.SubElement(new_note, "y").text = "500"
    etree.SubElement(new_note, "width").text = "300"
    etree.SubElement(new_note, "height").text = "200"
    etree.SubElement(new_note, "name").text = str(youtube_image)
    etree.SubElement(new_note, "image_id").text = str(image_id)
    etree.SubElement(new_note, "link").text = youtube_link


    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"


