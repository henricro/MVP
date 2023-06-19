from MVP import application, db, engine
from MVP.models import *
import random

from flask import Flask, redirect, url_for, render_template, make_response, request
from lxml import etree

from selenium import webdriver

# Path to the web driver executable
driver_path = '/Users/user/Downloads/chromedriver'


# Create a new instance of the Chrome driver
driver = webdriver.Chrome(executable_path=driver_path)


# URL of the page to capture
url = 'https://www.eurosport.fr'


# Open the web page
driver.get(url)


# Capture a screenshot and save it to a file
driver.save_screenshot('screenshotg2.png')


# Close the browser
driver.quit()


