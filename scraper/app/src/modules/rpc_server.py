'''RPC client'''


from os import environ

import logging
import re
import json
import pika

from modules.products import get_products
from modules.details import get_details

BROKER_HOST = 'localhost'
if "BROKER_HOST" in environ:
    BROKER_HOST = environ['BROKER_HOST']

connection = pika.BlockingConnection(
    pika.ConnectionParameters(host=BROKER_HOST))
channel = connection.channel()
channel.queue_declare(queue='search')


def keyword_is_valid(keyword):
    '''Validate keyword'''
    # https://regexr.com/
    # allow
    if bool(re.search(r"^[a-öA-Ö0-9-_.,\s]*$", keyword)) is False:
        logging.info('keyword contains special characters...')
        return False
    return True


def on_request(ch__, method, props, body):
    '''On RPC request'''
    # n__ = body.decode('utf-8')
    n__ = json.loads(body.decode('utf-8').replace("'", '"'))

    keyword = n__['keyword']
    logging.info("keyword: %s", keyword)

    response = []

    if n__['proc'] == 'search' and keyword_is_valid(keyword):
        response = get_products(keyword)
    elif n__['proc'] == 'details' and keyword_is_valid(keyword):
        response = get_details(keyword)

    ch__.basic_publish(exchange='',
                       routing_key=props.reply_to,
                       properties=pika.BasicProperties(
                           correlation_id=props.correlation_id),
                       body=str(response))
    ch__.basic_ack(delivery_tag=method.delivery_tag)


def start_listening():
    '''Listening RPC requests'''
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue='search', on_message_callback=on_request)

    logging.info("Awaiting RPC requests")
    channel.start_consuming()
