FROM node:5.2.0
MAINTAINER Shane Burkhart <shaneburkhart@gmail.com>

ADD . /app
WORKDIR /app

RUN npm install --unsafe-perm=true

EXPOSE 3000

ENV DB_HOST "mysql"

# We can't use npm start since that is set up to run the app
# with a local mysql instance and serve static assets through
# express.
CMD ["node", "server.js"]
