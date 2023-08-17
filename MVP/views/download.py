from MVP import application, db, engine, user_required, basedir
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request, send_from_directory, send_file
from lxml import etree
from pdf2image import convert_from_path

import uuid
import os
from flask_login import LoginManager, UserMixin, current_user

from docx import Document


@application.route("/download_image", methods=['POST', 'GET'])
@user_required()
def download_image():

    print("download imaaaage")

    request_data = request.get_json()
    relative_path = request_data.get('src')  # Assuming you send the path relative to '/static' in the JSON payload

    file_path = os.path.join(basedir, relative_path.lstrip('/'))
    print(file_path)

    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return "File not found", 404