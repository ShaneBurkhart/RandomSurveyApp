FROM node:5.2.0
MAINTAINER Shane Burkhart <shaneburkhart@gmail.com>

ADD . /app
WORKDIR /app

RUN npm install

EXPOSE 3000

ENV DB_HOST "mysql"

CMD ["npm", "start"]
