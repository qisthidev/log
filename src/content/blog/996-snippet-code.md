---
author: Qisthi Ramadhani
pubDatetime: 2023-11-11T15:22:00Z
title: Snippet Code
slug: snippet-code
description: Snippet Code
tags:
  - snippet
---

Personal snippet code:

## Table of contents

## Dcker

### Instalasi Laravel dengan Docker Container Temporary

```bash
docker run --rm \
    --pull=always \
    -v "$(pwd)":/opt \
    -w /opt \
    -it ramageek/php:beta-8.1-sprint-laravel \
    bash -c "laravel new laravel-webapp"
```

### Run shell in container temporary

```bash
docker run --rm --name php -it image:tag sh
```

## Service Camunda Client

```php
'camunda' => [
    'url' => env('CAMUNDA_URL', 'https://localhost:8080/engine-rest'),
    'user' => env('CAMUNDA_USER', 'demo'),
    'password' => env('CAMUNDA_PASSWORD', 'demo'),
    'tenant_id' => env('CAMUNDA_TENANT_ID', ''),
],
```
