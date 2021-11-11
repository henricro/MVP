from MVP import application, db, engine
from MVP.models import *

import pandas as pd

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

'''
# OLD CREATE NOTE
@application.route("/create_note/<page_id>/<user_id>", methods=['GET', 'POST'])
def create_note(page_id, user_id):

    print("route for create note")

    request_data = request.get_json()
    x = str(request_data.get('x'))
    y = str(request_data.get('y'))
    page_id = str(request_data.get('page_id'))
    user_id = str(request_data.get('user_id'))

    pd.read_sql_query("insert into Notes page_id, x, y, text, user_id VALUES(?, ?, ?, ?, ?)",
                      engine.connect(),
                      params=[page_id, x, y, "new note", user_id])

    return redirect(url_for("open_page", page_id=page_id, user_id=user_id))



'''

# CREATE NOTE
@application.route("/create_note", methods=['GET', 'POST'])
def create_note():

    print("route for create note")

    request_data = request.get_json()
    x = str(request_data.get('x'))
    y = str(request_data.get('y'))
    page_id = str(request_data.get('page_id'))
    user_id = str(request_data.get('user_id'))

    print(request_data)

    #pd.read_sql_query("insert into Notes page_id, x, y, text, user_id VALUES(?, ?, ?, ?, ?)",
     #                 engine.connect(),
      #                params=[page_id, x, y, "new note", user_id])


    engine.execute (
        "insert into Notes (page_id, x, y, text, user_id, css) "
        "VALUES (%(page_id)s, %(x)s, %(y)s, 'new note', %(user_id)s, '')",
        {'page_id' : page_id, 'x':x, 'y':y, 'user_id':user_id}
    )

    pages = engine.execute("select * from Pages").fetchall()

    print(pages)

    #return redirect(url_for("open_page", page_id=page_id, user_id=user_id))

    return "yo"



