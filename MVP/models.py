from MVP import db

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(128))
    last_name = db.Column(db.String(128))
    email = db.Column(db.String(128))
    phone = db.Column(db.String(128))
    password = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    verification_token = db.Column(db.String(128))
    verification_token_expiry = db.Column(db.DateTime, nullable=True)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    __tablename__ = "Users"
    __table_args__ = {'extend_existing': True}



class Page (db.Model):

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128))
    type = db.Column(db.String(128))
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'))

    __tablename__ = "Pages"

class Image (db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    type = db.Column(db.String(128))

    __tablename__ = "Images"

class Pdf (db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))

    __tablename__ = "Pdfs"


parents = db.Table('parents',
    db.Column('parent_page_id', db.Integer, db.ForeignKey('Pages.id'), primary_key=True),
    db.Column('child_page_id', db.Integer, db.ForeignKey('Pages.id'), primary_key=True)
)

visitors = db.Table('visitors',
    db.Column('visitor_page_id', db.Integer, db.ForeignKey('Pages.id'), primary_key=True),
    db.Column('visited_page_id', db.Integer, db.ForeignKey('Pages.id'), primary_key=True)
)

pdfs_images = db.Table('pdfs_images',
    db.Column('pdf_id', db.Integer, db.ForeignKey('Pdfs.id'), primary_key=True),
    db.Column('image_id', db.Integer, db.ForeignKey('Images.id'), primary_key=True)
)

pages_images = db.Table('pages_images',
    db.Column('page_id', db.Integer, db.ForeignKey('Pages.id'), primary_key=True),
    db.Column('image_id', db.Integer, db.ForeignKey('Images.id'), primary_key=True)
)

pages_pdfs = db.Table('pages_pdfs',
    db.Column('page_id', db.Integer, db.ForeignKey('Pages.id'), primary_key=True),
    db.Column('pdf_id', db.Integer, db.ForeignKey('Pdfs.id'), primary_key=True)
)
