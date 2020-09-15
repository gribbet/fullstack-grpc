# ------------------------------------------------------------------------------
# Cargo Build Stage
# ------------------------------------------------------------------------------

FROM rust:latest as cargo-build

RUN rustup component add rustfmt

WORKDIR /usr/src

COPY proto proto
COPY backend/Cargo.toml backend/Cargo.lock backend/build.rs backend/

RUN cd backend && mkdir src
RUN cd backend && echo "fn main() {println!(\"if you see this, the build broke\")}" > src/main.rs
RUN cd backend && cargo build --release

COPY backend backend

RUN cd backend && cargo build --release && cargo install --path .

# ------------------------------------------------------------------------------
# Final Stage
# ------------------------------------------------------------------------------

FROM ubuntu

COPY --from=cargo-build /usr/local/cargo/bin/backend /usr/local/bin/backend

EXPOSE 50051

CMD ["backend"]