import os
import dotenv

dotenv.load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

PREFERRED_URL_SCHEME = os.environ.get('PREFERRED_URL_SCHEME')

DEBUG = True

WTF_CSRF_ENABLED = True
SECRET_KEY = 'dsaf0897sfdg45sfdgfdsaqzdf98sdf0a'

# administrator list
ADMINS = ['henri.crozel@gmail.com']


### PRODUCTION DB
#SQLALCHEMY_DATABASE_URI = os.environ.get('SQLDATABASE_URI', 'mysql+pymysql://henricro:ist0reGYST@ch121926-001.dbaas.ovh.net:35951/gystdb')

### LOCAL DEV DB
# SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://mokkiappdb_dev:mokkiappdb_dev@mokkiappdbdev.cc561awiz5c5.eu-west-3.rds.amazonaws.com:3306/mokkiappdb_dev'

### SERVER DOMAIN
#SERVER_DOMAIN= os.environ.get('SERVER_DOMAIN', "146.59.153.123")




DEBUG = True
SQLALCHEMY_TRACK_MODIFICATIONS = True
