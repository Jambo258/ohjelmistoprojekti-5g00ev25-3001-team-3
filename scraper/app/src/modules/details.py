'''Details functions'''

import time
import logging
import json

from modules.shops import get_data_from_shops


def get_details(ean):
    '''Get product details'''
    start = time.time()

    details = get_data_from_shops(ean)

    # sort lowest price first
    lowest_first_products = sorted(
        details['data'], key=lambda i: i['price'], reverse=False)

    end = time.time()

    logging.info(
        "%s products fetched in %sms", len(details['data']), round((end-start)*10**3, 3))

    return json.dumps({
        'stats': details['stats'],
        'data': lowest_first_products
    })
