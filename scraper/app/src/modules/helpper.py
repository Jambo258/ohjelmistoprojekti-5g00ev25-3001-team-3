'''Help functions'''

import logging
import time
import unicodedata
import warnings
import json
from bs4 import BeautifulSoup as bs
from requests import Session
from requests.exceptions import ConnectTimeout, RequestException, ReadTimeout
from requests.packages import urllib3

warnings.filterwarnings('ignore', message='Unverified HTTPS request')
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

TIMEOUT = 2.5


def return_response(data, mode, status):
    '''response formatting'''
    response = {
        'status': status,
        'data': data
    }

    if mode == 'json' and data is not None:
        response['data'] = json.loads(data)
    if mode == 'bs4' and data is not None:
        response['data'] = bs(data, 'html.parser')

    return response


def make_get_request(url, params, mode='json', headers=None):
    '''Make GET request
    return JSON or bs4'''
    with Session() as s__:
        try:
            r__ = s__.get(url, params=params, verify=False,
                          headers=headers, timeout=TIMEOUT)
            return return_response(r__.text, mode, 'success')
        except ConnectTimeout:
            return return_response(None, mode, 'connect timeout')
        except ReadTimeout:
            return return_response(None, mode, 'read timeout')
        except RequestException:
            return return_response(None, mode, 'error')


def make_post_request(url, data, mode='json', headers=None):
    '''Make POST request
    return JSON or bs4'''
    with Session() as s__:
        try:
            r__ = s__.post(url, data=data, verify=False,
                           headers=headers, timeout=TIMEOUT)
            return return_response(r__.text, mode, 'success')
        except ConnectTimeout:
            return return_response(None, mode, 'connect timeout')
        except ReadTimeout:
            return return_response(None, mode, 'read timeout')
        except RequestException:
            return return_response(None, mode, 'error')


def format_price(price):
    '''Format and remove whitespaces'''
    return f'{float(unicodedata.normalize("NFKD", str(price)).replace("€", "").replace(" ", "").replace(",", ".")): .2f}'


def stop_timer(start, shop, count, status=''):
    '''stops the timer'''

    end = time.time()
    status_s = ''
    if status:
        status_s = f" ({status})"

    logging.info("%s products fetched from %s in %sms%s", count,
                 shop, round((end-start)*10**3, 3), status_s)
