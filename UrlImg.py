
from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage
import validators


def IsPizza(image1):

	app = ClarifaiApp(api_key='f53aa080f78d418fb75051b03f80d3c4')

	model = app.models.get('food-items-v1.0')
	# image = ClImage(url='https://s3.amazonaws.com/clarifai-api/img2/prod/small/b8ea54acf15c4642a5ba985bda8b9633/de65940cc1524bf3a01563a7bf8ddac7')
	
	if validators.url(image1): 
		image = ClImage(image1)
	else:
		image = ClImage(open(image1))


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

IsPizza('https://estaticos.miarevista.es/media/cache/680x_thumb/uploads/images/article/5941496f5bafe808143c9869/ppal-pizzapina_0.jpg')

IsPizza('ppal-pizzapina_0.jpg')