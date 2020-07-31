from MVP import application, db, engine
from MVP.models import *
import random

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

@application.route("/paste_note/<pageID>", methods=['POST'])
def paste_note(pageID):

    print("paste note route")

    # get the data of note to move and page to move to

    request_data = request.get_json()
    originPageID = str(request_data.get('originPageID'))
    note_id = str(request_data.get('note_id'))
    x = request_data.get('x')
    y = request_data.get('y')

    print(originPageID, note_id, x, y)

    ## Get the note in the xml from the page where it was copied from
    originPageName = 'Page_' + originPageID

    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + originPageName + '.xml')
    root = tree.getroot()

    note = root.find("notes").find("note[@id='" + note_id + "']")

    print("copied the note :")
    print(etree.tostring(note, pretty_print=True))

    ## Copy that note in the current page

    PageName = 'Page_' + pageID
    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml')
    root = tree.getroot()

    # get the biggest id in the xml and increment the value
    id = tree.xpath("/canvas/meta/biggest_id")[0].text
    id = int(id) + 1
    id = str(id)
    tree.xpath("/canvas/meta/biggest_id")[0].text = id

    # add a note
    notes = root.find("notes")
    notes.append(note)

    # change the note's id
    note.set("id", id)

    ## if info about position, input the position
    tree.xpath("/canvas/notes/note[@id='" + id + "']/x")[0].text = x
    tree.xpath("/canvas/notes/note[@id='" + id + "']/y")[0].text = y

    print("added the note to current page's xml :")
    print(etree.tostring(root, pretty_print=True))

    # save the changes in the xml
    f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml', 'wb')
    f.write(etree.tostring(root, pretty_print=True))
    f.close()


    pass




@application.route("/paste_pageLink/<pageID>", methods=['POST'])
def paste_pageLink(pageID):

    print("route : paste pageLink")

    # get the data of note to move and page to move to

    request_data = request.get_json()
    originPageID = str(request_data.get('originPageID'))
    note_id = str(request_data.get('note_id'))
    x = request_data.get('x')
    y = request_data.get('y')
    type = request_data.get('type')

    print(originPageID, note_id, x, y)

    ## Get the note in the xml from the page where it was copied from
    originPageName = 'Page_' + originPageID
    tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + originPageName + '.xml')
    root = tree.getroot()
    note = root.find("notes").find("note[@id='" + note_id + "']")

    destPageID = note.get("pageID")
    destPageName = 'Page_' + destPageID

    PageName = 'Page_' + pageID

    if type == "visitor":

    ## Copy that note in the current page

        tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml')
        root = tree.getroot()

        # get the biggest id in the xml and increment the value
        id = tree.xpath("/canvas/meta/biggest_id")[0].text
        id = int(id) + 1
        id = str(id)
        tree.xpath("/canvas/meta/biggest_id")[0].text = id

        # add a note
        notes = root.find("notes")
        notes.append(note)

        # change the note's id
        note.set("id", id)

        note.set("type", "visitor")
        # ajouter relation visitor-visited dans la DB
        # engine.execute("insert into visitors (visitor_page_id, visited_page_id) VALUES ( %(destPageID)s, %(pageID)s )",
        #              {'destPageID': destPageID, 'pageID': pageID})

        tree.xpath("/canvas/notes/note[@id='" + id + "']/x")[0].text = x
        tree.xpath("/canvas/notes/note[@id='" + id + "']/y")[0].text = y

        # save the changes in the xml
        f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml', 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

    elif type == "child":

        #### put pageLink child in current page

        tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml')
        root = tree.getroot()

        # get the biggest id in the xml and increment the value
        id = tree.xpath("/canvas/meta/biggest_id")[0].text
        id = int(id) + 1
        id = str(id)
        tree.xpath("/canvas/meta/biggest_id")[0].text = id

        # add a note
        notes = root.find("notes")
        notes.append(note)

        # change the note's id
        note.set("id", id)

        note.set("type", "child")
        # ajouter relation visitor-visited dans la DB
        # engine.execute("insert into visitors (visitor_page_id, visited_page_id) VALUES ( %(destPageID)s, %(pageID)s )",
        #              {'destPageID': destPageID, 'pageID': pageID})

        tree.xpath("/canvas/notes/note[@id='" + id + "']/x")[0].text = x
        tree.xpath("/canvas/notes/note[@id='" + id + "']/y")[0].text = y

        # save the changes in the xml
        f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml', 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        #### put pageLink parent in child page
        print('### put parent-pageLink in childPage')

        destTree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml')
        destRoot = destTree.getroot()

        print(destRoot)
        print(destPageID)
        print(destPageName)

        # get the biggest id in the xml and increment the value
        id = destTree.xpath("/canvas/meta/biggest_id")[0].text
        id = int(id) + 1
        id = str(id)
        destTree.xpath("/canvas/meta/biggest_id")[0].text = id

        print(id)

        # add a note
        notes = destRoot.find("notes")
        print(notes)
        notes.append(etree.Element("note"))
        new_note = notes[-1]

        # set the note's id, class
        new_note.set("id", id)
        new_note.set("class", "pageLink")
        new_note.set("type", "parent")
        new_note.set("pageID", pageID)

        parentName = Page.query.filter_by(id=pageID).first().title

        print(parentName)

        etree.SubElement(new_note, "content").text = parentName

        print(etree.tostring(destRoot, pretty_print=True))

        # ajouter relation visitor-visited dans la DB
        # engine.execute("insert into visitors (visitor_page_id, visited_page_id) VALUES ( %(destPageID)s, %(pageID)s )",
        #              {'destPageID': destPageID, 'pageID': pageID})

        par_x = str(random.randint(0, 100))
        par_y = str(random.randint(0, 100))

        etree.SubElement(new_note, "x").text = par_x
        etree.SubElement(new_note, "y").text = par_y

        # save the changes in the xml
        f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml', 'wb')
        f.write(etree.tostring(destRoot, pretty_print=True))
        f.close()

    elif type == "parent" :

        #### put pageLink parent in current page

        tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml')
        root = tree.getroot()

        # get the biggest id in the xml and increment the value
        id = tree.xpath("/canvas/meta/biggest_id")[0].text
        id = int(id) + 1
        id = str(id)
        tree.xpath("/canvas/meta/biggest_id")[0].text = id

        # add a note
        notes = root.find("notes")
        notes.append(note)

        # change the note's id
        note.set("id", id)

        note.set("type", "parent")
        # ajouter relation visitor-visited dans la DB
        # engine.execute("insert into visitors (visitor_page_id, visited_page_id) VALUES ( %(destPageID)s, %(pageID)s )",
        #              {'destPageID': destPageID, 'pageID': pageID})

        par_x = str(random.randint(0, 100))
        par_y = str(random.randint(0, 100))

        tree.xpath("/canvas/notes/note[@id='" + id + "']/x")[0].text = par_x
        tree.xpath("/canvas/notes/note[@id='" + id + "']/y")[0].text = par_y

        # save the changes in the xml
        f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + PageName + '.xml', 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        #### put pageLink child in parent page

        tree = etree.parse('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml')
        root = tree.getroot()

        # get the biggest id in the xml and increment the value
        id = tree.xpath("/canvas/meta/biggest_id")[0].text
        id = int(id) + 1
        id = str(id)
        tree.xpath("/canvas/meta/biggest_id")[0].text = id

        # add a note
        notes = root.find("notes")
        notes.append(etree.Element("note"))
        note = notes[-1]

        # change the note's id
        note.set("id", id)

        note.set("type", "child")
        # ajouter relation visitor-visited dans la DB
        # engine.execute("insert into visitors (visitor_page_id, visited_page_id) VALUES ( %(destPageID)s, %(pageID)s )",
        #              {'destPageID': destPageID, 'pageID': pageID})

        tree.xpath("/canvas/notes/note[@id='" + id + "']/x")[0].text = x
        tree.xpath("/canvas/notes/note[@id='" + id + "']/y")[0].text = y

        # save the changes in the xml
        f = open('/Users/macbook/PycharmProjects/MVP/MVP/static/' + destPageName + '.xml', 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

    #print("added the note to current page's xml :")
    #print(etree.tostring(root, pretty_print=True))


    pass



