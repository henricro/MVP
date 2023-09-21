from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

#import sys
import re
from flask_login import LoginManager, UserMixin, current_user


@application.route("/add_css/<pageID>/<user_id>", methods=['POST'])
@user_required()
def add_css(pageID, user_id):

    if str(current_user.id) == user_id:

        #print("route : add css")

        request_data = request.get_json()
        id = str(request_data.get('id'))
        css = str(request_data.get('css'))
        type = str(request_data.get('type'))

        #print(id, css, type)

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        note = root.find("notes").find("note[@id='" + id + "']")

        #print(note)
        existing_css = note.find("css")
        #print("existing css : ", existing_css)

        if existing_css is not None :
            #print('css already there ', existing_css.text)

            if type == "color":
                #print("changing the color through Pickr")
                pattern = r'color\s*:\s*[^;]*\s*;'
                match = re.search(pattern, existing_css.text, re.IGNORECASE)
                #print(match)
                #print(bool(match))

                # if there is already color in the css
                if bool(match) :
                    #print("already color in css")
                    note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
                # if there isn't already color in css
                else :
                    #print("no color already in css")
                    note.find("css").text = existing_css + css


            elif type == "regular" :

                #print("already was css", "yoyoyoyo")
                note.find("css").text = css

        else :

            #print("had to create css")
            etree.SubElement(note, "css").text = css

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"



@application.route("/add_css_note/<pageID>/<user_id>", methods=['POST'])
@user_required()
def add_css_note(pageID, user_id):

    if str(current_user.id) == user_id:

        #print("route : add css")

        request_data = request.get_json()
        id = str(request_data.get('id'))
        type = str(request_data.get('type'))
        color = str(request_data.get('color'))
        fontSize = str(request_data.get('fontSize'))
        fontStyle = str(request_data.get('fontStyle'))
        textDecoration = str(request_data.get('textDecoration'))
        textAlign = str(request_data.get('textAlign'))
        borderColor = str(request_data.get('borderColor'))

        #print(id, type)
        #print(color, fontStyle, fontSize, textDecoration)

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        note = root.find("notes").find("note[@id='" + id + "']")

        #print(note)
        existing_css = note.find("css")
        #print("existing css : ", existing_css)

        if existing_css is not None :
            print('css already there ', existing_css.text)
        else:
            #print('css not already there')
            etree.SubElement(note, "css")
            existing_css = note.find("css")
            existing_css.text = ""

        if not color == "same":

            #print("changing the color through Pickr")
            pattern = r'color\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            ##print(match)
            ##print(bool(match))
            css = "color : " + color + ";"

            # if there is already color in the css
            if bool(match) :
                #print("already color in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                #print("no color already in css")
                note.find("css").text = existing_css.text + css

        if not fontSize == "same":

            #print("changing the font size")
            pattern = r'font-size\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            #print(match)
            #print(bool(match))
            css = "font-size : " + fontSize + ";"

            # if there is already color in the css
            if bool(match) :
                #print("already font-size in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                #print("no font-size already in css")
                note.find("css").text = existing_css.text + css

        if not fontStyle == "same":

            #print("changing the font style")
            pattern = r'font-style\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            #print(match)
            #print(bool(match))
            css = "font-style : " + fontStyle + ";"

            # if there is already color in the css
            if bool(match) :
                #print("already font-style in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                #print("no font-style already in css")
                note.find("css").text = existing_css.text + css

        if not textDecoration == "same":

            #print("changing the text decoration")
            pattern = r'text-decoration\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            #print(match)
            #print(bool(match))
            css = "text-decoration : " + textDecoration + ";"

            # if there is already color in the css
            if bool(match) :
                #print("already text-decoration in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                #print("no text-decoration already in css")
                note.find("css").text = existing_css.text + css

        if not textAlign == "same":

            #print("changing the text-align")
            pattern = r'text-align\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            #print(match)
            #print(bool(match))
            css = "text-align : " + textAlign + ";"

            # if there is already color in the css
            if bool(match) :
                #print("already text-align in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                #print("no text-align already in css")
                note.find("css").text = existing_css.text + css

        print("border-color", borderColor)
        if not borderColor == "same":

            pattern = r'border-color\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            #print(match)
            #print(bool(match))
            css = "border-color : " + borderColor + ";"

            # if there is already border color in the css
            if bool(match) :
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already border-color in css
            else :
                note.find("css").text = existing_css.text + css

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"


@application.route("/add_css_pageLink/<pageID>/<user_id>", methods=['POST'])
@user_required()
def add_css_pageLink(pageID, user_id):

    if str(current_user.id) == user_id:

        #print("route : add css to pageLink")

        request_data = request.get_json()
        id = str(request_data.get('id'))
        type = str(request_data.get('type'))
        color = str(request_data.get('color'))
        backgroundColor = str(request_data.get('backgroundColor'))
        fontSize = str(request_data.get('fontSize'))
        fontStyle = str(request_data.get('fontStyle'))

        #print(id, type)
        #print(color, backgroundColor, fontStyle, fontSize)

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        note = root.find("notes").find("note[@id='" + id + "']")

        #print(note)
        existing_css = note.find("css")

        if existing_css is not None :
            print('css already there ', existing_css.text)
        else:
            #print('css not already there')
            etree.SubElement(note, "css")
            existing_css = note.find("css")
            existing_css.text = ""

        if not color == "same":

            #print("changing the color through Pickr")
            pattern = r'[^-]color\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            css = " color : " + color + ";"

            # if there is already color in the css
            if bool(match) :
                #print("already color in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                #print("no color already in css")
                note.find("css").text = existing_css.text + css

        if not backgroundColor == "same":

            #print("changing the background color through Pickr")
            pattern = r'background-color\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            ##print(match)
            ##print(bool(match))
            css = "background-color : " + backgroundColor + ";"

            # if there is already color in the css
            if bool(match) :
                #print("already background-color in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                print("no background-color already in css")
                note.find("css").text = existing_css.text + css

        if not fontSize == "same":

            print("changing the font size")
            pattern = r'font-size\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            print(match)
            print(bool(match))
            css = "font-size : " + fontSize + ";"

            # if there is already color in the css
            if bool(match) :
                print("already font-size in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                print("no font-size already in css")
                note.find("css").text = existing_css.text + css

        if not fontStyle == "same":

            print("changing the font style")
            pattern = r'font-style\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            print(match)
            print(bool(match))
            css = "font-style : " + fontStyle + ";"

            # if there is already color in the css
            if bool(match) :
                print("already font-style in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                print("no font-style already in css")
                note.find("css").text = existing_css.text + css



        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"



## add css to the text of an imagePageLink

@application.route("/add_css_title_ipl/<pageID>/<user_id>", methods=['POST'])
@user_required()
def add_css_text_ipl(pageID, user_id):

    if str(current_user.id) == user_id:

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
@user_required()
def add_css_image_ipl(pageID, user_id):

    if str(current_user.id) == user_id:

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




@application.route("/add_css_list/<pageID>/<user_id>", methods=['POST'])
@user_required()
def add_css_list(pageID, user_id):

    if str(current_user.id) == user_id:

        print("route : add css list")

        request_data = request.get_json()
        id = str(request_data.get('id'))
        fontSize = str(request_data.get('fontSize'))

        print(id, type)

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        note = root.find("notes").find("note[@id='" + id + "']")

        print(note)
        existing_css = note.find("css")
        print("existing css : ", existing_css)

        if existing_css is not None :
            print('css already there ', existing_css.text)
        else:
            print('css not already there')
            etree.SubElement(note, "css")
            existing_css = note.find("css")
            existing_css.text = ""


        if not fontSize == "same":

            print("changing the font size")
            pattern = r'font-size\s*:\s*[^;]*\s*;'
            match = re.search(pattern, existing_css.text, re.IGNORECASE)
            print(match)
            print(bool(match))
            css = "font-size : " + fontSize + ";"

            # if there is already color in the css
            if bool(match) :
                print("already font-size in css")
                note.find("css").text = re.sub(pattern, css, existing_css.text, flags=re.IGNORECASE)
            # if there isn't already color in css
            else :
                print("no font-size already in css")
                note.find("css").text = existing_css.text + css


        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"

