# Introduction

## What is it?

Prayers.ts is a reactive library for calculating (Islamic) prayer times. It is built with typescript and can be used for both node and the browser.

Based on [Adhan-js](https://github.com/batoulapps/adhan-js) at it's core. Prayers.ts aims to provide accurate and versatile calculations methods as well as a number of configurations useful for making needed adjustments for the final results.

Prayers.ts also focuses on ease of use. we wanted to make the Api straightforward to use and understand while still providing the user all the powerful features they need.

## Why this library?

When working with other solutions out there we couldn't find a solution that offers reactivity as a first citizen feature. because prayer times are time related and are events that happen across time it is very befitting to use reactivity as the paradigm to solve the issue of recalculating the prayer times each time.

It is also worth noting that if we calculate other sunnah times like the last third of the night (which Prayers.ts supports). deciding when to recalculates becomes less trivial.

Prayers.ts also aims to be accurate where reactions are triggered only when they are needed.

## Features

- Tree shakable
- Past, current and future time calculations
- Event based (reactive) Adhan, Iqama and Sunnah time calculations
- Accurate Prayer times calculation
- Multiple calculation methods
- Granular controls over calculations
- Sunnah prayers time related calculations
- Qibla calculation
- I18n and Date formatting supported
