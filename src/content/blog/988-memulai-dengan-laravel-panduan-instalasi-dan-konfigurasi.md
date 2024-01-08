---
author: Qisthi Ramadhani
pubDatetime: 2023-12-20T15:22:00Z
title: Memulai dengan Laravel - Panduan Instalasi dan Konfigurasi
slug: memulai-dengan-laravel-panduan-instalasi-dan-konfigurasi
description: Pelajari cara instalasi dan konfigurasi Laravel untuk memulai proyek Anda. Ikuti panduan langkah demi langkah untuk menjalankan aplikasi Laravel dengan sukses.
tags:
  - php
  - laravel
---

Memulai proyek Laravel membutuhkan pemahaman tentang beberapa langkah yang harus Anda ikuti untuk membuat dan menjalankan aplikasi Laravel dengan sukses. Berikut ini adalah panduan langkah demi langkah untuk menjalankan proyek Laravel.

## Table of contents

## Persyaratan Sistem

Sebelum Anda memulai, pastikan bahwa sistem Anda memenuhi persyaratan berikut:

- PHP versi ^7.3 atau ^8.0
- Extension PHP seperti BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, dan XML
- Composer

## Instalasi Composer

Composer adalah alat manajemen ketergantungan PHP yang akan kita gunakan untuk menginstal Laravel. Jika Anda belum memiliki Composer, instal dengan mengikuti instruksi pada situs web resminya: https://getcomposer.org/

## Pembuatan Proyek Laravel

Setelah Composer terinstal, jalankan perintah berikut di terminal atau command prompt untuk membuat proyek Laravel baru:

```bash
composer create-project --prefer-dist laravel/laravel nama-proyek
```

Ganti `nama-proyek` dengan nama folder yang Anda inginkan untuk proyek Laravel Anda.

## Konfigurasi Lingkungan

Setelah proyek berhasil dibuat, navigasilah ke direktori proyek tersebut menggunakan perintah `cd`:

```bash
cd nama-proyek
```

Kemudian, konfigurasikan file `.env` yang merupakan salinan dari `.env.example`:

```bash
cp .env.example .env
```

Edit file `.env` untuk mengatur detail aplikasi, termasuk konfigurasi database.

#### Key Generation

Jalankan perintah berikut untuk menghasilkan key aplikasi yang akan ditambahkan ke file `.env`:

```bash
php artisan key:generate
```

Perintah ini akan mengisi baris `APP_KEY` di file `.env` dengan string kunci acak yang aman.

## Migrasi Database

Jika Anda telah mengonfigurasi database, Anda dapat menjalankan migrasi dengan perintah berikut:

```bash
php artisan migrate
```

Perintah ini akan membuat tabel-tabel yang dibutuhkan dalam database yang telah Anda konfigurasikan.

## Menjalankan Server Pengembangan

Untuk menjalankan web server pengembangan bawaan Laravel, gunakan perintah Artisan berikut:

```bash
php artisan serve
```

Sekarang, Anda dapat mengakses aplikasi Laravel Anda di `http://127.0.0.1:8000` melalui browser web Anda.

## Kesimpulan

Anda telah mempelajari cara menginstal dan menjalankan proyek Laravel. Dengan mengikuti langkah-langkah di atas, Anda bisa memulai pembuatan aplikasi web dengan kerangka kerja Laravel dengan mudah dan cepat. Selamat mencoba dan semoga sukses dengan proyek Laravel Anda!
