from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree


@application.route('/', methods=['GET', 'POST'])
@application.route("/home", methods=['GET', 'POST'])
def home():

    pages = engine.execute("select id, title from Pages").fetchall()
    pages = dict(pages)
    print(pages)

    pageID = "1"

    pageName = 'Page_' + pageID

    title = Page.query.filter_by(id=pageID).first().title

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    xml_string = etree.tostring(root).decode('utf-8')

    xml_string = xml_string.replace("\n", "")

    return render_template('/page.html', xml_string=xml_string, pageID = pageID, pages=pages, title=title)



@application.route("/open_page/<pageID>", methods=['GET', 'POST'])
def open_page(pageID):

    print("opening page")

    print(pageID)

    # get the parents of the page
    parents = engine.execute("select * from parents where child_page_id= %(pageID)s", {'pageID':pageID}).fetchall()
    parents=dict(parents)
    print(parents)

    pages = engine.execute("select id, title from Pages").fetchall()
    pages = dict(pages)
    print(pages)

    print("open page")

    request_data = request.get_json()
    pageID = str(pageID)

    pageName = 'Page_' + pageID

    print(pageName)

    title = Page.query.filter_by(id=pageID).first().title

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    print(root)

    xml_string = etree.tostring(root).decode('utf-8')

    xml_string = xml_string.replace("\n", "")

    type = tree.xpath("/canvas/meta/type")[0].text

    if type == "book":
        return render_template('/bookPage.html', xml_string=xml_string, pageID=pageID, pages=pages, title=title)

    return render_template('/page.html', xml_string=xml_string, pageID=pageID, pages=pages, title=title)
