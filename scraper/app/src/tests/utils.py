'''Tests utils'''

from modules.shops import jimms, karkkainen, elisa, power, verkkokauppa, tietokonekauppa, multitronic, mikromafia, euronics


TEST_KEYWORD = 'samsung galaxy a8'


def check_response(response, self):
    '''Test response type'''
    self.assertEqual(type(response), dict, "Should be dict")


def check_response_data(response, self):
    '''Test response["data"] type'''
    self.assertEqual(type(response['data']), list, "Should be array (list)")


def check_response_shop(response, self):
    '''Test response["data"] type'''
    self.assertEqual(type(response['shop']), str, "Should be string (str)")


def check_response_count(response, self):
    '''Test response["data"] type'''
    self.assertEqual(type(response['count']), int, "Should be integer (int)")


def make_request(shop, self):
    '''Make request to get data from shop and run tests'''
    response = globals()[shop](TEST_KEYWORD)
    check_response(response, self)
    check_response_data(response, self)
    check_response_shop(response, self)
    check_response_count(response, self)
    # print(f'{shop}: run type tests')
