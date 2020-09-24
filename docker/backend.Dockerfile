FROM node:alpine as build

RUN apk add protoc

WORKDIR /app 

COPY backend/package*.json backend/

RUN cd backend && npm install

COPY proto proto
COPY backend backend

RUN cd backend \
    && npm run generate \
    && npm run build

EXPOSE 50051
CMD node backend/index.js