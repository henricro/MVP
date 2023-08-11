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


page_links = db.Table('page_links',
    db.Column('parent_id', db.Integer, db.ForeignKey('Pages.global_id')),
    db.Column('child_id', db.Integer, db.ForeignKey('Pages.global_id'))
)


class Page (db.Model):

    global_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    id = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(128))
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), nullable=False)
    official_parent_id = db.Column(db.Integer, db.ForeignKey('Pages.global_id'))


    __tablename__ = "Pages"

    __table_args__ = (
        UniqueConstraint('user_id', 'id', name='uix_user_id_id'),
    )


