from MVP import application, db, login_manager, engine, user_required
from MVP.models import *
import pandas as pd

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user

#import sys

@application.route("/home/<user_id>", methods=['GET', 'POST'])
@user_required()
def home(user_id):

    return redirect(url_for('open_page', page_id = 1, user_id = user_id))


@application.route("/open_page/<page_id>/<user_id>", methods=['GET', 'POST'])
@user_required()
def open_page(page_id, user_id):

    user_id = int(user_id)
    if not user_id == current_user.id:
        return redirect(url_for('login'))

    user_id = str(user_id)

    print("opening page", "yoyoyoyo")

    title = Page.query.filter_by(id=page_id).first().title

    print(title)


    Notes = pd.read_sql("select * from Notes", engine.connect())
    print(Notes)

    Notes = Notes[(Notes['page_id'] == int(page_id))]
    print(Notes)

    notes = Notes.tolist()
    print(notes)

#    notes = engine.execute("select * from Notes where page_id = %(page_id)s", {'page_id' : page_id}).fetchall()


#    Notes = Note.query.filter_by(page_id = page_id).all()


    print("print notes")
    print(notes)

    print(type(notes))
    print(notes[2])
    print(notes[2][3])
    #print(Notes)


    return render_template('/page.html', page_id=page_id, user_id=user_id, title=title, notes=notes)






###OLD OPEN PAGE

#@application.route("/open_page/<page_id>/<user_id>", methods=['GET', 'POST'])
#@user_required()
#def open_page(page_id, user_id):

#    user_id = int(user_id)
#    if not user_id == current_user.id:
#        return redirect(url_for('login'))

#    user_id = str(user_id)

#    print("opening page", "yoyoyoyo")

#    print(page_id, "yoyoyoyo")

    # get the parents of the page
#    parents = engine.execute("select * from parents where child_page_id= %(pageID)s", {'pageID':pageID}).fetchall()
#    parents=dict(parents)
#    print(parents, "yoyoyoyo")

#    pages = engine.execute("select id, title from Pages where user_id = %(user_id)s", {'user_id':user_id}).fetchall()
#    pages = dict(pages)

#    print("open page", "yoyoyoyo")

#    request_data = request.get_json()
#    page_id = str(page_id)

#    pageName = 'Page_' + page_id

#    print(pageName, "yoyoyoyo")

#    title = Page.query.filter_by(id=page_id).first().title

#    tree = etree.parse(application.config['USER_DATA_PATH'] + user_id + '/pages/' + pageName + ".xml")
#    root = tree.getroot()

#    print(root, "yoyoyoyo")

#    xml_string = etree.tostring(root).decode('utf-8')

#    xml_string = xml_string.replace("\n", "")

#    type = tree.xpath("/canvas/meta/type")[0].text

#    notes = pd.read_sql_query("select * from Notes where page_id = ?",
#                              engine.connect(),
#                              params=[page_id])

   # Notes = Note.query.filter_by(page_id = pageID).first()

#    print("print notes")
#    print(notes)
    #print(Notes)

#    return render_template('/page.html', xml_string=xml_string, page_id=page_id, user_id=user_id, pages=pages, title=title)




