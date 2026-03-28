FROM node:22-alpine

LABEL name="Node Backend"

WORKDIR /backend

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
