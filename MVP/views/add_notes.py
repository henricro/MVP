from MVP import application, db, engine
from MVP.models import *

import pandas as pd

from MVP import application, db, login_manager, engine, user_required
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_login import LoginManager, UserMixin, current_user


from flask_login import login_user, logout_user, current_user

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

#user = User.query.filter_by(id=1).first()
#login_user(user)


@application.route("/add_notes/<page_id>/<user_id>", methods=['GET','POST'])
@user_required()
def add_notes(page_id, user_id):

    print("ourhiufkfjb")

    title = Page.query.filter_by(id = page_id).first().title

    notes = Note.query.filter_by(page_id = page_id).first()

    Notes = pd.read_sql_query("select * from Notes where page_id = ?", engine.connect(), params=[page_id])

    print(Notes)
    print(notes)

    return "yo"




