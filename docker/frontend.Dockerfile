FROM node:alpine as build

RUN apk add protoc

WORKDIR /app 

COPY frontend/package*.json frontend/

RUN cd frontend && npm install

COPY proto proto
COPY frontend frontend

ARG ENDPOINT
ENV ENDPOINT=$ENDPOINT

RUN cd frontend \
    && npm run generate \
    && npm run build

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD nginx -g "daemon off;" 