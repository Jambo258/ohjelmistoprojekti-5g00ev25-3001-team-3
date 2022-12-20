FROM python:3.8-alpine

RUN mkdir /app
ADD ./app/ /app
WORKDIR /app
RUN pip install -r requirements.txt

CMD ["python", "src/main.py"]