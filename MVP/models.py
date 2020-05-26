from MVP import db
'''
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
'''