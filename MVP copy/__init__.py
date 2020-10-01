from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_dropzone import Dropzone
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
import os

def create_application():

    application = Flask(__name__)
    #application.config.from_object('MVP.config')

    return application

application = create_application()

dropzone = Dropzone(application)

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

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(128))
    last_name = db.Column(db.String(128))
    email = db.Column(db.String(128))
    phone = db.Column(db.String(128))

    __tablename__ = "Users"

class Page (db.Model):

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128))
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'))

    __tablename__ = "Pages"

class File (db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))

    __tablename__ = "Files"

tags = db.Table('tags',
    db.Column('page_id', db.Integer, db.ForeignKey('Pages.id'), primary_key=True),
    db.Column('file_id', db.Integer, db.ForeignKey('Files.id'), primary_key=True)
)

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

@application.route('/results')
def results():
    return render_template('results.html')


@application.route('/', methods=['GET', 'POST'])
@application.route("/home", methods=['GET', 'POST'])
def home():

    pageID = "1"

    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['STATIC_PATH'] + pageName + ".xml")
    root = tree.getroot()

    xml_string = etree.tostring(root).decode('utf-8')

    xml_string = xml_string.replace("\n", "")

    return render_template('/page.html', xml_string=xml_string, pageID = pageID)

@application.route("/open_page/<pageID>", methods=['GET', 'POST'])
def open_page(pageID):

    print("open page")

    request_data = request.get_json()
    pageID = str(pageID)

    pageName = 'Page_' + pageID

    print(pageName)

    tree = etree.parse(application.config['STATIC_PATH'] + pageName + ".xml")
    root = tree.getroot()

    print(root)

    xml_string = etree.tostring(root).decode('utf-8')

    xml_string = xml_string.replace("\n", "")

    return render_template('/page.html', xml_string=xml_string, pageID=pageID)


@application.route("/update_position/<pageID>", methods=['POST'])
def update_position(pageID):

    request_data = request.get_json()
    _id = str(request_data.get('id'))
    new_x = str(request_data.get('x'))[:-2]
    new_y = str(request_data.get('y'))[:-2]
    print(_id, new_x, new_y)

    pageID = str(pageID)
    print(pageID)
    pageName = 'Page_' + pageID
    print(pageName)

    tree = etree.parse(application.config['STATIC_PATH'] + pageName + ".xml")
    root = tree.getroot()

    tree.xpath("/canvas/notes/note[@id='" + _id + "']/x")[0].text = new_x
    tree.xpath("/canvas/notes/note[@id='" + _id + "']/y")[0].text = new_y

    f = open(application.config['STATIC_PATH'] + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"

@application.route("/create_note/<pageID>", methods=['POST'])
def create_note(pageID):

    # get the data for new note
    request_data = request.get_json()
    new_x = str(request_data.get('x'))
    new_y = str(request_data.get('y'))
    print( new_x, new_y)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['STATIC_PATH'] + pageName + ".xml")
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # set the note's x, y and content = "new note"
    new_note.set("id",id)
    new_note.set("class", "note")
    etree.SubElement(new_note, "x").text = new_x
    etree.SubElement(new_note, "y").text = new_y
    etree.SubElement(new_note, "content").text = "new content"

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml
    f = open(application.config['STATIC_PATH'] + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"

@application.route("/delete_note/<pageID>", methods=['POST'])
def delete_note(pageID):

    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    print( id )

    pageID = str(pageID)
    print(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['STATIC_PATH'] + pageName + ".xml")
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    print(etree.tostring(note, pretty_print=True))

    note.getparent().remove(note)

    # save the changes in the xml
    f = open(application.config['STATIC_PATH'] + pageName + ".xml", 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"

@application.route("/update_content/<pageID>", methods=['POST'])
def update_content(pageID):
    request_data = request.get_json()
    _id = str(request_data.get('id'))
    content = str(request_data.get('content'))

    print(_id, content)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    tree.xpath("/canvas/notes/note[@id='" + _id + "']/content")[0].text = content

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"

@application.route("/add_link/<pageID>", methods=['POST'])
def add_link(pageID):

    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    link = str(request_data.get('link'))

    print(id,link)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    note.set("class", "noteLink")

    print(etree.tostring(note, pretty_print=True))

    etree.SubElement(note, "link").text = link

    print(etree.tostring(note, pretty_print=True))

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"

@application.route("/change_link/<pageID>", methods=['POST'])
def change_link(pageID):

    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    link = str(request_data.get('link'))

    print(id,link)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    note.find("link").text = link

    print(etree.tostring(note, pretty_print=True))

    #etree.SubElement(note, "link").text = link

    print(etree.tostring(note, pretty_print=True))

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    return "yo"

@application.route("/upload_file/<pageID>", methods=['POST'])
def upload_file(pageID):

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    print("upload file route")

    ### add the file to uploads

    Request = request.form
    print(Request)

    x = Request.get('x')
    y = Request.get('y')
    file = request.files.get('file')
    print(x, y, file)

    file.save("/Users/macbook/PycharmProjects/MVP/MVP/static/uploads/" + file.filename)

    ### keep the information that this file is in this page in the 'tags' many to many SQL table

    engine.execute("insert into Files (name) VALUES ( %(name)s )", {'name': file.filename})

    file_id = engine.execute("SELECT id FROM Files ORDER BY id DESC LIMIT 1").fetchone()[0]
    print("file_id")
    print(file_id)

    engine.execute("insert into tags (page_id, file_id) VALUES ( %(page_id)s, %(file_id)s )",
                   {'page_id': pageID, 'file_id': file_id})

    ### add a note in the XML with the x, y positions and the name of the file

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # set the note's x, y and content = "title" (for now)
    new_note.set("id", id)
    new_note.set("class", "file")
    etree.SubElement(new_note, "x").text = x
    etree.SubElement(new_note, "y").text = y
    etree.SubElement(new_note, "name").text = str(file.filename)
    etree.SubElement(new_note, "file_id").text = str(file_id)

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    return "yo"

@application.route("/new_page/<pageID>", methods=['POST'])
def new_page(pageID):

    request_data = request.get_json()
    title = str(request_data.get('title'))
    user_id = 1

    print(title)
    print("testing")

    # creer une nouvelle ligne dans la table 'Pages' de la DB

    engine.execute("insert into Pages (user_id, title) VALUES (%s, %s)", (user_id, title))

    # obtenir l'ID de cette nouvelle page dans la DB

    newPageID = Page.query.all()[-1].id

    print(newPageID)

    # A partir de cette ID créer le nom de la nouvelle page XML

    newPageName = 'Page_' + str(newPageID)

    print(newPageName)

    # Créer une nouvelle page XML et lui donner le titre

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/newPage.xml')
    root = tree.getroot()

    root.find("notes").find("note[@id='0']").find("content").text = title

    print(etree.tostring(root, pretty_print=True))

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + newPageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    # Créer un lien vers cette page sur la page en cours

    new_x = str(request_data.get('new_x'))
    new_y = str(request_data.get('new_y'))

    print(new_x, new_y)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # set the note's x, y and content = "title" (for now)
    new_note.set("id", id)
    new_note.set("class", "pageLink")
    etree.SubElement(new_note, "x").text = new_x
    etree.SubElement(new_note, "y").text = new_y
    etree.SubElement(new_note, "content").text = title
    etree.SubElement(new_note, "title").text = title
    etree.SubElement(new_note, "pageID").text = str(newPageID)

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()


if __name__ == '__main__':
    application.run(debug=True)