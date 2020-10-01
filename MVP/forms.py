from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, BooleanField, SelectField, IntegerField, PasswordField, TextAreaField, FloatField
from wtforms.validators import DataRequired, Length, Email


class LoginForm(FlaskForm):
    email = StringField('Email')
    password = PasswordField('Password')
    submit = SubmitField('Go')

class ChangePasswordForm(FlaskForm):

    email = StringField('Email')
    old_password = PasswordField('Old password')
    new_password = PasswordField('New password')
    confirm_password = PasswordField('Confirm new password')
    submit = SubmitField('Go')

class ForgotPasswordForm(FlaskForm):
    email = StringField('Email')
    submit = SubmitField('Send new password')

class SignUpForm(FlaskForm):  # inherits from Form

    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm password')
    submit = SubmitField('Go')




