import json
import requests
from flask import (Flask, abort, render_template, request,
                   session, jsonify)
from functools import wraps
from utility import random_string


app = Flask(__name__)
config = json.load(open('config.json', 'r'))


@app.route('/')
def home():
    google_key = config['google_maps_key']
    return render_template('index.min.html', google_key=google_key)


@app.route('/<yelp_id>/yelp_reviews.json')
def get_reviews(yelp_id):
    '''this view returns all items in json view'''
    access_token = config['yelp']['access_token']
    headers = dict(Authorization="Bearer %s" % access_token)
    yelp_api_url = '{base}/businesses/{yelp_id}/reviews'.format(
            base=config['yelp']['base_url'], yelp_id=yelp_id)
    response = requests.get(yelp_api_url, headers=headers)
    if response.status_code != 200:
        response = {'reviews': []}
    else:
        response = response.json()
    return jsonify(response)


if __name__ == '__main__':
    secret = random_string(30)
    app.secret_key = secret
    params = dict(host='localhost', port=8000)
    app.run(**params)
