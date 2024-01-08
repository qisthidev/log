---
author: Qisthi Ramadhani
pubDatetime: 2023-10-01T15:22:00Z
title: Membuat Docker Image PHP dengan Extension OCI8
slug: membuat-docker-image-dengan-extension-oci8
description: Kita perlu menyelaraskan local environment agar development menjadi lebih cepat, untuk itulah saya membuat Docker Image PHP dengan extension oci8.
tags:
  - docker
---

Kita perlu menyelaraskan local environment agar development menjadi lebih cepat, untuk itulah saya membuat Docker Image PHP dengan extension oci8.

## Table of contents

## TL;DR

Hasil dari Docker Image ini telah dipublikasikan pada [Docker Hub](https://hub.docker.com/layers/ramageek/php/8.1-fpm-nginx-oci8/images/sha256-2a67a451ea4238856560578686a0947059110b736f0cad56cef4e76c95d8e4ac?context=explore), kalian bisa _pull_ dengan perintah:

```bash
docker pull ramageek/php:8.1-fpm-nginx-oci8-dev
```

### Build Development from Scratch

Untuk _base image_, saya disini menggunakan [PHP Docker Image](https://serversideup.net/open-source/docker-php) buatan **ServerSideUP**. Langkah-langkah yang perlu dilaksanakan ialah:

1. Install prerequisites
1. Setup Oracle Instant Client
1. Install OCI8 extension
1. Cleanup

Lebih lengkapnya, coba perhatikan _Dockerfile_ yang sudah saya tulis dibawah ini:

```dockerfile
# Set our base image
FROM serversideup/php:8.1-fpm-nginx

LABEL maintainer="Qisthi Ramadhani"

COPY .bash_aliases /root/.bash_aliases

# Install prerequisites
RUN apt-get update \
    && apt-get install -y php8.1-dev php-pear build-essential libaio-dev libaio1 git nano wget zip unzip \
    && pecl channel-update pecl.php.net

# Setup Oracle Instant Client
RUN mkdir /opt/oracle \
    && cd /opt/oracle \
    && wget https://download.oracle.com/otn_software/linux/instantclient/219000/instantclient-basic-linux.x64-21.9.0.0.0dbru.zip \
    && wget https://download.oracle.com/otn_software/linux/instantclient/219000/instantclient-sdk-linux.x64-21.9.0.0.0dbru.zip \
    && wget https://download.oracle.com/otn_software/linux/instantclient/219000/instantclient-sqlplus-linux.x64-21.9.0.0.0dbru.zip \
    && unzip instantclient-basic-linux.x64-21.9.0.0.0dbru.zip \
    && unzip instantclient-sdk-linux.x64-21.9.0.0.0dbru.zip \
    && unzip instantclient-sqlplus-linux.x64-21.9.0.0.0dbru.zip \
    && sh -c "echo /opt/oracle/instantclient_21.9 > /etc/ld.so.conf.d/oracle-instantclient.conf" \
    && ldconfig \
    && export PATH=/opt/oracle/instantclient_21.9:$PATH \
    && export LD_LIBRARY_PATH="/opt/oracle/instantclient_21.9"

# Install OCI8 extension
RUN cd /opt/oracle \
    && wget https://pecl.php.net/get/oci8-3.2.1.tgz \
    && tar xzf oci8-3.2.1.tgz \
    && cd oci8-3.2.1 \
    && phpize8.1 \
    && ./configure --with-oci8=instantclient,/opt/oracle/instantclient_21_9 --with-php-config=/usr/bin/php-config8.1 \
    && make \
    && touch /etc/php/8.1/cli/conf.d/10-oci8.ini \
    && sh -c "echo 'extension=oci8.so' > /etc/php/8.1/cli/conf.d/10-oci8.ini" \
    && touch /etc/php/8.1/fpm/conf.d/10-oci8.ini \
    && sh -c "echo 'extension=oci8.so' > /etc/php/8.1/fpm/conf.d/10-oci8.ini"

# Cleanup
RUN apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/* /opt/oracle/*.zip /opt/oracle/*.tgz /opt/oracle/package.xml

ENV LD_LIBRARY_PATH="/opt/oracle/instantclient_21_9"
```
