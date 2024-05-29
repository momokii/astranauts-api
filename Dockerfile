FROM node:21-alpine

ENV NODE_ENV=production
ENV PORT=889
ENV JWT_SECRET=astranauts123uye
ENV MONGODB_URI=mongodb+srv://kelanachandra7:N668DqU5IBP9sJow@cluster0.x1bqbss.mongodb.net/astranauts-dev

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --production --silent && mv node_modules ../

COPY . .

EXPOSE 3000

RUN chown -R node /usr/src/app

USER node

CMD ["npm", "start"]
