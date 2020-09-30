import os
import dotenv
dotenv.load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

PREFERRED_URL_SCHEME = os.environ.get('PREFERRED_URL_SCHEME')

DEBUG = True

WTF_CSRF_ENABLED = True
SECRET_KEY = 'dsaf0897sfdg45sfdgfdsaqzdf98sdf0a'

# administrator list
ADMINS = ['henri.crozel@gmail.com']

MAIL_USERNAME = 'henri.crozel@gmail.com'
MAIL_PASSWORD = '4nnabellee'
MAIL_DEFAULT_SENDER = 'henri.crozel@gmail.com'


### phpMyAdmin DB
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:root@localhost:8889/MVP'

DEBUG = True
SQLALCHEMY_TRACK_MODIFICATIONS = True