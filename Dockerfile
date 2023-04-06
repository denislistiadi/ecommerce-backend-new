FROM node:16-alpine
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm start
EXPOSE 3000
