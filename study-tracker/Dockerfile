FROM node:23-alpine

WORKDIR /app

COPY package.json ./
COPY server.ts ./
COPY public/ ./public/

ENV PORT=8080
EXPOSE 8080

CMD ["node", "--experimental-strip-types", "server.ts"]
