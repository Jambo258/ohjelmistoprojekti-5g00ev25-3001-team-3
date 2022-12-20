'''Shop tests'''
import unittest

from tests.utils import check_response, check_response_data, check_response_shop, check_response_count, make_request


class TestPower(unittest.TestCase):
    '''power test class'''

    def test_types(self):
        '''power test types'''
        shop = 'power'
        make_request(shop, self)


class TestVerkkokauppa(unittest.TestCase):
    '''verkkokauppa test class'''

    def test_types(self):
        '''verkkokauppa test types'''
        shop = 'verkkokauppa'
        make_request(shop, self)


class TestJimms(unittest.TestCase):
    '''jimms test class'''

    def test_types(self):
        '''jimms test types'''
        shop = 'jimms'
        make_request(shop, self)


class TestKarkkainen(unittest.TestCase):
    '''karkkainen test class'''

    def test_types(self):
        '''karkkainen test types'''
        shop = 'karkkainen'
        make_request(shop, self)


class TestElisa(unittest.TestCase):
    '''elisa test class'''

    def test_types(self):
        '''elisa test types'''
        shop = 'elisa'
        make_request(shop, self)


class TestTietokonekauppa(unittest.TestCase):
    '''tietokonekauppa test class'''

    def test_types(self):
        '''tietokonekauppa test types'''
        shop = 'tietokonekauppa'
        make_request(shop, self)


class TestMultitronic(unittest.TestCase):
    '''multitronic test class'''

    def test_types(self):
        '''multitronic test types'''
        shop = 'multitronic'
        make_request(shop, self)


class TestMikromafia(unittest.TestCase):
    '''mikromafia test class'''

    def test_types(self):
        '''mikromafia test types'''
        shop = 'mikromafia'
        make_request(shop, self)


class TestEuronics(unittest.TestCase):
    '''euronics test class'''

    def test_types(self):
        '''euronics test types'''
        shop = 'euronics'
        make_request(shop, self)
