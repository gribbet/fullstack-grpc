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

ARG POSTGRES
ENV POSTGRES=$POSTGRES
EXPOSE 50051
CMD cd backend && node ./build/index.js