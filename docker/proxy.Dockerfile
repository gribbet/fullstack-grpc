from golang:alpine as build

RUN apk --no-cache add git
RUN go get -u github.com/improbable-eng/grpc-web/go/grpcwebproxy

FROM alpine

COPY --from=build /go/bin/grpcwebproxy .
ARG BACKEND
ENV BACKEND=$BACKEND
EXPOSE 8080
CMD /grpcwebproxy --backend_addr=$BACKEND --allow_all_origins --use_websockets --run_tls_server=false