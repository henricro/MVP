from MVP import application, db, login_manager, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user

#import sys

@application.route("/home/<user_id>", methods=['GET', 'POST'])
@user_required()
def home(user_id):

    user_id = int(user_id)
    if not user_id == current_user.id:
        return redirect(url_for('login'))

    user_id = str(user_id)
    user = User.query.filter_by(id=user_id).first()
    email = user.email

    print("route : open home page", "yoyoyoyo")

    pages = engine.execute("select id, title from Pages where user_id = %(user_id)s", {'user_id':user_id}).fetchall()
    pages = dict(pages)

    title = Page.query.filter_by(user_id=user_id).first().title
    print("title")
    print(title)

    PageID = Page.query.filter_by(user_id=user_id).first().id
    PageID = str(PageID)

    pageName = 'Page_' + PageID

    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    xml_string = etree.tostring(root).decode('utf-8')

    xml_string = xml_string.replace("\n", "")

    return render_template('/page.html', xml_string=xml_string, pageID = PageID, email=email,
                           pages=pages, title=title, user_id=user_id, lineage=[])



@application.route("/open_page/<pageID>/<user_id>/<y_position>", methods=['GET', 'POST'])
@user_required()
def open_page(pageID, user_id, y_position):

    user_id = int(user_id)
    if not user_id == current_user.id:
        return redirect(url_for('login'))

    user_id = str(user_id)
    user = User.query.filter_by(id=user_id).first()
    email = user.email

    pages = engine.execute("select id, title from Pages where user_id = %(user_id)s", {'user_id':user_id}).fetchall()
    pages = dict(pages)

    request_data = request.get_json()
    pageID = str(pageID)
    pageName = 'Page_' + pageID

    title = Page.query.filter_by(id=pageID).first().title
    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
    root = tree.getroot()

    xml_string = etree.tostring(root).decode('utf-8')
    xml_string = xml_string.replace("\n", "")

    page = Page.query.filter_by(id=pageID, user_id=user_id).first()
    parent_id = page.official_parent_id
    print("parent id", parent_id)

    if parent_id :
        lineage = []

        while parent_id :
            parent = Page.query.filter_by(global_id=parent_id).first()
            parent_title = parent.title
            lineage.append([parent.id, parent_title])
            parent_id = parent.official_parent_id
            print(parent_id)

    else :
        lineage =[]

    print(lineage)

    return render_template('/page.html', xml_string=xml_string, pageID=pageID,
                           user_id=user_id, pages=pages, title=title, y_position = y_position,
                           email = email, lineage=lineage)

