# Getting Started

## Overview

Prayers.ts is a reactive library for calculating (Islamic) prayer times. It is built with typescript and can be used for both node and the browser.

You can learn more about the rationale behind the project and it's features in the [Why Prayers.ts](./introduction.md#why-this-library) section.

::: warning
Prayers.ts is currently a WIP status. It is already able to make one time calculations but we are still working on the reactive calculations, the API may also change between minor releases.
:::

## Trying Prayers.ts online

TODO: add a stackblitz link here

## Adding Prayers.ts to your project

The most straightforward way to adding the library is by running the following commands

with npm

```bash
npm i prayers.ts
```

or with yarn

```bash
yarn add prayers.ts
```

or with pnpm

```bash
pnpm add prayers.ts
```

### CDN

You can use Prayer.ts directly from a CDN via a script tag:

```html
<script src="https://unpkg.com/prayers.ts/dist/index.cjs"></script>
```

Here we are using [unpkg](https://unpkg.com), but you can also use any CDN that serves npm packages, for example [jsdelivr](https://www.jsdelivr.com/) or [cdnjs](https://cdnjs.com/). Of course, you can also download this file and serve it yourself.

### Deno

Unlike Node, Deno relies on direct URL imports instead of a package manager like NPM. Prayers.ts is available on [deno.land/x](https://deno.land/x). The latest version can be imported like so:

TODO: add deno instructions

::: tip
The rest of this documentation assumes you are using npm/yarn/pnpm and importing directly from the "prayer.ts" package.
:::
