# Getting Started

## Overview

prayers-call is a reactive library for calculating (Islamic) prayer times. It is built with typescript and can be used for both node and the browser.

You can learn more about the rationale behind the project and it's features in the [Why prayers-call](./introduction.md#why-this-library) section.

::: warning
prayers-call is currently a WIP status. It is already able to make one time calculations but we are still working on the reactive calculations, the API may also change between minor releases.
:::

## Trying prayers-call online

You can try Prayer.ts online on [StackBlitz](https://stackblitz.com/edit/prayer-ts?file=src%2Fmain.ts,src%2FPrayerTimes.ts&terminal=dev). It runs Prayer.ts directly in the browser, and it is almost identical to the local setup but doesn't require installing anything on your machine.

::: tip
The version installed on StackBlitz might be out of date. if you want to try the latest version you can simply update the dependency in the `package.json`
:::

## Adding prayers-call to your project

The most straightforward way to adding the library is by running the following commands

with npm

```bash
npm i prayers-call
```

or with yarn

```bash
yarn add prayers-call
```

or with pnpm

```bash
pnpm add prayers-call
```

### CDN

You can use Prayer.ts directly from a CDN via a script tag:

```html
<script src="https://unpkg.com/prayers-call/dist/index.cjs"></script>
```

Here we are using [unpkg](https://unpkg.com), but you can also use any CDN that serves npm packages, for example [jsdelivr](https://www.jsdelivr.com/) or [cdnjs](https://cdnjs.com/). Of course, you can also download this file and serve it yourself.

### Deno

Unlike Node, Deno relies on direct URL imports instead of a package manager like NPM. prayers-call is available on [deno.land/x](https://deno.land/x). The latest version can be imported like so:

```ts
import { StaticCalculator } from 'https://deno.land/x/prayers'
```

or a specific version:

```ts
import { StaticCalculator } from 'https://deno.land/x/prayers@v1.1.0'
```

::: tip
The rest of this documentation assumes you are using npm/yarn/pnpm and importing directly from the "prayer.ts" package.
:::
