from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
#import sys

from flask_login import current_user


@application.route("/update_position/<pageID>/<user_id>", methods=['POST'])
@user_required()
def update_position(pageID, user_id):

    if str(current_user.id) == user_id:

        print("update position route")

        request_data = request.get_json()
        _id = str(request_data.get('id'))
        new_x = str(request_data.get('x'))[:-2]
        new_y = str(request_data.get('y'))[:-2]

        pageID = str(pageID)
        print(pageID, "yoyoyoyo")
        pageName = 'Page_' + pageID
        print(pageName, "yoyoyoyo")

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        #print(etree.tostring(root, pretty_print=True))

        tree.xpath("/canvas/notes/note[@id='" + _id + "']/x")[0].text = new_x
        tree.xpath("/canvas/notes/note[@id='" + _id + "']/y")[0].text = new_y

        #print(etree.tostring(root, pretty_print=True))

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"


@application.route("/update_positions/<pageID>/<user_id>", methods=['POST'])
@user_required()
def update_positions(pageID, user_id):

    if str(current_user.id) == user_id:

        print("route : update positions")

        request_data = request.get_json()
        positions = request_data.get('positions')
        print(positions)

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        #print(etree.tostring(root, pretty_print=True))

        for note in positions:

            id = note[0]
            x = str(note[1])
            y = str(note[2])

            tree.xpath("/canvas/notes/note[@id='" + id + "']/x")[0].text = x
            tree.xpath("/canvas/notes/note[@id='" + id + "']/y")[0].text = y

            f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
            f.write(etree.tostring(root, pretty_print=True))
            f.close()

        return "yo"


@application.route("/send_all_down/<pageID>/<user_id>", methods=['POST'])
@user_required()
def send_all_down(pageID, user_id):

    if str(current_user.id) == user_id:

        print("send all down",)

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        #print(etree.tostring(root, pretty_print=True))

        xpath_expression = '//notes//@id[number(.) = .]'

        # Find all matching nodes using XPath
        ids = root.xpath(xpath_expression)

        #print("here are the ids")
        #print(ids)

        for id in ids :

            id = str(id)

            xpath_expression = "/canvas/notes/note[@id='" + id + "']/y/text()"
            text_value = tree.xpath(xpath_expression)

            old_y = float(text_value[0])
            new_y = str(old_y + 40)
            #print(old_y, new_y)

            tree.xpath("/canvas/notes/note[@id='" + id + "']/y")[0].text = new_y

        print("finish boucle")

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"




@application.route("/update_content/<pageID>/<user_id>", methods=['POST'])
@user_required()
def update_content(pageID, user_id):

    if str(current_user.id) == user_id:

        print("update content")
        print(pageID)

        request_data = request.get_json()
        _id = str(request_data.get('id'))
        content = str(request_data.get('content'))
        content = content.replace("'", "\\'")

        print(content, _id)

        pageID = str(pageID)
        pageName = 'Page_' + pageID
        print(pageName)
        user_id = str(user_id)

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        tree.xpath("/canvas/notes/note[@id='" + _id + "']/content")[0].text = content

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"






@application.route("/edit_title/<pageID>/<user_id>", methods=['POST'])
@user_required()
def edit_title(pageID, user_id):

    if str(current_user.id) == user_id:

        request_data = request.get_json()
        value = str(request_data.get('value'))

        pageID = str(pageID)

        engine.execute("Update Pages set title = %(value)s where id= %(pageID)s and user_id=%(user_id)s",
                           {'value': value, 'pageID': pageID, 'user_id':user_id})

        return "yo"

@application.route("/update_page_status/<pageID>/<user_id>", methods=['POST'])
@user_required()
def update_page_status(pageID, user_id):

    if str(current_user.id) == user_id:

        print("route update status")

        request_data = request.get_json()
        status = str(request_data.get('status'))

        print(status)
        engine.execute("update Pages set status= %(status)s where user_id= %(user_id)s and id=%(pageID)s",
                       {'status': status, 'user_id': user_id, 'pageID': pageID})

        return 'yo'

@application.route("/update_background/<pageID>/<user_id>", methods=['POST'])
@user_required()
def update_background(pageID, user_id):

    if str(current_user.id) == user_id:

        request_data = request.get_json()
        background = str(request_data.get('background'))

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        background_element = root.find('.//background')
        print(background_element)
        if background_element is not None :
            print("already a background tab")
            background_element.text = background
        else :
            meta_element = root.find(".//meta")
            if meta_element is not None:
                # Add a <background> element inside the <meta> element
                background_element = etree.SubElement(meta_element, "background")
                background_element.text = background

        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return 'yo'
    return 'yo'



@application.route("/change_IPL_style/<pageID>/<user_id>", methods=['POST'])
@user_required()
def change_IPL_style(pageID, user_id):

    if str(current_user.id) == user_id:

        request_data = request.get_json()
        id = str(request_data.get('id'))
        styleIPL = str(request_data.get('styleIPL'))

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        note = root.find("notes").find("note[@id='" + id + "']")
        note.set("class", styleIPL)
        print(id, styleIPL)


        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"

