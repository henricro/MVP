from MVP import application, db, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user

import requests
from urllib3.exceptions import InsecureRequestWarning

# Disable SSL verification warning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


from bs4 import BeautifulSoup
from urllib.parse import urljoin
#import sys

from urllib.parse import urlparse


def is_url(string):
    try:
        result = urlparse(string)
        return all([result.scheme, result.netloc])
    except ValueError:
        return False


def get_favicon_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()

        if response.status_code == 200:
            return url + "/favicon.ico"

    except requests.RequestException:
        pass

    return None

def get_url_root(url):
    parsed_url = urlparse(url)
    return f"{parsed_url.scheme}://{parsed_url.netloc}"


def download_image(url, save_path):
    try:
        response = requests.get(url, stream=True, verify=False)
        response.raise_for_status()
        with open(save_path, 'wb') as file:
            for chunk in response.iter_content(chunk_size=8192):
                file.write(chunk)
        #print("Image downloaded successfully.")
    except (requests.RequestException, IOError) as e:
        print("Error occurred while downloading the image:", str(e))



@application.route("/add_link_to_note/<pageID>/<user_id>", methods=['POST'])
@user_required()
def add_link_to_note(pageID, user_id):

    if str(current_user.id) == user_id:

        request_data = request.get_json()
        id = str(request_data.get('id'))
        link = str(request_data.get('link'))

        ##print(id, link, "yoyoyoyo")

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        # change class to noteLink
        note = root.find("notes").find("note[@id='" + id + "']")
        note.set("class", "noteLink")

        ##print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

        etree.SubElement(note, "link").text = link

        ##print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"


@application.route("/paste_note_link/<pageID>/<user_id>", methods=['POST'])
@user_required()
def paste_note_link(pageID, user_id):

    if str(current_user.id) == user_id:

        #print("paste note link")

        request_data = request.get_json()
        x = str(request_data.get('x'))
        y = str(request_data.get('y'))
        link = str(request_data.get('data'))

        root_url = get_url_root(link)
        favicon_url = root_url + "/favicon.ico"


        favicon = requests.get(favicon_url, verify=False)

        favicon_name = 'favicon_' + root_url.replace("https://", "") + ".jpg"
        #print(favicon_name)

        favicon_path = application.config['USER_DATA_PATH'] + user_id + '/uploads/' + favicon_name

        if favicon.status_code == 200:

            # Save the image to a file
            with open(favicon_path, "wb") as file:
                file.write(favicon.content)
            #print("Image downloaded successfully.")
        else:
            print("Failed to download the image:", favicon.status_code)


        ##print(id, link, "yoyoyoyo")

        pageID = str(pageID)
        pageName = 'Page_' + pageID

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

        # set the note's x, y and content = "new note"
        new_note.set("id", id)
        new_note.set("class", "noteLink")
        etree.SubElement(new_note, "x").text = x
        etree.SubElement(new_note, "y").text = y
        etree.SubElement(new_note, "content").text = link
        etree.SubElement(new_note, "link").text = link
        etree.SubElement(new_note, "favicon").text = favicon_name

        # #print(etree.tostring(root, pretty_print=True))

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"




@application.route("/add_link_image/<pageID>/<user_id>", methods=['POST'])
@user_required()
def add_link_image(pageID, user_id):

    if str(current_user.id) == user_id:

        #print("route : add link to image")

        request_data = request.get_json()
        id = str(request_data.get('id'))
        link = str(request_data.get('link'))

        #print(id, link, "yoyoyoyo")

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        note = root.find("notes").find("note[@id='" + id + "']")
        note.set("class", "imageLink")

        #print(etree.tostring(note, pretty_print=True), "yoyoyoyo")
        etree.SubElement(note, "link").text = link
        #print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"



@application.route("/change_link/<pageID>/<user_id>", methods=['POST'])
@user_required()
def change_link(pageID, user_id):
        # get the data for new note
        request_data = request.get_json()
        id = str(request_data.get('id'))
        link = str(request_data.get('link'))

        #print(id, link, "yoyoyoyo")

        pageID = str(pageID)
        pageName = 'Page_' + pageID

        tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
        root = tree.getroot()

        note = root.find("notes").find("note[@id='" + id + "']")

        note.find("link").text = link

        #print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

        # etree.SubElement(note, "link").text = link

        #print(etree.tostring(note, pretty_print=True), "yoyoyoyo")

        # save the changes in the xml
        f = open(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()
        return "yo"


