from MVP import application, db, login_manager, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user


@application.route("/home/<user_id>", methods=['GET', 'POST'])
#@user_required()
def home(user_id):

    print("route : open home page")

    pages = engine.execute("select id, title from Pages").fetchall()
    pages = dict(pages)
    print(pages)

    pageID = "1"

    pageName = 'Page_' + pageID

    title = Page.query.filter_by(id=pageID).first().title

    tree = etree.parse(application.config['PAGES_PATH'] + 'users/' + user_id + '/' + pageName + ".xml")
    root = tree.getroot()

    xml_string = etree.tostring(root).decode('utf-8')

    xml_string = xml_string.replace("\n", "")

    return render_template('/page.html', xml_string=xml_string, pageID = pageID, pages=pages, title=title, user_id=user_id)



@application.route("/open_page/<pageID>/<user_id>", methods=['GET', 'POST'])
#@user_required()
def open_page(pageID, user_id):

    user_id = int(user_id)
    if not user_id == current_user.user_id:
        return redirect(url_for('login'))

    print("opening page")

    print(pageID)

    # get the parents of the page
    parents = engine.execute("select * from parents where child_page_id= %(pageID)s", {'pageID':pageID}).fetchall()
    parents=dict(parents)
    print(parents)

    pages = engine.execute("select id, title from Pages").fetchall()
    pages = dict(pages)
    print(pages)

    print("open page")

    request_data = request.get_json()
    pageID = str(pageID)

    pageName = 'Page_' + pageID

    print(pageName)

    title = Page.query.filter_by(id=pageID).first().title

    tree = etree.parse(application.config['PAGES_PATH'] + 'users/' + user_id + '/' + pageName + ".xml")
    root = tree.getroot()

    print(root)

    xml_string = etree.tostring(root).decode('utf-8')

    xml_string = xml_string.replace("\n", "")

    type = tree.xpath("/canvas/meta/type")[0].text


    return render_template('/page.html', xml_string=xml_string, pageID=pageID, user_id=user_id, pages=pages, title=title)
