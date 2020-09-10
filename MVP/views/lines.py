from MVP import application, db, engine
from MVP.models import *

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree


def common_data(list1, list2):
    result = False

    # traverse in the 1st list
    for x in list1:

        # traverse in the 2nd list
        for y in list2:

            # if one common
            if x == y:
                result = True
                return x

    return result


@application.route("/link_notes/<pageID>", methods=['POST'])
def link_notes(pageID):

    print("route : link notes")

    # get the data for new note
    request_data = request.get_json()
    id_1 = str(request_data.get(
        'id_1'))
    id_2 = str(request_data.get('id_2'))

    print(id_1, id_2)

    pageID = str(pageID)
    pageName = 'Page_' + pageID

    tree = etree.parse(application.config['STATIC_PATH'] + pageName + ".xml")
    root = tree.getroot()

    connexions = root.find("connexions")

    if connexions is not None:

        test1 = tree.xpath("/canvas/connexions/connexion[ @id_1='" + id_1 + "' and @id_2='" + id_2 + "' ] ")
        test2 = tree.xpath("/canvas/connexions/connexion[ @id_1='" + id_2 + "' and @id_2='" + id_1 + "' ] ")

        print("test1, test2")
        print(test1, test2)

        if test1:

            line = test1[0]

            print(line)

            line.getparent().remove(line)

            # save the changes in the xml
            f = open(application.config['STATIC_PATH'] + pageName + ".xml", 'wb')
            f.write(etree.tostring(root, pretty_print=True))
            f.close()


        elif test2:
            line = test2[0]

            print(line)

            line.getparent().remove(line)

            # save the changes in the xml
            f = open(application.config['STATIC_PATH'] + pageName + ".xml", 'wb')
            f.write(etree.tostring(root, pretty_print=True))
            f.close()

        else :

                print("tests unsuccessfull")
                connexions.append(etree.Element("connexion"))
                new_connexion = connexions[-1]
                new_connexion.set("id_1", id_1)
                new_connexion.set("id_2", id_2)

                # save the changes in the xml
                f = open(application.config['STATIC_PATH'] + pageName + ".xml", 'wb')
                f.write(etree.tostring(root, pretty_print=True))
                f.close()

    else:

        root.append(etree.Element("connexions"))
        connexions = root.find("connexions")
        connexions.append(etree.Element("connexion"))
        new_connexion = connexions[-1]
        new_connexion.set("id_1", id_1)
        new_connexion.set("id_2", id_2)

        # save the changes in the xml
        f = open(application.config['STATIC_PATH'] + pageName + ".xml", 'wb')
        f.write(etree.tostring(root, pretty_print=True))
        f.close()

        return "yo"



