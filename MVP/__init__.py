from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_dropzone import Dropzone
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
import os
import json

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

parents = db.Table('parents',
    db.Column('parent_page_id', db.Integer, db.ForeignKey('Pages.id'), primary_key=True),
    db.Column('child_page_id', db.Integer, db.ForeignKey('Pages.id'), primary_key=True)
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


    return render_template('/page.html', xml_string=xml_string, pageID=pageID, pages=pages, title=title)


@application.route("/update_position/<pageID>", methods=['POST'])
def update_position(pageID):

    print("update position")

    request_data = request.get_json()
    _id = str(request_data.get('id'))
    new_x = str(request_data.get('x'))[:-2]
    new_y = str(request_data.get('y'))[:-2]
    print(_id, new_x, new_y)

    pageID = str(pageID)
    print(pageID)
    pageName = 'Page_' + pageID
    print(pageName)

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    print(etree.tostring(root, pretty_print=True))

    tree.xpath("/canvas/notes/note[@id='" + _id + "']/x")[0].text = new_x
    tree.xpath("/canvas/notes/note[@id='" + _id + "']/y")[0].text = new_y

    print(etree.tostring(root, pretty_print=True))

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    pass

@application.route("/create_note/<pageID>", methods=['POST'])
def create_note(pageID):

    # get the data for new note
    request_data = request.get_json()
    new_x = str(request_data.get('x'))
    new_y = str(request_data.get('y'))
    print( new_x, new_y)

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

    # set the note's x, y and content = "new note"
    new_note.set("id",id)
    new_note.set("class", "note")
    etree.SubElement(new_note, "x").text = new_x
    etree.SubElement(new_note, "y").text = new_y
    etree.SubElement(new_note, "content").text = "new content"

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    pass

@application.route("/delete_note/<pageID>", methods=['POST'])
def delete_note(pageID):

    # get the data for new note
    request_data = request.get_json()
    id = str(request_data.get('id'))
    print( id )

    pageID = str(pageID)
    print(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + id + "']")

    print(etree.tostring(note, pretty_print=True))

    note.getparent().remove(note)

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()
    pass

@application.route("/update_content/<pageID>", methods=['POST'])
def update_content(pageID):

    print("update content")

    request_data = request.get_json()
    _id = str(request_data.get('id'))
    content = str(request_data.get('content'))

    pageID = str(pageID)

    # change title in DB if the note changed is the title.
    if _id == '0':
        print("change title")
        engine.execute("Update Pages set title = %(content)s where id= %(pageID)s ", {'content':content, 'pageID':pageID})

    else:
        pageName = 'Page_' + pageID

        tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
        root = tree.getroot()

        tree.xpath("/canvas/notes/note[@id='" + _id + "']/content")[0].text = content

        f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

    pass

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
    pass

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
    pass

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
    width = etree.Element('width')
    height = etree.Element('height')
    new_note.insert(0, height)
    new_note.insert(0, width)

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()

    pass

@application.route("/new_page/<pageID>", methods=['POST'])
def new_page(pageID):

    page_title = Page.query.filter_by(id=pageID).first().title

    request_data = request.get_json()
    new_page_title = str(request_data.get('title'))
    user_id = 1

    print(new_page_title)
    print("testing")

    # creer une nouvelle ligne dans la table 'Pages' de la DB

    engine.execute("insert into Pages (user_id, title) VALUES (%s, %s)", (user_id, new_page_title))

    # obtenir l'ID de cette nouvelle page dans la DB

    newPageID = Page.query.all()[-1].id +1

    print(newPageID)

    # ajouter relation parent-enfant dans la DB
    engine.execute("insert into parents (parent_page_id, child_page_id) VALUES ( %(pageID)s, %(newPageID)s )", {'pageID':pageID, 'newPageID':newPageID})

    # A partir de cette ID créer le nom de la nouvelle page XML

    newPageName = 'Page_' + str(newPageID)

    print(newPageName)

    # Créer une nouvelle page XML

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/newPage.xml')
    root = tree.getroot()

    # get x and y of title
    title_x = root.find("notes").find("note[@id='0']").find("x").text
    title_y = root.find("notes").find("note[@id='0']").find("y").text

    print(title_x, title_y)

    # ajouter la note 'page parente' dans le xml
    # c'est une note de class="pageLink", type="parent", id=1, pageID=pageID, x = title_x -10, y = title_y- 30, content=title

    # create a new note
    notes = root.find("notes")
    notes.append(etree.Element("note"))
    new_note = notes[-1]

    # classifier/parametrer la note
    new_note.set("id", "1")
    new_note.set("class", "pageLink")
    new_note.set("pageID", str(pageID))
    new_note.set("type", "parent")
    etree.SubElement(new_note, "x").text = title_x
    etree.SubElement(new_note, "y").text = str(int(title_y)-80)
    etree.SubElement(new_note, "content").text = page_title

    # biggest id=1
    tree.xpath("/canvas/meta/biggest_id")[0].text = "1"

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
    new_note.set("pageID", str(newPageID))
    new_note.set("type", 'child')
    etree.SubElement(new_note, "x").text = new_x
    etree.SubElement(new_note, "y").text = new_y
    etree.SubElement(new_note, "content").text = new_page_title

    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()


@application.route("/unload/<pageID>", methods=['GET','POST'])
def unload(pageID):

    request_data = request.get_json()
    data = request_data.get('data')

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml')
    root = tree.getroot()

    print("UNLOADDDDIIIINNNNGGG")

    print(data)

    for i in range(len(data)):
        id = str(data[i]["id"])
        width = str(data[i]["width"])
        height = str(data[i]["height"])
        print(id,height,width)

        tree.xpath("/canvas/notes/note[@id='" + id + "']/width")[0].text = width
        tree.xpath("/canvas/notes/note[@id='" + id + "']/height")[0].text = height

        print("funnymarco")

        print(etree.tostring(root, pretty_print=True))

    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + pageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()



    pass



if __name__ == '__main__':
    application.run(debug=True)