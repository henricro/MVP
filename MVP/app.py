from flask import Flask, render_template, make_response
from MVP import application

@application.route("/")
def index():

    return render_template('home.html')

@application.route("/home")
def home():

    template = render_template('/MVP/home.xml')
    response = make_response(template)
    response.headers['Content-Type'] = 'application/xml'

    return response

