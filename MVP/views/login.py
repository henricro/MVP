
import hashlib
from flask import Flask, render_template, url_for, flash, redirect, session, request, abort, send_from_directory
from MVP.forms import LoginForm

from flask import g, request, redirect

from flask_login import login_user, logout_user, current_user

from MVP.views.passwords import get_hashed_password

from MVP import application, db, login_manager, engine, user_required
from MVP.models import *

@login_manager.user_loader
def load_user(user_id):
    #print("Load user called with " + str(user_id))
    return User.query.get(user_id)

@application.route('/', methods=['GET', 'POST'])
@application.route('/login', methods=['GET', 'POST'])
def login():
    # Here we use a class of some kind to represent and validate our
    # client-side form data. For example, WTForms is a library that will
    # handle this for us, and we use a custom LoginForm to validate.
    form = LoginForm()
    if form.validate_on_submit():
        # Login and validate the user.
        # user should be an instance of your `User` class
        email=form.email.data
        password = form.password.data
        encrypted_password = hashlib.md5(password.encode()).hexdigest()
        user = User.query.filter_by(email=email).first()
        user_id = str(user.id)
        print(user)
        print(user_id)
        print("hohohohohohohohohohohhoo")
        if user is not None and encrypted_password==user.password:
            print(current_user.is_authenticated)

            login_user(user)
            print(current_user.is_authenticated)
            print("password is correct")
            return redirect(url_for('home', user_id=user_id))

        else:
            print("password is incorrect")
            pass

    return render_template('/login.html', form=form)