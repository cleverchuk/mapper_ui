FROM node:latest

# Create app directory
RUN mkdir /app
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm audit fix

COPY public/ ./public
COPY src/ ./src

RUN npm run-script build

EXPOSE 3000
CMD [ "npm", "start" ]
