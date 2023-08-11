from MVP import db, application
from sqlalchemy import UniqueConstraint



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

    global_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    page_id = db.Column(db.Integer, nullable=False)
    id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(128))
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)

    __tablename__ = "Pages"

    __table_args__ = (
        UniqueConstraint('user_id', 'id', name='uix_user_id_id'),
    )


'''
def get_page_table_name(user_id):
    return f"Pages_User_{user_id}"


def create_user_page_table(user_id):
    table_name = get_page_table_name(user_id)

    # Create a new MetaData object
    new_metadata = db.MetaData()

    # Reflect the existing table definitions into the new MetaData
    new_metadata.reflect(bind=db.engine)

    # Create a new table using the separate MetaData and Engine
    user_page_table = db.Table(
        table_name,
        new_metadata,
        db.Column('id', db.Integer, primary_key=True),
        db.Column('title', db.String(255)),
        db.Column('user_id', db.Integer, db.ForeignKey('Users.id')),
        # Add other page-related fields as needed
    )

    # Create the new table in the database
    user_page_table.create(db.engine)

    return user_page_table

'''

class Image (db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    type = db.Column(db.String(128))

    __tablename__ = "Images"

class Pdf (db.Model):

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))

    __tablename__ = "Pdfs"




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

