'''MAIN'''

import logging
from modules.rpc_server import start_listening


def main():
    '''main function'''
    format_ = "%(asctime)s %(levelname)-8s %(message)s"
    logging.basicConfig(format=format_, level=logging.INFO,
                        datefmt="%Y-%m-%d %H:%M:%S")
    logging.info("Starting app...")
    start_listening()


if __name__ == "__main__":
    main()
