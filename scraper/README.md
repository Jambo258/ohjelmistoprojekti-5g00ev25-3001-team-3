### Setup python enviroment

- run at scraper/app directory
- source env/bin/activate
- pip install -r requirements.txt

### Formatter & linting

- this project use autopep8 for formatting and pylint for linting
- to use linting in vscode, add next lines to your .vscode/settings.json
  - "python.linting.enabled": true,
  - "python.linting.pylintEnabled": true

### Dev with RabbitMQ broker

1. Setup RabbitMQ broker container

- run commands at scraper/app directory
- up
  - docker compose -f docker-compose.dev.yml up -d
- down
  - docker compose -f docker-compose.dev.yml -p 'scraper_dev' down

2. Setup API, guide here -> api/README.md
   Remember RABBITMQ_HOST=localhost variable in .env
3. run at scraper/app/src
4. python main.py
5. use swagger to send requests
   - http://localhost:5000/docs/#/default/SearchProducts
   - http://localhost:5000/docs/#/default/SearchDetails

### Dev without RabbitMQ broker

1. go to scraper/app/src directory
2. run dev.py

### Testing

- pip install nose2 nose2[coverage_plugin]
- run at scraper/app/src directory
- python -m nose2 --with-coverage

### Linting

- pip install pylint
- run at scraper/app directory
- pylint --disable=line-too-long,too-many-locals,pointless-string-statement,unused-import ./src
