import os
import binascii

from flask import Flask, render_template, request, jsonify
from clarifai.rest import ClarifaiApp
from clarifai.rest import Image as ClImage

app = Flask(__name__)

appclar = ClarifaiApp(api_key='f53aa080f78d418fb75051b03f80d3c4')
model = appclar.models.get('food-items-v1.0')

def IsPizza(url):

    app = ClarifaiApp(api_key='f53aa080f78d418fb75051b03f80d3c4')

    model = app.models.get('food-items-v1.0')
    # image = ClImage(url='https://s3.amazonaws.com/clarifai-api/img2/prod/small/b8ea54acf15c4642a5ba985bda8b9633/de65940cc1524bf3a01563a7bf8ddac7')
    image = ClImage(url)
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
        response = 'Get the hell out of here.'
    elif isPizza:
        response = 'Your pizza passes the standards of the anti pineapple pizza community.'
    else:
        response = 'That is no pizza man.'
    return response



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
        image = binascii.a2b_base64(format(request.form['src']))
        ba = bytearray(image)
        # elements = model.predict_by_base64(base64_bytes=image)['outputs'][0]['data']['concepts']
        elements = model.predict_by_bytes(raw_bytes=ba)['outputs'][0]['data']['concepts']

        isPizzaThreshold = 0.85
        isPineappleThreshold = 0.01
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
        response = IsPizza(url)

    else:
        response = 'No recognized data type'

    return response


def padding_left(s, c, n):
    if (not s or not c) or len(s) >= n:
        return s

    max = (n - s.length) / len(c)
    for i in range(max):
        s = c + s
    return s


def bin_encode(data):
    binArray = []
    datEncode = ""

    for i in range(len(data)):
        binArray.append(data[i].charCodeAt(0).toString(2))

    for j in range(len(binArray)):
        pad = padding_left(binArray[j], '0', 8)
        datEncode += pad + ' '

    return binArray


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
