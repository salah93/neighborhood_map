import json
import requests
from flask import (Flask, abort, render_template, request,
                   session, jsonify)
from functools import wraps
from utility import random_string


app = Flask(__name__)
config = json.load(open('config.json', 'r'))


def check_state_token(func):
    ''' check a request for a state token '''
    @wraps(func)
    def inner(*args, **kwargs):
        page_state = request.args.get('state')
        state = session.pop('state', None)
        if not state or page_state != state:
            abort(403)
        return func(*args, **kwargs)
    return inner


def generate_state_token():
    ''' generate a random state token,
        to be used for every post request
    '''
    if 'state' not in session:
        session['state'] = random_string(20)
    return session['state']


@app.route('/')
def home():
    google_key = config['google_maps_key']
    return render_template('index.html', google_key=google_key)


@app.route('/<yelp_id>/yelp_reviews.json')
@check_state_token
def get_reviews(yelp_id):
    '''this view returns all items in json view'''
    access_token = config['yelp']['access_token']
    headers = dict(Authorization="Bearer %s" % access_token)
    yelp_api_url = '{base}/businesses/{yelp_id}/reviews'.format(
            base=config['yelp']['base_url'], yelp_id=yelp_id)
    response = requests.get(yelp_api_url, headers=headers)
    response = response.json()
    response['state'] = generate_state_token()
    return jsonify(response)


@app.errorhandler(404)
def page_not_found(e):
    ''' default 404 page '''
    return render_template('no_such.html', _object='Page'), 404


if __name__ == '__main__':
    secret = random_string(30)
    app.secret_key = secret
    app.jinja_env.globals['state'] = generate_state_token
    params = dict(debug=True, host='localhost', port=8000)
    app.run(**params)
