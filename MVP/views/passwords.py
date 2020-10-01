import random
import string
import hashlib

from flask import Flask, render_template, url_for, flash, redirect, session, request, abort, send_from_directory
from MVP.forms import  ChangePasswordForm, ForgotPasswordForm

from flask_login import LoginManager, UserMixin, current_user
from flask import g, request, redirect

from MVP.views.celery import send_email2

def get_hashed_password(password):
    return hashlib.md5(password.encode()).hexdigest()

from MVP import application, db, login_manager, engine, user_required
from MVP.models import *


@application.route("/forgot_password", methods=['GET','POST'])
def forgot_password():
    form = ForgotPasswordForm()

    if form.is_submitted():
        email = form.email.data
        getemails = "SELECT email from Users where email = %(email)s"
        result = engine.execute(getemails, {'email': email})
        allemails = result.fetchall()
        if len(allemails)==0:
            flash(f"L'adresse email ne fait pas partie de nos utilisateurs", 'danger')
        else :
            base_query = User.query.filter_by(email=email).first()
            firstname = base_query.first_name
            lastname = base_query.last_name
            password = ''.join(random.choice(string.ascii_letters) for i in range(8))
            html2 = render_template('new_password_email.html',
                                **{'firstname': firstname, 'lastname': lastname, 'password':password})
            send_email2.delay("nouveau mot de passe Mokki", "nouveau mot de passe Mokki", html2, to=email)
            encrypted_password = get_hashed_password(password)
            engine.execute("update Users set password= %(password)s where email= %(email)s",{'email': email, 'password': encrypted_password})
            flash(f"Un nouveau mot de passe vous a été envoyé à votre adresse", 'success')

    return render_template('/passwords/forgot_password.html', form=form)


@application.route("/reset_password", methods=['GET','POST'])
def reset_password():

    form=ChangePasswordForm()

    if form.is_submitted():

        email = form.email.data
        old_password=form.old_password.data
        new_password=form.new_password.data
        confirm_password=form.confirm_password.data

        base_query = User.query.filter_by(email=email).first()
        password = base_query.password
        user_id = base_query.id

        if get_hashed_password(old_password)==password :
            if new_password==confirm_password:
                print("passwords match and old password good")
                encrypted_password = get_hashed_password(new_password)
                flash(f"Your password has been changed", "success")
                engine.execute("update Users set password= %(new_password)s where id= %(user_id)s",{'user_id':user_id, 'new_password':encrypted_password})
                return redirect(url_for('login'))
            else:
                print("passwords dont match")
                flash(f"Passwords don't match", "danger")
        else :
            print("wrong bloody password you dumb fuck")
            flash(f"Wrong password", "danger")

    return render_template('/passwords/reset_password.html', form=form)
