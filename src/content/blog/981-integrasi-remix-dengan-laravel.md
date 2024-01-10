---
author: Qisthi Ramadhani
pubDatetime: 2024-01-08T15:22:00Z
title: "Integrasi Remix dengan Laravel: Membangun Fetch API Kustom dengan TypeScript"
slug: "integrasi-remix-dengan-laravel-membangun-fetch-api-kustom-dengan-typescript"
description: "Pelajari cara mengintegrasikan Remix dengan Laravel menggunakan Fetch API kustom di TypeScript. Artikel ini membahas pembuatan fungsi laraFetch, pengelolaan token CSRF, dan pengolahan response HTTP untuk keamanan dan efisiensi komunikasi antar-framework. Ideal untuk pengembang yang mencari solusi integrasi tanpa pustaka pihak ketiga."
tags:
  - typescript
  - remix
  - laravel
  - laravel sanctum
faqs:
  - {
      question: "Apa itu `laraFetch` dan bagaimana perannya dalam integrasi Remix dan Laravel?",
      answer: "`laraFetch` adalah fungsi kustom di TypeScript yang dirancang untuk memudahkan request HTTP antara Remix dan Laravel. Fungsi ini mendukung berbagai metode HTTP dan mengelola token CSRF untuk menjamin keamanan pertukaran data.",
    }
  - {
      question: "Bagaimana cara `laraFetch` menangani token CSRF dan mengapa ini penting?",
      answer: "`laraFetch` mengambil token CSRF dari cookie atau langsung dari server jika cookie tidak tersedia. Ini penting untuk memastikan bahwa setiap request mutasi data aman dan terhindar dari serangan CSRF.",
    }
  - {
      question: "Apa tujuan dari fungsi `laraReq` dalam kode ini?",
      answer: "Fungsi `laraReq` bertujuan untuk menangani respons dari request HTTP yang dibuat oleh `laraFetch`. Fungsi ini memudahkan penanganan status HTTP seperti unauthorized (401) dan entity error (422), serta memproses data JSON.",
    }
  - {
      question: "Bagaimana fungsi `parseCookie` bekerja dalam konteks ini?",
      answer: "`parseCookie` mengurai string `set-cookie` dari respons HTTP menjadi objek cookie yang lebih mudah diolah, memudahkan akses dan penggunaan nilai-nilai cookie, termasuk token CSRF.",
    }
  - {
      question: "Apakah kode ini kompatibel dengan semua versi Node.js?",
      answer: "Kode ini seharusnya kompatibel dengan versi Node.js yang mendukung ECMAScript Modules dan fitur terbaru TypeScript. Pastikan Node.js dan TypeScript Anda terupdate untuk kompatibilitas terbaik.",
    }
---

Apakah Anda pernah menghadapi tantangan dalam mengelola request HTTP di aplikasi TypeScript Anda? Hari ini, saya ingin berbagi cara efektif untuk memanfaatkan Fetch API dalam aplikasi TypeScript, khususnya untuk mereka yang menggunakan framework Remix dan Laravel.

Dalam dunia pengembangan web modern, integrasi antar berbagai framework menjadi sangat penting. Kali ini, saya akan membahas bagaimana kita dapat mengintegrasikan framework Remix dengan Laravel menggunakan Fetch API kustom yang dibangun di TypeScript. Khususnya, kita akan melihat file `laravelFetchers.ts`, yang merupakan solusi efektif ketika tidak bisa menggunakan pustaka pihak ketiga di kode server.

## Table of contents

## Pendekatan Kustom dalam Fetch API

### Fungsi `laraFetch`

Fungsi `laraFetch` adalah inti dari integrasi kita. Fungsi ini dirancang untuk mempermudah request HTTP dari Remix ke Laravel, dengan dukungan berbagai metode seperti GET, POST, PUT, PATCH, dan DELETE.

```typescript
import { redirect } from "@remix-run/node";
import { authCookie } from "./auth";

type laraFetchOptions = {
  method?: string;
  body?: FormData | Record<string, any>;
};

export const CSRF_COOKIE = "XSRF-TOKEN",
  CSRF_HEADER = "X-XSRF-TOKEN";

export default async function laraFetch<T>(
  path: RequestInfo,
  { method = "get", body: requestBody }: laraFetchOptions,
  request?: Request
): Promise<T> {
  const { BE_URL } = process.env;
  const isMutation = ["post", "put", "patch", "delete"].includes(
    method.toLowerCase()
  );

  let token: string | null = null;
  let cookieHeader = request?.headers.get("Cookie");

  if (cookieHeader) {
    const cookies = await authCookie.parse(cookieHeader);

    token = cookies[CSRF_HEADER];
    cookieHeader = cookies.Cookie;
  }

  if (isMutation && !cookieHeader) {
    const responseCsrf = await fetch(`${BE_URL}/sanctum/csrf-cookie`, {
      method: "GET",
    });
    const cookies = String(responseCsrf.headers.get("set-cookie"));
    const laravelCookies = await parseCookie(cookies);

    token = laravelCookies.XSRFToken;
    cookieHeader = `laravel_session=${laravelCookies.laravelSession}; ${CSRF_COOKIE}=${token}`;
  }

  const headers = new Headers({
    accept: "application/json",
    Referer: "http://localhost:3000",
  });

  if (token && cookieHeader) {
    headers.set("Cookie", cookieHeader);
    headers.set(CSRF_HEADER, token);
  }

  let body = undefined;

  if (requestBody instanceof FormData) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(Object.fromEntries(requestBody));
  }

  const response = await fetch(`${BE_URL}${path}`, {
    headers,
    method: method.toUpperCase(),
    body,
  });

  if ([500, 502, 503, 504, 505].includes(response.status)) {
    throw new Error(`Laravel server error! Status: ${response.statusText}`);
  }

  return response as T;
}
```

Di sini, kita memastikan bahwa setiap request HTTP dilengkapi dengan token CSRF yang diperlukan, menjamin keamanan dalam pertukaran data antara kedua framework.

### Pengelolaan Token CSRF

Aspek penting dari fungsi ini adalah pengelolaan token CSRF. Fungsi ini secara cerdas mengambil token dari cookie atau mengambilnya langsung dari server jika perlu. Ini memastikan bahwa setiap mutasi data yang dilakukan melalui request ini aman dan terlindungi.

### Fungsi `laraReq`

Fungsi ini bertugas mengelola response dari request yang dibuat. Dengan `laraReq`, kita dapat dengan mudah menangani berbagai status HTTP, termasuk kasus-kasus seperti unauthorized (401) atau entity error (422).

```typescript
export async function laraReq<T, K = Response>(
  fetchable: Promise<T>,
  onSuccess?: (param?: Response) => K,
  onUnauthorized?: (param?: Response) => K
): Promise<{ data: T | null; errors: Record<string, string[]> | null }> {
  const response = await fetchable;

  if (!(response instanceof Response)) {
    throw new Error("Something went wrong");
  }

  if (response.status === 419) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await authCookie.serialize("", { maxAge: 0 }),
      },
    });
  }

  if (response.status === 401) {
    await onUnauthorized?.(response);
  }

  let data: T | null = null;
  let errors: Record<string, string[]> | null = null;

  if ([422, 200].includes(response.status)) {
    const json = await response.json();

    if (response.status === 422) {
      errors = json.errors;
    } else {
      data = json;
    }
  }

  await onSuccess?.(response);

  return { data, errors };
}
```

Melalui fungsi ini, kita dapat memproses data JSON dari response dan mengelola error yang mungkin terjadi dengan cara yang lebih terstruktur.

### Fungsi `parseCookie`

Mengurai cookie dari response HTTP adalah tugas fungsi `parseCookie`. Fungsi ini memecah string `set-cookie` menjadi objek yang lebih mudah diolah, memungkinkan kita untuk mengakses nilai-nilai seperti token CSRF dengan lebih mudah.

```typescript
export async function parseCookie(setCookie: string): Promise<{
  XSRFToken: string;
  laravelSession: string;
}> {
  let XSRFToken = "",
    laravelSession = "",
    cookies = setCookie.split(",");

  for (let index = 0; index < cookies.length; index++) {
    let cookie = cookies[index];

    if (cookie.includes(CSRF_COOKIE)) {
      XSRFToken = await getCookie(CSRF_COOKIE, cookie);
    }

    if (cookie.includes("laravel_session")) {
      laravelSession = await getCookie("laravel_session", cookie.split(";")[0]);
    }
  }

  return {
    XSRFToken,
    laravelSession,
  };
}

async function getCookie(name: string, cookieString: string): Promise<string> {
  if (name === "laravel_session") {
    return decodeURIComponent(cookieString.split("=")[1]);
  }

  let match = cookieString.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));

  return match ? decodeURIComponent(match[3]) : "";
}
```

### Kesimpulan dan Implementasi

Dengan menggunakan kode ini, integrasi antara Remix dan Laravel menjadi lebih aman dan efisien. Kita tidak hanya mendapatkan kontrol penuh atas cara request dan response ditangani, tetapi juga memastikan bahwa aspek-aspek penting seperti keamanan CSRF terkelola dengan baik.

Untuk mengimplementasikan kode ini, cukup salin dan sesuaikan fungsi-fungsi tersebut sesuai dengan kebutuhan spesifik aplikasi Anda. Pendekatan kustom ini menawarkan fleksibilitas tinggi dan memungkinkan integrasi yang lancar antara Remix dan Laravel, bahkan tanpa menggunakan pustaka pihak ketiga di kode server.

Saya harap penjelasan ini memberikan wawasan baru dalam membangun Fetch API kustom untuk integrasi framework di dunia pengembangan web. Jika ada pertanyaan atau diskusi lebih lanjut, jangan ragu untuk meninggalkan komentar di bawah. Selamat mengkode!

## FAQs (Pertanyaan yang Sering Diajukan)
