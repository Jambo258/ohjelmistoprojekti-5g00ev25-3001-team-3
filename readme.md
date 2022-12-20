## Project information

| DESC        | CONTENT                                               |
| ----------- | ----------------------------------------------------- |
| Name        | Product review app                                    |
| Prod Server | 172.16.6.248                                          |
| Dev Server  | 172.16.4.245                                          |
| Members     | Otto Lähde, Jani Myllymaa, Roni Niemi, Onni Ollanketo |

## Development instructions

### Required software

- Python3 & venv
- Node >= 16
- Docker

## Scraper

### Dev

Run at scraper/app

- Start rabbitmq broker: `docker compose -f docker-compose.dev.yml up -d`
- Create venv if not created already: `python3 -m venv env`
- Activate python enviroment: `source env/bin/activate`
- Install python packages: `pip install -r requirements.txt`

Run at scraper/app/src

- Start python script: `python main.py`

### Test

Run at scraper/app

- Start rabbitmq broker: `docker compose -f docker-compose.dev.yml up -d`
- Create venv if not created already: `python3 -m venv env`
- Activate python enviroment: `source env/bin/activate`
- Install python packages: `pip install -r requirements.txt`
- Install extra deps for testing: `pip install pytest pytest-cov pylint nose2 nose2[coverage_plugin]`
- Run linting: `pylint --disable=line-too-long,too-many-locals,pointless-string-statement,unused-import ./src/\*`

Run at scraper/app/src

- Run tests: `python -m nose2 --with-coverage`

## API

### Dev

Run at /api

- Install deps: `yarn`
- Start docker: `yarn test:up`
- Migrate pg: `yarn testdb:up`
- Build routes & run tsc: `yarn build`
- Start the server: `yarn start`

### Test

- Install deps: `yarn`
- Start docker: `yarn test:up`
- Migrate pg: `yarn testdb:up`
- Build routes & run tsc: `yarn build`
- Run tests: `yarn test`

## Client

### Dev

Run at /api

- Install deps: `yarn`
- Start client: `yarn start`

### Test

- Install deps: `yarn`
- Run tests: `yarn test`
