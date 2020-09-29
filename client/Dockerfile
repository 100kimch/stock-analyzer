FROM node:12 as build-stage
RUN mkdir -p /usr/client
WORKDIR /usr/client

COPY package*.json ./

RUN npm install
RUN npm install @vue/cli@4.4.6 -g

COPY ./ .

ENV PATH /usr/client/node_modules/.bin:$PATH

# RUN pwd
# RUN ls
# RUN npm run build

# CMD [ "http-server", "dist" ]
# RUN npm run build
# RUN npm run serve
