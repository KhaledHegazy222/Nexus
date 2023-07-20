FROM node:16

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn

COPY ./ ./ 

# temporarely instead of yarn starts
CMD [ "yarn", "run", "dev" ] 