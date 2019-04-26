FROM rust:1.33.0-slim-stretch AS build

WORKDIR /usr/src/app
RUN apt-get update
RUN apt-get install pkg-config libssl-dev -y
RUN rustup default nightly

COPY . ./

# RUN cargo install --path .

RUN cargo build --release

RUN ldd target/release/ugw-backend

RUN LANG=en objdump -s -j .interp target/release/ugw-backend

FROM alpine@sha256:28ef97b8686a0b5399129e9b763d5b7e5ff03576aa5580d6f4182a49c5fe1913

RUN apk --no-cache add ca-certificates

WORKDIR /root/app

COPY --from=build /usr/src/app/target/release/ ./
COPY --from=build /lib/x86_64-linux-gnu/libdl.so.2 /lib/x86_64-linux-gnu/libdl.so.2
COPY --from=build /lib/x86_64-linux-gnu/librt.so.1 /lib/x86_64-linux-gnu/librt.so.1
COPY --from=build /lib/x86_64-linux-gnu/libpthread.so.0 /lib/x86_64-linux-gnu/libpthread.so.0
COPY --from=build /lib/x86_64-linux-gnu/libgcc_s.so.1 /lib/x86_64-linux-gnu/libgcc_s.so.1
COPY --from=build /lib/x86_64-linux-gnu/libc.so.6 /lib/x86_64-linux-gnu/libc.so.6
COPY --from=build /lib64/ld-linux-x86-64.so.2 /lib64/ld-linux-x86-64.so.2
COPY --from=build /lib/x86_64-linux-gnu/libm.so.6 /lib/x86_64-linux-gnu/libm.so.6


EXPOSE 8000
ARG REDIS_PATH="redis://redis:6379/"
ENV REDIS_PATH=${REDIS_PATH}
ARG SECRET=""
ENV SECRET=${SECRET}
ARG MAIL_JET_USER=""
ENV MAIL_JET_USER=${MAIL_JET_USER}
ARG MAIL_JET_KEY=""
ENV MAIL_JET_KEY=${MAIL_JET_KEY}
ARG INSTA_CID=""
ENV INSTA_CID=${INSTA_CID}
ARG INSTA_SECRET=""
ENV INSTA_SECRET=${INSTA_SECRET}


CMD ["/root/app/ugw-backend"]


