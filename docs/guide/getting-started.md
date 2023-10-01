# Getting Started

## Overview

`prayers-call` is a TypeScript library designed for calculating Islamic prayer times. It's engineered to be reactive and is compatible with both Node.js and browser environments.

For insights into the motivation and features of this project, visit the [Why prayers-call](./introduction.md#why-this-library) section.

## Trying `prayers-call` online

Experience `prayers-call` without any installation via our [StackBlitz Playground](https://stackblitz.com/edit/prayer-ts?file=src%2FPrayerTimes.ts&terminal=dev). This browser-based environment closely mimics a local setup, allowing you to test the library's features effortlessly.

::: tip
The version of `prayers-call` on StackBlitz may not be up-to-date. To try the latest features, update the dependency in the `package.json` file within the StackBlitz environment.
:::

## Adding `prayers-call` to Your Project

You have multiple options for integrating prayers-call into your project:

### Package Managers

Install using npm, yarn, pnpm, or bun:

#### npm

```bash
npm i prayers-call
```

#### yarn

```bash
yarn add prayers-call
```

#### pnpm

```bash
pnpm add prayers-call
```

#### bun

```bash
bun add prayers-call
```

### CDN

Include prayers-call via a CDN by adding the following script tag to your HTML:

```html
<script src="https://unpkg.com/prayers-call/dist/index.cjs"></script>
```

We are using [unpkg](https://unpkg.com) in this example, but other CDNs like [jsdelivr](https://www.jsdelivr.com/) or [cdnjs](https://cdnjs.com/) works as well. Alternatively, you can download and serve the file yourself.

### Deno

For Deno users, prayers-call is available on [deno.land/x](https://deno.land/x). Import the latest version or a specific version as follows:

#### Latest Version:

```ts
import { StaticCalculator } from 'https://deno.land/x/prayers'
```

#### Specific Version:

```ts
import { StaticCalculator } from 'https://deno.land/x/prayers@v1.1.0'
```

::: tip
The rest of this documentation assumes you are using npm/yarn/pnpm/bun and importing directly from the `prayers-call` package.
:::

## Basic Usage

Here's a quick example to get you started with the StaticCalculator for one-time prayer time calculations:

```ts
import { Methods, StaticCalculator } from 'prayers-call'

const calculator = new StaticCalculator({
  date: new Date(), // today
  latitude: 21.42251,
  longitude: 39.826168,
  method: Methods.UMMU_AL_QURA,
})

const prayerTimes = calculator.getPrayerTimes()
console.log(prayerTimes)
```
