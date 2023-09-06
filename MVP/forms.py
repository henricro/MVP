from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, BooleanField, SelectField, SelectMultipleField, IntegerField, PasswordField, TextAreaField, FloatField
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
    # New Fields
    gender = SelectField('Gender', choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')])
    age_group = SelectField('Age Group',
                            choices=[('0-18', '0-18'), ('18-25', '18-25'), ('25-35', '25-35'), ('35-50', '35-50'),
                                     ('50-65', '50-65'), ('65-80', '65-80'), ('80+', '80+')])
    location = SelectField('Location', choices=[
        ('north_america', 'North America'), ('south_america', 'South America'),
        ('north_africa', 'North Africa'), ('south_africa', 'South Africa'),
        ('western_europe', 'Western Europe'), ('eastern_europe', 'Eastern Europe'),
        ('middle_east', 'Middle East'), ('central_asia', 'Central Asia'),
        ('south_asia', 'South Asia'), ('southeast_asia', 'Southeast Asia'),
        ('oceania', 'Oceania')])
    interests = SelectMultipleField('Interests', choices=[
        ('travel', 'Travel'), ('education', 'Education'), ('cooking', 'Cooking'),
        ('personal_development', 'Personal Development'),
        ('note_taking', 'Note-taking'), ('reading_and_entertainment', 'Reading and Entertainment'),
        ('journaling', 'Journaling'), ('knowledge_management', 'Knowledge Management'),
        ('project_management', 'Project Management'), ('home_management', 'Home Management')
    ])
    submit = SubmitField('Go')




