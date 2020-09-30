from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, BooleanField, SelectField, IntegerField, PasswordField, TextAreaField, FloatField
from wtforms.validators import DataRequired, Length, Email



class LoginForm(FlaskForm):
    email = StringField('Email')
    password = PasswordField('Mot de passe')
    submit = SubmitField('Se connecter')

class CreatePasswordForm(FlaskForm):
    email = StringField('Email')
    password = PasswordField('Mot de passe')
    confirm_password = PasswordField('Confirmer mot de passe')
    submit = SubmitField('Créer mot de passe')

class ChangePasswordForm(FlaskForm):
    old_password = PasswordField('Ancien mot de passe')
    new_password = PasswordField('Nouveau mot de passe')
    confirm_password = PasswordField('Confirmer nouveau mot de passe')
    submit = SubmitField('Changer de mot de passe')

class ForgotPasswordForm(FlaskForm):
    email = StringField('Email')
    submit = SubmitField('Envoyer nouveau mot de passe')



