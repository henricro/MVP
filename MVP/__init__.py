from flask import Flask, redirect, url_for, render_template, make_response, request

from lxml import etree
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_dropzone import Dropzone
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
import os
import json
from flask_login import LoginManager, current_user
from functools import wraps

import dotenv

import sys

dotenv.load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '../.env'))

basedir = os.path.abspath(os.path.dirname(__file__))


def create_application():

    application = Flask(__name__)

    return application

application = create_application()

dropzone = Dropzone(application)

application.config['UPLOADED_PATH'] = os.path.join(basedir, 'static/uploads/')
application.config['STATIC_PATH'] = os.path.join(basedir, 'static/')
application.config['PAGES_PATH'] = os.path.join(basedir, 'pages/')
application.config['TEMPLATES_PATH'] = os.path.join(basedir, 'templates/')
application.config['USER_DATA_PATH'] = os.path.join(basedir, 'static/user_data/users/')


application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True


application.config['DROPZONE_UPLOAD_MULTIPLE'] = True
application.config['DROPZONE_ALLOWED_FILE_CUSTOM'] = True
application.config['DROPZONE_ALLOWED_FILE_TYPE'] = 'image/*'
application.config['DROPZONE_REDIRECT_VIEW'] = 'results'

application.config['MAIL_USERNAME'] = 'gyst.webapp@gmail.com'
application.config['MAIL_PASSWORD'] = 'bwhddzfhhiiyqair'
application.config['MAIL_DEFAULT_SENDER'] = 'gyst.webapp@gmail.com'

#application.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://henricro:ist0reGYST@ch121926-001.dbaas.ovh.net:35951/gystdb'
#application.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLDATABASE_URI', 'mysql+pymysql://root:ohL0RDjesus!@127.0.0.1:3306/gystdb')

#correct one
application.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLDATABASE_URI', 'mysql+pymysql://root:ohL0RDjesus!@127.0.0.1:3306/gystdb')

application.config['SQLALCHEMY_ENGINE_OPTIONS'] = {'pool_pre_ping': True}


#### LOCAL GYST DB
#application.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:il0ved4t4@127.0.0.1:3306/gystdblocal'

#### PRODUCTION DB
#application.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:ohL0RDjesus!@127.0.0.1:3306/gystdb'



### SERVER DOMAIN
application.config['SERVER_DOMAIN'] = os.environ.get('SERVER_DOMAIN','https://gyst.fr:1234')
#application.config['SERVER_DOMAIN'] = 'http://0.0.0.0'


db = SQLAlchemy(application)
migrate = Migrate(application, db)


engine = db.engine


login_manager = LoginManager()
login_manager.init_app(application)


application.debug=True
application.secret_key = 'hC1YCIWOj9GgWspgNEo2'



'''
@application.route('/', methods=['GET', 'POST'])
def index():
    # list to hold our uploaded image urls
    file_urls = []

    if request.method == 'POST':
        file_obj = request.files
        for f in file_obj:
            file = request.files.get(f)

            # save the file with to our photos folder
            filename = photos.save(
                file,
                name=file.filename
            )
            # append image urls
            file_urls.append(photos.url(filename))

        return "uploading..."
    return render_template('index.html')
'''

def user_required():
    def decor(func):
        @wraps(func)
        def inner1(*args, **kwargs):

            if not current_user.is_authenticated:
                print("mamamama")
                return redirect(url_for('login'))
            else :
                return func(*args, **kwargs)
        return inner1
    return decor


from MVP.views import create_note, delete_note, links, new_page, open_page, unload, update, upload_image, upload, login, celery_view, login, passwords, \
    add_image_to_pageLink, change_image_imagePageLink, change_image_imageLink, \
    youtube, move_note, paste_note, add_css, lines, categories, sign_up, lists, save_sizes

