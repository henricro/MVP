from MVP import application

import urllib.request

# urllib.request.urlretrieve("http://img.youtube.com/vi/WHUVJyfbMRg/0.jpg", "/Users/macbook/PycharmProjects/MVP/MVP/static/uploads/youtube-WHUVJyfbMRg.jpg")

### example
resource = urllib.request.urlopen("http://img.youtube.com/vi/WHUVJyfbMRg/0.jpg")
output = open(application.config['UPLOADED_PATH']+"file02.jpg","wb")
output.write(resource.read())
output.close()

# code : import youtube thumbnail

youtube_link = "https://www.youtube.com/watch?v=4y99orgXqUY"

youtube_id = youtube_link.split("v=",1)[1]
#print(youtube_id)

youtube_thumbnail = "http://img.youtube.com/vi/" + youtube_id + "/0.jpg"
#print(youtube_thumbnail)

resource = urllib.request.urlopen(youtube_thumbnail)
output = open(application.config['UPLOADED_PATH']+ "youtube/" + youtube_id + ".jpg" ,"wb")
output.write(resource.read())
output.close()


