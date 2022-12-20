# client build
FROM node:alpine as build-stage

ARG REACT_APP_LOCAL_BACKEND_URL

WORKDIR /opt/client

COPY package*.json /opt/client/

RUN yarn

COPY ./ /opt/client/

RUN yarn cross-env REACT_APP_LOCAL_BACKEND_URL=$REACT_APP_LOCAL_BACKEND_URL yarn build

# production stage
FROM nginx:stable-alpine as production-stage

RUN /bin/ln -fs /usr/share/zoneinfo/Europe/Helsinki /etc/localtime

COPY  --from=build-stage /opt/client/build /usr/share/nginx/html

COPY ./conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]