import os

from flask import Flask, render_template, request, jsonify
from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

app = Flask(__name__)

appclar = ClarifaiApp(api_key='f53aa080f78d418fb75051b03f80d3c4')
model = appclar.models.get('food-items-v1.0')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/pineapplePizza.js')
def pineapple_pizza_js():
    return render_template('pineapplePizza.js')


@app.route('/pineapplePizza.css')
def pineapple_pizza_css():
    return render_template('pineapplePizza.css')


@app.route('/submit', methods=['POST'])
def submit():

    response = ""
    data = request.form['data']


    if data == 'bin':
        image = request.files['src']  
        #image = request.files['src']
        elements = model.predict_by_bytes(raw_bytes=image.stream.read())['outputs'][0]['data']['concepts']

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
            response = 'Get the hell out of here.'
        elif isPizza:
            response = 'Your pizza passes the standards of the anti pineapple pizza community.'
        else:
            response = 'That is no pizza man.'

    elif data == 'url':
        response = 'Test'
        pass

    else:
        response = 'No recognized data type'

    return response


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
