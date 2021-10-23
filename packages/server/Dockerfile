FROM node:12.22.7-buster

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 5000

CMD [ "yarn", "start" ]
