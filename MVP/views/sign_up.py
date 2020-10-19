
from flask import Flask, render_template, url_for, flash, redirect, session, request, abort, send_from_directory, Response, request, redirect
from MVP.forms import SignUpForm

from datetime import timedelta, datetime

from flask import request, redirect
from sqlalchemy import or_

from flask_login import login_user
from MVP.views.celery import send_email2
from MVP.views.passwords import get_hashed_password

import uuid

from MVP.models import *

from MVP import application, db, login_manager, engine, user_required

import os

from lxml import etree
#import sys


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

        email=form.email.data
        password=form.password.data
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
            flash(f"Thanks ! 🙏 Just click on the link in the confirmtion email we sent you and you'll be good to go ☺️", 'success')

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

    user=User.query.filter_by(verification_token=verification_token).first()
    print(user, "yoyoyoyo")
    email=user.email

    engine.execute("update Users set is_active = True where verification_token = %(verification_token)s;",
                           {'verification_token': verification_token})

    user_id = str(user.id)

    login_user(user)

    os.mkdir(application.config['USER_DATA_PATH'] + user_id)
    os.mkdir(application.config['USER_DATA_PATH'] + user_id + '/pages/')
    os.mkdir(application.config['USER_DATA_PATH'] + user_id + '/uploads/')

    engine.execute("insert into Pages (user_id, title) VALUES (%s, %s)", (user_id, 'GYST'))

    tree = etree.parse(application.config['TEMPLATES_PATH'] + 'newPage.xml')
    root = tree.getroot()

    # create a new note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # classifier/parametrer la note
    new_note.set("id", "1")
    new_note.set("class", "note")
    etree.SubElement(new_note, "x").text = "500"
    etree.SubElement(new_note, "y").text = "500"
    etree.SubElement(new_note, "content").text = 'hi there :)'

    # biggest id=1
    tree.xpath("/canvas/meta/biggest_id")[0].text = "1"

    f = open(application.config['USER_DATA_PATH'] + user_id + "/pages/Page_1.xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return redirect(url_for('home', user_id=user_id))

