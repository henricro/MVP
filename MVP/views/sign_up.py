
from flask import Flask, render_template, url_for, flash, redirect, session, request, abort, send_from_directory, Response, request, redirect
from MVP.forms import SignUpForm

from datetime import timedelta, datetime

from flask import request, redirect
from sqlalchemy import or_

from MVP.views.celery_view import send_email2
from MVP.views.passwords import get_hashed_password

import uuid

from MVP.models import *

from MVP import application, db, login_manager, engine, user_required
from flask_login import login_user, logout_user, current_user

import os
import shutil

from lxml import etree
#import sys

@login_manager.user_loader
def load_user(id):
    return User.query.get(id)



### SIGN UP
@application.route("/sign_up", methods=['GET','POST']) # last bit tells what methods are allowed
def sign_up():

    data = {}

    if request.args.get('email'):
        data['email'] = request.args['email']
    if request.method == 'POST':
        form = SignUpForm()
    else:
        from werkzeug.datastructures import MultiDict
        form = SignUpForm(formdata=MultiDict(data))

    if form.is_submitted():

        email = form.email.data
        password = form.password.data
        encrypted_password = get_hashed_password(password)
        form.email.data = None

        getemails = "SELECT email from Users where email = %(email)s"
        result = engine.execute(getemails, {'email': email})
        allemails = result.fetchall()

        result.close()


        if not allemails:

            verification_token = str(uuid.uuid4())
            verification_token_expiry = datetime.now() + timedelta(hours=72)
            today=datetime.now()
            engine.execute("INSERT INTO Users(email, verification_token, "
                           "verification_token_expiry, password, is_active) VALUES (%s, %s, %s, %s, %s)",
                           (email, verification_token, verification_token_expiry, encrypted_password, 0))
            flash(f"Thanks ! 🙏 Just click on the link in the confirmation email we sent you and you'll be good to go ☺️", 'success')

            link = "{}{}{}".format(application.config['SERVER_DOMAIN'], '/confirm/', verification_token)

            text2 = "Hi,\nTo confirm you want to sign up to GYST, please click this link"

            html2 = render_template('conf_email1.html',
                                    **{'link':link})

            send_email2.delay("GYST confirmation", text2, html2, to=email)

            return render_template('/sign_up.html', form=form)

        else :

            flash(f"It looks like you already have an account associated with {email}", 'danger')
            return render_template('/sign_up.html', form=form)

    return render_template('/sign_up.html', form=form)


##### CONFIRM ###
@application.route('/confirm/<verification_token>', methods=['GET','POST'])
def confirm(verification_token):

    user = User.query.filter_by(verification_token=verification_token).first()
    print(user, "yoyoyoyo")

    engine.execute("update Users set is_active = True where verification_token = %(verification_token)s;",
                           {'verification_token': verification_token})

    user_id = str(user.id)
    user_welcome_id = "114"

    db.session.commit()

    source_folder = application.config['USER_DATA_PATH'] + user_welcome_id + "/"
    destination_folder = application.config['USER_DATA_PATH'] + user_id + '/'

    # Create the destination folder if it doesn't exist
    os.makedirs(destination_folder, exist_ok=True)

    # Copy all contents from the user_data of 'welcome_page' to this user
    for item in os.listdir(source_folder):
        source_item = os.path.join(source_folder, item)
        destination_item = os.path.join(destination_folder, item)

        if os.path.isdir(source_item):
            shutil.copytree(source_item, destination_item)
        else:
            shutil.copy2(source_item, destination_item)

    # Copy all the pages and page_links in DB from user 'welcome_page' to this user

    user_id = int(user.id)
    user_welcome_id = 114

    # Step 1: Add duplicates of rows and switch user_id in the table Pages

    engine.execute("INSERT INTO Pages (id, user_id, official_parent_id, title) "
                   "SELECT id, %(user_id)s, official_parent_id, title "
                   "FROM Pages WHERE user_id = %(user_welcome_id)s;",
                   {'user_id': user_id, 'user_welcome_id': user_welcome_id})


    # Step 2: Update official_parent_id in the newly duplicated rows
    step2_query = """
    UPDATE Pages p 
    JOIN Pages parent_of_original ON p.official_parent_id = parent_of_original.global_id 
    JOIN Pages parent_of_duplicate ON parent_of_original.id = parent_of_duplicate.id and parent_of_duplicate.user_id = %(user_id)s  
    SET p.official_parent_id = parent_of_duplicate.global_id 
    WHERE p.user_id = %(user_id)s;
    """

    engine.execute(step2_query, {'user_welcome_id': user_welcome_id, 'user_id': user_id})

    # Step 3: Create duplicates in the table page_links
    step3_query = """
        
        -- Step 3: Create duplicates in the table page_links
        INSERT INTO page_links (child_id, parent_id)
        SELECT new_child.global_id, new_parent.global_id
        FROM page_links AS tpl
        JOIN Pages old_child ON tpl.child_id = old_child.global_id
        JOIN Pages old_parent ON tpl.parent_id = old_parent.global_id
        JOIN Pages new_child ON old_child.id = new_child.id AND old_child.user_id = %(user_welcome_id)s 
        JOIN Pages new_parent ON old_parent.id = new_parent.id AND old_parent.user_id = %(user_welcome_id)s
        WHERE new_child.user_id = %(user_id)s AND new_parent.user_id = %(user_id)s;

    """

    engine.execute(step3_query, {'user_welcome_id': user_welcome_id, 'user_id': user_id})

    print("login user")

    user = User.query.filter_by(id=user_id).first()
    login_user(user)


    return redirect(url_for('home', user_id=user_id))



def get_next_page_id_for_user(user_id):
    max_page_id = db.session.query(db.func.max(Page.id)).filter(Page.user_id == user_id).scalar()
    return (max_page_id or 0) + 1

def get_next_global_id():
    max_page_id = db.session.query(db.func.max(Page.global_id)).scalar()
    return (max_page_id or 0) + 1

