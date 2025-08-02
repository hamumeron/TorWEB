FROM node:18

RUN apt update && apt install -y tor
WORKDIR /app
COPY . .
RUN npm install

CMD service tor start && node server.js
