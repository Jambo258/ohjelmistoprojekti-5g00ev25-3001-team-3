'''
Producs functions
{
    name: string,
    prices: float list,
    ean: string,
    shops: string list,
    shop_count: string list,
    urls: string list,
    images: string list,
}
'''

from itertools import groupby
import time
import logging
import json

from modules.shops import get_data_from_shops


def get_products(query):
    '''Get products from shops and format them'''
    start = time.time()

    products = get_data_from_shops(query)
    grouped_products = group_products(products['data'])

    # most of the shops first
    most_of_shops_first = sorted(
        grouped_products, key=lambda i: i['shop_count'], reverse=True)

    # sort lowest price first
    # sorted_products = sorted(
    #     products, key=lambda i: i['price'], reverse=False)

    end = time.time()

    logging.info(
        "%s products fetched in %sms", len(products['data']), round((end-start)*10**3, 3))

    return json.dumps({
        'stats': products['stats'],
        'data': most_of_shops_first
    })


def key_func(k):
    '''Set key'''
    if len(k['ean']) > 0:
        return k['ean']
    return ''


def group_products(products):
    '''Get products from shops'''

    grouped_products = []
    sorted_data = sorted(products, key=key_func)

    for key, value in groupby(sorted_data, key_func):
        name = ''
        prices = []
        shops = []
        shop_count = 0
        urls = []
        images = []

        if key != '':
            for item in list(value):
                name = item['name']
                prices.append(item['price'])
                shops.append(item['shop'])
                urls.append(item['url'])
                images.append(item['img'])
                shop_count += 1

            grouped_products.append({
                'name': name,
                'ean': key,
                'prices': prices,
                'shops': shops,
                'shop_count': shop_count,
                'urls': urls,
                'images': images,
            })

    return grouped_products
