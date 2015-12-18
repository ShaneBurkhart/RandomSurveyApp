FROM node:5.2.0
MAINTAINER Shane Burkhart <shaneburkhart@gmail.com>

ADD . /app
WORKDIR /app

RUN npm install
RUN npm run bower -- --allow-root install

EXPOSE 3000

CMD ["npm", "start"]
