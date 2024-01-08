---
author: Qisthi Ramadhani
pubDatetime: 2023-10-01T15:22:00Z
title: "Laravel 10: Code Quality dengan GitHub Action"
slug: laravel-10-github-actions
description: GitHub Action membantu kita menjaga agar kualitas source code di repo selalu inline dengan standart sudah ditentukan.
tags:
  - laravel 10
  - code quality
---

Setelah kita menerapkan penjaga gerbang di sisi _developer_ (tiap-tiap anggota tim), baiknya kita juga membuat sebuah GitHub Action yang bisa menjadi penjaga layer 2 di repo kita. Biasanya, menurut saya baiknya penjagaan dilakukan berdasarkan dua tipe _task_. Penjagaan ketika **pull request** dan ketika **push** di _branch_ utama kita.

> Baca post sebelumnya, [memaksimalkan developer experience (DX) di Laravel 10](/posts/laravel-10-memaksimalkan-developer-experience)

## Table of contents

## GitHub Action: Pull Request

Mari kita beri nama task ini sebagai **_Laravel PR_**, _task_ ini akan dikerjakan ketika ada sebuah _pull request_ ke _branch_ utama. Disini kita perlu penjagaan secara menyeluruh, mulai dari _code style_, _code analysis_ serta perlu menjalankan _test_ yang sudah dibuat agar _deployment_ yang kita lakukan ke depan tetap terjaga stabilitasnya.

```yml
name: Laravel PR

on:
  pull_request:
    branches: ["main"]

jobs:
  laravel-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: shivammathur/setup-php@15c43e89cdef867065b0213be354c2841860869e
        with:
          php-version: "8.2"
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install && npm run build
      - name: Copy .env
        run: php -r "file_exists('.env') || copy('.env.example', '.env');"
      - name: Install Dependencies
        run: composer install -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist
      - name: Generate key
        run: php artisan key:generate
      - name: Directory Permissions
        run: chmod -R 777 storage bootstrap/cache
      - name: Create Database
        run: |
          mkdir -p database
          touch database/database.sqlite
      - name: Execute PHP code style via Laravel Pint
        run: composer pint-test
      - name: Execute PHP code analysis via Larastan
        run: composer analyse
      - name: Execute tests (Unit and Feature tests) via PHPUnit
        env:
          DB_CONNECTION: sqlite
          DB_DATABASE: database/database.sqlite
        run: composer test
```

### Code Style via Laravel Pint

Pada berkas _yaml_ diatas, aksi ini dilakukan dengan perintah `composer pint-test`. Lebih _detail_-nya, bisa kita lihat pada berkas `composer.json` bagian `scripts`.

### Code Analysis via PHPStan

Dilakukan dengan perintah `composer analyse`. Seperti halnya pada [Code Style](#code-style-via-laravel-pint), rinciannya terdapat pada berkas `composer.json` bagian `scripts`.

### Execute Tests via PHPUnit

Kita sebenarnya bisa langsung menulis perintah `php artisan test`, sebuah _command_ bawaan dari Laravel yang bisa menjalankan _testing scripts_ melalui **PHPUnit**. Namun, agar sejalan disini saya buat alias seperti pada [Code Style](#code-style-via-laravel-pint) dan [Code Analysis](#code-analysis-via-phpstan) dengan perintah dari `composer`.

## GitHub Action: Push

Tidak beda jauh dengan aksi [Pull Request](#github-action-pull-request), namun untuk mempercepat **CI/CD** menurut saya kita cukup menjalankan perintah [Execute Tests via PHPUnit](#execute-tests-via-phpunit) dan mengubah _trigger_ ketika hanya ada _push_ di _branch_ utama kita.

```yml
---
name: Laravel Push

on:
  push:
    branches: ["main"]

jobs:
  laravel-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: shivammathur/setup-php@15c43e89cdef867065b0213be354c2841860869e
        with:
          php-version: "8.2"
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install && npm run build
      - name: Copy .env
        run: php -r "file_exists('.env') || copy('.env.example', '.env');"
      - name: Install Dependencies
        run: composer install -q --no-ansi --no-interaction --no-scripts --no-progress --prefer-dist
      - name: Generate key
        run: php artisan key:generate
      - name: Directory Permissions
        run: chmod -R 777 storage bootstrap/cache
      - name: Create Database
        run: |
          mkdir -p database
          touch database/database.sqlite
      - name: Execute tests (Unit and Feature tests) via PHPUnit
        env:
          DB_CONNECTION: sqlite
          DB_DATABASE: database/database.sqlite
        run: composer testp
```

Agar lebih optimal lagi, Laravel secara _out-of-the-box_ menyediakan sebuah opsi `parallel`. Kita akan menjalankan _testing script_ secara hampir bersamaan, dengan demikian waktu tunggu pada _task_ ini akan lebih sedikit. Dikarenakan sebelumnya kita telah menerapkan penjagaan kualitas kode dua layer. Disini, kita cukup mengganti `composer test` dengan `composer testp`.

## Rincian Perintah Composer

```json
{
    ...
    "scripts": {
        ...
        "test": [
            "XDEBUG_MODE=coverage php artisan test --coverage --profile"
        ],
        "testp": [
            "php artisan test --parallel"
        ],
        "analyse": [
            "./vendor/bin/phpstan analyse --xdebug"
        ],
        "pint-test": [
            "./vendor/bin/pint --test"
        ]
    },
    ...
}
```

_Cheers_! Semoga bermanfaat 😎
