from MVP import application, db, login_manager, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user
import os
from flask_login import LoginManager, UserMixin, current_user

#import sys

@application.route("/home/<user_id>", methods=['GET', 'POST'])
@user_required()
def home(user_id):

    user_id = int(user_id)
    if not user_id == current_user.id:
        if os.environ.get('FLASK_ENV') == 'development':
            return redirect(url_for('login'))
        else:
            return redirect(url_for('login', _external=True, _scheme='https'))

    else :
        user_id = str(user_id)
        if os.environ.get('FLASK_ENV') == 'development':
            return redirect(url_for('open_page', user_id=user_id, pageID = "1", y_position= "0"))
        else:
            return redirect(url_for('open_page', user_id=user_id, pageID="1", y_position="0", _external=True, _scheme='https'))




@application.route("/open_page/<pageID>/<user_id>/<y_position>", methods=['GET', 'POST'])
def open_page(pageID, user_id, y_position):

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

    page_global_id = Page.query.filter_by(user_id = user_id, id = pageID).first().global_id
    parents = engine.execute("SELECT p.id, p.title " 
                                        "FROM Pages p "
                                        "JOIN page_links pl ON p.global_id = pl.parent_id "
                                        "WHERE pl.child_id = %(page_global_id)s;",
                                        {'page_global_id': page_global_id}
                                        ).fetchall()
    if not parents :
        parents = []
    else :
        parents = [[item[0], item[1]] for item in parents]


    print("parents ids and titles :",  parents)

    page_share_status = page.status
    if page_share_status == None :
        page_share_status = "private"

    if page_share_status == "public":
        # Render the page directly without requiring user authentication
        return render_template('/page.html', xml_string=xml_string, pageID=pageID,
                               user_id=user_id, pages=pages, title=title, y_position=y_position,
                               email=email, lineage=lineage, page_share_status=page_share_status)

    # If the page is private, require user authentication using the user_required decorator
    if page_share_status == "private":
        @user_required()
        def render_private_page(user_id):
            user_id = int(user_id)
            if not user_id == current_user.id:
                return redirect(url_for('login'))
            else:
                user_id = str(user_id)
                return render_template('/page.html', xml_string=xml_string, pageID=pageID,
                                   user_id=user_id, pages=pages, title=title, y_position=y_position,
                                   email=email, lineage=lineage, page_share_status=page_share_status, parents= parents)

        return render_private_page(user_id)

    return 'yo'