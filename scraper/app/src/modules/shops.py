'''Shop functions'''

import concurrent.futures
import time
import re

from modules.helpper import make_get_request, make_post_request, format_price, stop_timer


def get_data_from_shops(query):
    '''Get products from shops'''
    processes = []
    joined_products = []
    stats = {
        'products': 0,
        'shops': 0
    }

    with concurrent.futures.ThreadPoolExecutor(max_workers=None) as executor:
        processes.append(executor.submit(verkkokauppa, query))
        # processes.append(executor.submit(jimms, query))
        processes.append(executor.submit(karkkainen, query))
        processes.append(executor.submit(power, query))
        processes.append(executor.submit(elisa, query))
        processes.append(executor.submit(tietokonekauppa, query))
        processes.append(executor.submit(multitronic, query))
        processes.append(executor.submit(mikromafia, query))
        processes.append(executor.submit(euronics, query))

        for _ in concurrent.futures.as_completed(processes):
            result = _.result()
            joined_products += result['data']
            stats['products'] += result['count']
            if result['count'] > 0:
                stats['shops'] += 1

    return {
        'stats': stats,
        'data': joined_products,
    }


def elisa(query):
    '''Scrape products from elisa'''
    shop = 'elisa'
    start = time.time()

    url = 'https://elisa.fi/kauppa/rest/klevu/search/v2/landingPage'

    params = {
        'searchTerm': query,
        'limit': 48,
        'offset': 0
    }

    response = make_get_request(url, params, 'json')

    if response['status'] != 'success':
        stop_timer(start, shop, 0, response['status'])
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }
    if len(response['data']) == 0:
        stop_timer(start, shop, 0)
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    products = response['data']['queryResults'][0]['records']
    parsed = []

    for product in products:
        price = format_price(product['price'])
        item = {
            'name': str(product['name']),
            'price': str(price),
            'img': str(product['image']),
            'ean': str(product['sku']),
            'url': str(product['url']),
            'shop': str(shop)
        }

        item['price'] = format_price(product['price'])
        parsed.append(item)

    stop_timer(start, shop, len(parsed))

    return {
        'data': parsed,
        'shop': shop,
        'count': len(parsed)
    }


def power(query):
    '''Scrape products from power'''
    shop = 'power'
    start = time.time()

    url = 'https://www.power.fi/api/v2/productlists'

    params = {'q': query, 'size': 10}

    response = make_get_request(url, params, 'json')

    if response['status'] != 'success':
        stop_timer(start, shop, 0, response['status'])
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }
    if len(response['data']) == 0:
        stop_timer(start, shop, 0)
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    products = response['data']['products']
    parsed = []

    for product in products:
        item = {
            'name': str(product['title']),
            'price': 0,
            'img': '',
            'ean': str(product['eanGtin12']),
            'url': '',
            'shop': str(shop)
        }

        item['price'] = format_price(product['price'])
        # img = product['primaryImage2']
        item['url'] = f"https://www.power.fi/{str(product['url'])}"

        parsed.append(item)

    stop_timer(start, shop, len(parsed))

    return {
        'data': parsed,
        'shop': shop,
        'count': len(parsed)
    }


def verkkokauppa(query):
    '''Scrape products from verkkokauppa'''
    shop = 'verkkokauppa'
    start = time.time()

    url = 'https://web-api.service.verkkokauppa.com/search-suggestions'
    params = {'query': query}

    response = make_get_request(url, params, 'json')

    if response['status'] != 'success':
        stop_timer(start, shop, 0, response['status'])
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }
    if len(response['data']) == 0:
        stop_timer(start, shop, 0)
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    products = response['data']['suggestions']['products']
    parsed = []

    for product in products:
        item = {
            'name': str(product['name']['fi']),
            'price': 0,
            'img': '',
            'ean': '',
            'url': str(product['clickURL']),
            'shop': shop
        }

        item['price'] = format_price(product['price']['currentFormatted'])
        item['img'] = str(product['images'][0]['90'])

        if len(product['eans']) > 0:
            item['ean'] = str(product['eans'][0])

        parsed.append(item)

    stop_timer(start, shop, len(parsed))

    return {
        'data': parsed,
        'shop': shop,
        'count': len(parsed)
    }


def jimms(query):
    '''Scrape products from jimms'''
    shop = 'jimms'
    start = time.time()

    params = {'q': query}

    url = 'https://www.jimms.fi/qps.ashx'
    response = make_get_request(url, params, 'json')

    if response['status'] != 'success':
        stop_timer(start, shop, 0, response['status'])
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }
    if len(response['data']) == 0:
        stop_timer(start, shop, 0)
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    parsed = []

    for product in response['data']:

        item = {
            'name': str(product['Name']),
            'price': 0,
            'img': '',
            'ean': '',
            'url': '',
            'shop': shop
        }

        item['price'] = format_price(product['Price'])
        item['img'] = str(product['ImageUrl'].replace(
            '//images', 'https://images'))
        item['url'] = f"https://www.jimms.fi/fi/Product/Show/{str(product['Uri'])}"

        parsed.append(item)

    stop_timer(start, shop, len(parsed))

    return {
        'data': parsed,
        'shop': shop,
        'count': len(parsed)
    }


def karkkainen(query):
    '''Scrape products from karkkainen'''
    shop = 'karkkainen'
    start = time.time()

    params = {
        'orderBy': 0,
        'pageView': 'list',
        'fromPage': 'catalogEntryList',
        'beginIndex': 0,
        'term': query
    }

    url = f'https://www.karkkainen.com/verkkokauppa/haku/{query}'
    response = make_get_request(url, params, 'bs4')

    if response['status'] != 'success':
        stop_timer(start, shop, 0, response['status'])
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }
    if not response['data']:
        stop_timer(start, shop, 0)
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    product_container = response['data'].body.find(
        'div', attrs={'class': 'product_listing_container'})

    products = []

    if product_container:
        products = product_container.find_all(
            'div', attrs={'class': 'product-img-info-row'})
    else:
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    parsed = []

    for product in products:
        item = {
            'name': product.find(
                'h2', attrs={'class': 'product_name'}).find('a').text,
            'price': '',
            'img': '',
            'url': product.find(
                'h2', attrs={'class': 'product_name'}).find('a')["href"],
            'ean': '',
            'shop': shop
        }

        # price
        price = product.find('div', attrs={'class': 'price-display'}).find(
            'div', attrs={'itemprop': 'price'}).find('span', attrs={'class': 'price'})
        euros = price.find('span', attrs={'class': 'euros'}).text
        cents = price.find('span', attrs={'class': 'cents'}).text
        # join price components
        # format and remove whitespaces
        item['price'] = format_price(f'{euros}.{cents}')

        # image
        wrong_img = product.find('a', attrs={'class': 'product-image-link'})
        # remove wrong image
        wrong_img.clear()
        # get right image
        img = product.find('img')["data-src"]
        item['img'] = img

        ean = re.search('tuotekuvat/(.*)/', img)
        if ean:
            item['ean'] = str(ean.group(1).split('_')[0])

        parsed.append(item)

    stop_timer(start, shop, len(parsed))

    return {
        'data': parsed,
        'shop': shop,
        'count': len(parsed)
    }


def tietokonekauppa(query):
    '''Scrape products from tietokonekauppa'''
    shop = 'tietokonekauppa'
    start = time.time()

    url = 'https://tietokonekauppa.fi/products/search'
    params = {'term': query}

    response = make_get_request(url, params, 'json')

    if response['status'] != 'success':
        stop_timer(start, shop, 0, response['status'])
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }
    if len(response['data']) == 0:
        stop_timer(start, shop, 0)
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    products = response['data']['product']['main']
    parsed = []

    for product in products:
        data = {
            'name': str(product['Product']['title']),
            'price': format_price(product['Product']['price']),
            'img': '',
            'ean': str(product['Product']['ean']),
            'url': f"https://tietokonekauppa.fi/products/{product['Product']['id']}",
            'shop': shop
        }

        if product['Product']['main_image']:
            data['img'] = f"https://tietokonekauppa.fi{product['Product']['main_image']['path_standard']}"

        parsed.append(data)

    stop_timer(start, shop, len(parsed))

    return {
        'data': parsed,
        'shop': shop,
        'count': len(parsed)
    }


def multitronic(query):
    '''Scrape products from multitronic'''
    shop = 'multitronic'
    start = time.time()

    data = {
        'lang': 'fi',
        'c': 'search',
        'keywords': query
    }

    url = 'https://www.multitronic.fi/fi/search/getfiltersanddata/id/undefined'
    response = make_post_request(url, data, 'bs4')

    if response['status'] != 'success':
        stop_timer(start, shop, 0, response['status'])
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }
    if not response['data']:
        stop_timer(start, shop, 0)
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    product_container = response['data'].find(
        'div', attrs={'id': 'actualSearchList'})

    products = []

    if product_container:
        products = product_container.find_all(
            'div', attrs={'class': 'listThumbWrapper'})
    else:
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    parsed = []

    for index, product in enumerate(products):
        if index >= 10:
            break
        item = {
            'name': product.find('div', attrs={'class': 'product_description'})
            .find('a', attrs={'class': 'pTitle'}).text,
            'price': 0,
            'img': product.find('div', attrs={'class': 'product_image'})
            .find('img', attrs={'class': 'img-responsive'})["src"],
            'url': '',
            'ean': '',
            'shop': shop
        }

        end_url = product.find('div', attrs={'class': 'product_description'}).find(
            'a', attrs={'class': 'pTitle'})["href"]

        item['url'] = f"https://www.multitronic.fi{end_url}"

        price_string = product.find('div', attrs={'class': 'product_description'}).find(
            'div', attrs={'class': 'prodListEntry'})["data-price"]

        item['price'] = format_price(price_string)

        # ean codes
        # product_details = make_get_request(item['url'], {}, 'bs4')
        # item['ean'] = json.loads(product_details.body.find(
        #     'script', attrs={'type': 'application/ld+json'}).text)[1]['gtin13']

        parsed.append(item)

    stop_timer(start, shop, len(parsed))

    return {
        'data': parsed,
        'shop': shop,
        'count': len(parsed)
    }


def mikromafia(query):
    '''Scrape products from mikromafia'''
    shop = 'mikromafia'
    start = time.time()

    url = 'https://mafia.fi/etsi'
    data = {
        's': query,
        'resultsPerPage': '10'
    }

    headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
    }

    response = make_post_request(url, data, 'json', headers)

    if response['status'] != 'success':
        stop_timer(start, shop, 0, response['status'])
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }
    if len(response['data']) == 0:
        stop_timer(start, shop, 0)
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    products = response['data']['products']
    parsed = []

    for product in products:
        data = {
            'name': product['name'],
            'price': format_price(product['price']),
            'img': product['cover']['medium']['url'],
            'ean': '',
            'url': product['url'],
            'shop': shop
        }

        ean = re.search('-(.*).html', product['canonical_url'])
        data['ean'] = str(ean.group(1).split('-')[-1])

        parsed.append(data)

    stop_timer(start, shop, len(parsed))

    return {
        'data': parsed,
        'shop': shop,
        'count': len(parsed)
    }


def euronics(query):
    '''Scrape products from euronics'''
    shop = 'euronics'
    start = time.time()

    url = 'https://www.euronics.fi/backend/api/v1/products'
    params = {
        'inStock': '0',
        'text': query,
        'orderBy': 'RELEVANCE',
        'order': 'DESC',
        'excludeContent': '1',
        'lang': 'fi'
    }

    headers = {
        'Accept': 'application/json, text/plain, */*',
    }

    response = make_get_request(url, params, 'json', headers)

    if response['status'] != 'success':
        stop_timer(start, shop, 0, response['status'])
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }
    if len(response['data']) == 0:
        stop_timer(start, shop, 0)
        return {
            'data': [],
            'shop': shop,
            'count': 0
        }

    products = response['data']['data']
    parsed = []

    for product in products:
        data = {
            'name': product['name'],
            'price': format_price(product['price_info']['price']['with_tax']),
            'img': f"https://www.euronics.fi{product['images'][0]['sizes']['medium']}",
            'ean': product['ean'],
            'url': '',
            'shop': shop
        }

        data['url'] = f"https://www.euronics.fi/{product['slug']}/p/{product['ean']}/"

        parsed.append(data)

    stop_timer(start, shop, len(parsed))

    return {
        'data': parsed,
        'shop': shop,
        'count': len(parsed)
    }
