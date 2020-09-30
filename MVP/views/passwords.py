import random
import string
import hashlib

from flask import Flask, render_template, url_for, flash, redirect, session, request, abort, send_from_directory
from MVP.forms import  ChangePasswordForm, ForgotPasswordForm, CreatePasswordForm

from flask_login import LoginManager, UserMixin, current_user
from flask import g, request, redirect

from MVP.views.celery import send_email2

def get_hashed_password(password):
    return hashlib.md5(password.encode()).hexdigest()

from MVP import application, db, login_manager, engine, user_required
from MVP.models import *

@application.route("/create_password", methods=['GET','POST'])

def create_password():
    form = CreatePasswordForm()

    if form.is_submitted():
        email = form.email.data
        getemails = "SELECT email from Users where email = %(email)s"
        result = engine.execute(getemails, {'email': email})
        allemails = result.fetchall()
        #print(len(allemails))
        #print('yolo')
        if len(allemails)==0:
            flash(f"L'adresse email ne fait pas partie de nos utilisateurs", 'danger')
        else :
            base_query = User.query.filter_by(email=email).first()
            #user=User.query.get(email=email)
            password=form.password.data
            confirm_password=form.confirm_password.data
            if base_query.password :
                flash(f"Un mot de passe est déjà associé à ce compte")
            else:
                if not password == confirm_password:
                    flash(f"Les mots de passe ne correspondent pas", 'danger')
                else:
                    user_id = User.query.filter_by(email=email).first().id
                    encrypted_password = get_hashed_password(password)
                    engine.execute("update Users set password= %(password)s where email= %(email)s",{'email': email, 'password': encrypted_password})
                    flash(f"Votre mot de passe a été créé", 'success')
                return(redirect(url_for('login')))

    return render_template('/passwords/create_password.html', form=form)


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
            html2 = render_template('emails/new_password_email.html',
                                **{'firstname': firstname, 'lastname': lastname, 'password':password})
            send_email2.delay("nouveau mot de passe Mokki", "nouveau mot de passe Mokki", html2, to=email)
            encrypted_password = get_hashed_password(password)
            engine.execute("update Users set password= %(password)s where email= %(email)s",{'email': email, 'password': encrypted_password})
            flash(f"Un nouveau mot de passe vous a été envoyé à votre adresse", 'success')

    return render_template('/passwords/forgot_password.html', form=form)


@application.route("/reset_password/<user_id>", methods=['GET','POST'])
@user_required()
def reset_password(user_id):

    firstname = User.query.filter_by(id = user_id).first().first_name
    lastname = User.query.filter_by(id=user_id).first().last_name

    form=ChangePasswordForm()
    base_query = User.query.filter_by(id=user_id).first()
    password=base_query.password
    print(password)
    if form.is_submitted():
        firstname=base_query.first_name
        lastname=base_query.last_name
        email=base_query.email
        old_password=form.old_password.data
        new_password=form.new_password.data
        confirm_password=form.confirm_password.data
        if get_hashed_password(old_password)==password :
            if new_password==confirm_password:
                encrypted_password = get_hashed_password(new_password)
                flash(f"Votre mot de passe a été changé", "success")
                engine.execute("update Users set password= %(new_password)s where id= %(user_id)s",{'user_id':user_id, 'new_password':encrypted_password})
                return redirect(url_for('login'))
            else:
                flash(f"Les mots de passe ne correspondent pas", "danger")
        else :
            flash(f"l'ancien mot de passe n'est pas le bon", "danger")
    return render_template('/passwords/reset_password.html', form=form, user_id=user_id, firstname= firstname, lastname= lastname)
