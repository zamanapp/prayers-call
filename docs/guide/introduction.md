# Introduction

## What Is It?

`prayers-call` is a TypeScript library designed for calculating Islamic prayer times. It can be used in both Node.js and browser environments. Built on top of [adhan-js](https://github.com/batoulapps/adhan-js), the library aims for accuracy, versatility, and ease of use.

## Why This Library?

When working with other solutions we couldn't find anything that offers reactivity as a first class feature. we had to always wrap these solutions around some reactivity logic to get the results we need.

Considering that prayer times represent events that happen across time it is very befitting to use reactivity as the paradigm to solve the issue of notifying and recalculating the prayer times each time.

This library takes in consideration Qiyam times as well. Plus, it's optimized to trigger updates only when necessary.

## Features

- **Tree-Shakable:** Efficient bundling through tree-shaking.
- **Time Calculations:** Supports past, present, and future dates.
- **Qiyam Times:** Offers calculations for Qiyam times.
- **Event-Based:** Reactive calculations for Adhan, Iqama, and Qiyam times.
- **Accuracy:** Multiple pre-defined methods for precise calculations.
- **Configurability:** Granular control over various calculation parameters.
- **Qibla Direction:** Includes Qibla calculation.
- **Localization:** Provides helpers for internationalization and date formatting.
