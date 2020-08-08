FROM node:10.21.0-jessie
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["./wait-for-it.sh" , "shipment-service:5600" , "--strict" , "--timeout=390" , "--" , "node", "server.js"]