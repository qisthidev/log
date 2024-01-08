---
author: Qisthi Ramadhani
pubDatetime: 2023-12-17T15:22:00Z
title: Panduan Lengkap Testing Laravel dengan Pest PHP - Tingkatkan Kualitas Kode Anda
slug: laravel-10-testing-dengan-pest
description: Temukan langkah demi langkah untuk melakukan testing aplikasi Laravel menggunakan Pest PHP. Artikel ini membimbing Anda untuk membuat kode yang lebih bersih dan berkualitas.
tags:
  - laravel 10
  - laravel
  - pest
---

_Testing_ adalah salah satu aspek penting dalam pengembangan perangkat lunak yang membantu kita memastikan bahwa kode yang kita tulis bekerja sesuai dengan harapan. Di ekosistem Laravel, **Pest PHP** telah menjadi pilihan populer karena pendekatannya yang elegan dan ekspresif. Dalam panduan ini, kita akan membahas cara menggunakan Pest PHP untuk menulis _test_ di Laravel.

Baca juga artikel sebelumnya tentang [membuat REST API dengan Laravel](/posts/rest-api-laravel).

## Table of contents

## 1. Testing Pembuatan Produk

Langkah pertama yang akan kita lakukan adalah test pembuatan produk. Pastikan Anda sudah mempunyai endpoint `/api/products` untuk menerima request POST.

- Kirim permintaan POST dengan data yang tidak lengkap dan periksa response statusnya yaitu `422` yang menandakan _validation error_.
- Kirim permintaan POST dengan data yang lengkap dan pastikan produk berhasil dibuat dengan status `201` serta cek jumlah produk dalam database.

### Code Snippet: Testing Pembuatan Produk

```php
use function Pest\Laravel\postJson;

it('can create a product', function () {
    $postEndpoint = '/api/products';
    $name = 'Naik Air Max';
    $postRequest = postJson($postEndpoint, ['name' => $name]);

    expect($postRequest->getStatusCode())
        ->toBe(422)
        ->and($postRequest->json())
        ->toHaveKeys(['message', 'errors'])
        ->and($postRequest->json('message'))
        ->toContain('required')
        ->and($postRequest->json('errors'))
        ->toBeArray();

    $attributes = [
        'name' => $name,
        'model' => 'Sepatu Pria',
        'photo' => 'stub-shoe.jpg',
        'price' => 340_000,
    ];

    $postRequest = postJson($postEndpoint, $attributes);

    expect($postRequest->getStatusCode())
        ->toBe(201)
        ->and($postRequest->json())
        ->toHaveKeys(['id', 'name', 'photo', 'model', 'price', 'created_at', 'updated_at', 'deleted_at'])
        ->and($postRequest->json())
        ->toMatchArray($attributes)
        ->and(Product::all()->count())
        ->toBe(1);
});
```

## 2. Testing Paginasi Produk

Setelah menambahkan data menggunakan _seeder_, kita akan mengecek paginasi dengan request GET ke endpoint `/api/products`.

- Pastikan response status adalah `200` dan respon memiliki struktur `data`, `links`, dan `meta`.
- Periksa jumlah produk dalam respons dan informasi paginasi yang relevan seperti halaman saat ini, jumlah total halaman, dll.

### Code Snippet: Testing Paginasi Produk

```php
use function Pest\Laravel\artisan;
use function Pest\Laravel\getJson;

it('can get products with pagination', function () {
    artisan('db:seed');

    $getRequest = getJson('api/products');

    expect($getRequest->getStatusCode())
        ->toBe(200)
        ->and($getRequest->json())
        ->toHaveKeys(['data', 'links', 'meta'])
        ->and($getRequest->json('data'))
        ->toHaveCount(6)
        ->and($getRequest->json('meta'))
        ->current_page->toBe(1)
        ->from->toBe(1)
        ->last_page->toBe(1)
        ->next_page_url->toBe(null)
        ->per_page->toBe(15)
        ->prev_page_url->toBe(null)
        ->to->toBe(6)
        ->total->toBe(6);
});
```

## 3. Testing Detail Produk

Perhatikan mekanisme menampilkan _detail_ produk dengan menggunakan _endpoint_ yang mengandung ID produk yang valid.

- Coba request GET dengan ID produk yang salah dan konfirmasikan mendapatkan status `404`.
- Gunakan ID yang benar dan pastikan response `200` dengan data produk yang cocok dengan produk yang direquest.

### Code Snippet: Testing Detail Produk

```php
use function Pest\Laravel\artisan;
use function Pest\Laravel\getJson;

it('can show product', function () {
    artisan('db:seed');

    $product = \App\Models\Product::query()->first();

    $getRequest = getJson('api/products/wrong_id'.$product->id);

    expect($getRequest->getStatusCode())->toBe(404);

    $getRequest = getJson('api/products/'.$product->id);
    $attributes = $product->only('id', 'name', 'photo', 'model', 'price');

    expect($getRequest->getStatusCode())
        ->toBe(200)
        ->and($getRequest->json())
        ->toMatchArray($attributes);
});
```

## 4. Updating Produk

Untuk _test_ update produk, ambil salah satu produk untuk di-_update_.

- Gunakan endpoint PUT dengan ID yang salah untuk memastikan mendapatkan respons `404`.
- Lakukan _update_ dengan data yang tidak lengkap dan periksa adanya _response_ status `422` yang menunjukkan validasi _error_.
- _Update_ produk dengan data lengkap dan periksa status `204` yang menandakan _update_ berhasil tanpa _response body_.

### Code Snippet: Updating Produk

```php
use function Pest\Laravel\artisan;
use function Pest\Laravel\putJson;

it('can update a product', function () {
    artisan('db:seed');

    $product = \App\Models\Product::query()->first();

    $putRequest = putJson('/api/products/wrong_id'.$product->id);

    expect($putRequest->getStatusCode())->toBe(404);

    $putRequest = putJson('/api/products/'.$product->id);

    expect($putRequest->getStatusCode())
        ->toBe(422)
        ->and($putRequest->json())
        ->toHaveKeys(['message', 'errors'])
        ->and($putRequest->json('message'))
        ->toContain('required')
        ->and($putRequest->json('errors'))
        ->toBeArray();

    $putRequest = putJson('/api/products/'.$product->id, [
        'name' => 'Updated',
        'model' => 'Updated',
        'price' => 100_00,
    ]);

    expect($putRequest->getStatusCode())->toBe(204);
});
```

## 5. Menghapus Produk

Sama seperti _updating_ produk, skenario _testing_ akan menjadi seperti berikut:

- Coba hapus dengan ID yang salah untuk mendapat _response_ `404`.
- Gunakan ID yang benar untuk menghapus produk dan pastikan mendapat respons `204`.

### Code Snippet: Menghapus Produk

```php
use function Pest\Laravel\artisan;
use function Pest\Laravel\deleteJson;

it('can delete a product', function () {
    artisan('db:seed');

    $category = \App\Models\Product::query()->first();

    $putRequest = deleteJson('/api/products/wrong_id'.$category->id);

    expect($putRequest->getStatusCode())->toBe(404);

    $putRequest = deleteJson('/api/products/'.$category->id);

    expect($putRequest->getStatusCode())->toBe(204);
});
```

## Kesimpulan

_Testing_ dengan Pest PHP membantu kita untuk menulis tes yang lebih ekspresif dan mudah dibaca. Semoga dengan panduan ini Anda dapat memulai melakukan _testing_ pada aplikasi Laravel Anda dengan lebih efektif. Ingatlah bahwa _testing_ yang baik akan meningkatkan kualitas dan kehandalan dari kode yang kita buat.

### Catatan Akhir

Untuk informasi lebih lanjut tentang penggunaan **Pest PHP** atau ingin memulai mengintegrasikannya ke dalam proyek Laravel Anda, kunjungi dokumen resminya di [pestphp.com](https://pestphp.com/). Selamat meningkatkan kualitas kode Anda dengan testing yang baik!
