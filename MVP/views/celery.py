
from celery import Celery

from flask_mail import Mail, Message

from twilio.rest import Client

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import os
import smtplib
import uuid

from MVP import application, db, login_manager, engine, user_required
from MVP.models import *

# CELERY_TASKS = ['.']
#from app_folder.models import Admin, User
#query = User.query.filter_by(first_name='uygu').all()

celery = Celery(application.name, backend="redis://localhost:6379/1", broker="redis://localhost:6379/1")  # , include=CELERY_TASKS)
#celery = Celery(application.name, backend="redis://mokkiapp3.aln3lh.ng.0001.euw3.cache.amazonaws.com:6379/1", broker="redis://mokkiapp3.aln3lh.ng.0001.euw3.cache.amazonaws.com:6379/1", include=CELERY_TASKS)

mail = Mail(application)
celery.conf.update(application.config)


@celery.task()
def send_email2(subject, text, html, to='henri.crozel@gmail.com'):
    sender = application.config.get('MAIL_USERNAME')
    # text = text.decode('utf-8')
    #import pudb; pu.db
    # Create message container - the correct MIME type is multipart/alternative.
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = to

    # Record the MIME types of both parts - text/plain and text/html.
    part1 = MIMEText(text, 'plain')
    part2 = MIMEText(html, 'html')

    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    msg.attach(part1)
    msg.attach(part2)

    # Send the message via local SMTP server.

    s=smtplib.SMTP('smtp.gmail.com', 587)
    s.ehlo()
    s.starttls()
    s.login(sender, application.config.get('MAIL_PASSWORD'))

    s.sendmail(sender, to, msg.as_string().encode('utf-8'))
    s.quit()

