FROM rust:latest as build

RUN rustup component add rustfmt

WORKDIR /app

COPY proto proto
COPY backend/Cargo.toml backend/Cargo.lock backend/build.rs backend/

RUN cd backend \
    && mkdir src \
    && echo "fn main() {}" > src/main.rs \
    && cargo install --path .

COPY backend backend

RUN cd backend \
    && cargo build --release \
    && cargo install --path .

FROM ubuntu

COPY --from=build /usr/local/cargo/bin/backend /usr/local/bin/backend

EXPOSE 50051

ENTRYPOINT backend