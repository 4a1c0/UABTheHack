from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

app = ClarifaiApp(api_key='f53aa080f78d418fb75051b03f80d3c4')

model = app.models.get('food-items-v1.0')
# image = ClImage(url='https://s3.amazonaws.com/clarifai-api/img2/prod/small/b8ea54acf15c4642a5ba985bda8b9633/de65940cc1524bf3a01563a7bf8ddac7')
image = ClImage(file_obj=open('/home/marco/Programes/Hackathons/LocalHackDay2017/Images/notPizza0.jpeg', 'rb'))
response = model.predict([image])
elements = response['outputs'][0]['data']['concepts']

isPizzaThreshold = 0.85
isPineappleThreshold = 0.3
isPizza = False
isPineapple = False

for element in elements:
    if (element['name'] == 'pizza') and (element['value'] > isPizzaThreshold):
        isPizza = True
    if (element['name'] == 'pineapple') and (element['value'] > isPineappleThreshold):
        isPineapple = True

if isPineapple and isPizza:
    print('Get the hell out of here')
elif isPizza:
    print('Your pizza passes the standards of the anti pineapple pizza community.')
