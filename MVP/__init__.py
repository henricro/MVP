from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_dropzone import Dropzone
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
import os
import json




basedir = os.path.abspath(os.path.dirname(__file__))

#print(basedir)

def create_application():

    application = Flask(__name__)
    #application.config.from_object('MVP.config')

    return application

application = create_application()

dropzone = Dropzone(application)

application.config['UPLOADED_PATH'] = os.path.join(basedir, 'MVP/static/uploads/')

print(application.config['UPLOADED_PATH'])

application.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost:8889/MVP'
application.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

application.config['DROPZONE_UPLOAD_MULTIPLE'] = True
application.config['DROPZONE_ALLOWED_FILE_CUSTOM'] = True
application.config['DROPZONE_ALLOWED_FILE_TYPE'] = 'image/*'
application.config['DROPZONE_REDIRECT_VIEW'] = 'results'

application.config['UPLOADED_PHOTOS_DEST'] = os.getcwd() + '/uploads'
photos = UploadSet('photos', IMAGES)
configure_uploads(application, photos)
patch_request_class(application)  # set maximum file size, default is 16MB

db = SQLAlchemy(application)
migrate = Migrate(application, db)

engine = db.engine

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


from MVP.views import create_note, delete_note, links, new_book, new_page, open_page, unload, update, upload_image, upload_pdf, add_image_to_pageLink

if __name__ == '__main__':
    application.run(debug=True)