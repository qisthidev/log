---
author: Qisthi Ramadhani
pubDatetime: 2023-10-01T15:22:00Z
title: "Laravel 10: Memaksimalkan Developer Experience (DX)"
slug: laravel-10-memaksimalkan-developer-experience
description: Di versi 10, Laravel memperkenalkan beberapa fitur baru. Yang paling menarik perhatian saya ialah fitur type-hint yang bisa membuat kita memaksimalkan developer experience.
featured: true
tags:
  - laravel
  - dx
---

Pada hari Valentine kemarin, tepatnya 14 Februari 2023 komunitas PHP sedang berbahagia. Laravel, sebuah framework buatan Taylor Otwell merilis sebuah versi major, yakni versi 10. Salah satu fitur yang saya nantikan ialah **_Native Type Declarations_**.

## Table of contents

## Native Type Declarations

Saya sadur dari [Laravel News](https://laravel-news.com/laravel-10), fitur yang satu ini membuat kita mendapatkan _type-hinting_ pada kode-kode yang ada di aplikasi.

Meskipun demikian, untuk memaksimalkannya kita perlu melakukan beberapa langkah, agar ke depan kode-kode yang kita buat tetap _inline_ dengan inisiasi awal, **type hinting all day long**!

### Larastan

Pasang pada proyek dengan _command_:

```bash
composer require nunomaduro/larastan:^2.0 --dev
```

Buat berkas `phpstan.neon` atau `phpstan.neon.dist` di _root_ proyek:

```
includes:
    - ./vendor/nunomaduro/larastan/extension.neon
parameters:
    paths:
        - app/
    # Level 9 is the highest level
    level: 9
```

Untuk membuktikannya, kita bisa mencobanya dengan _command_:

```bash
./vendor/bin/phpstan analyse
```

Lebih lanjut, apabila ingin kustomisasi berkas _config_ diatas baca repositori [Larastan](https://github.com/nunomaduro/larastan).

### Laravel Pint

Laravel Pint ini bertugas sebagai _code style fixer_, agar kode-kode yang kita (anggota tim _development_) tulis sesuai dengan _standart_ yang sudah ditentukan, _following the opinionated coding style of Laravel_.

```bash
composer require laravel/pint --dev
```

Yep, cukup dengan instalasi diatas. Kita bisa mengecek _code style_ kita dengan _command_:

```bash
./vendor/bin/pint
```

Pun demikian, kalian bisa kustomisasi _style code_ sesuai dengan yang kalian kehendaki. _Further more_, baca dokumentasi [Laravel Pint](https://laravel.com/docs/10.x/pint).

### GrumPHP

Untuk menjaga agar kedua aturan diatas tetep berjalan dan diterapkan, kita perlu membuat sebuah _source code defender_!

```bash
composer require --dev phpro/grumphp
```

Kita buat _script_ di berkas `composer.json`:

```json
{
	...
	"scripts": {
		...
		"lint": [
            "./vendor/bin/pint --test"
        ]
	},
	...
}
```

Buat berkas `grumphp.yml`:

```yaml
grumphp:
  tasks:
    composer_script:
      script: lint
      triggered_by: [php]
    phpstan:
      use_grumphp_paths: false
```

Lakukan percobaan, harusnya ketika pertama coba tidak ada _error_, dengan catatan masih _fresh_ instalasi Laravel 10, belum ada kustomisasi proyek.

```bash
php ./vendor/bin/grumphp run
```

Setelah tidak ada _error_, kita perlu mendaftarkan _command_ tersebut agar setiap kali kita menulis _commit message_ mendapatkan _feedback_ terlebih dahulu apakah kode yang kita tulis telah sesuai dengan standart atau belum. Kalau belum sesuai, _commit_ tersebut akan batal dan kita perlu memperbaikinya.

```bash
php ./vendor/bin/grumphp git:init
```

Sementara cukup sekian dulu, kalau rame lanjut part 2! _Cheers_ 😎
