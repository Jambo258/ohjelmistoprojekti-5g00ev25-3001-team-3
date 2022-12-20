FROM node:alpine

COPY . /opt/api

WORKDIR /opt/api

RUN yarn

RUN yarn build

EXPOSE 5000

CMD ["yarn", "start"]