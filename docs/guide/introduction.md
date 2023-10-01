# Introduction

## What is it?

prayers-call is a reactive library for calculating (Islamic) prayer times. It is built with typescript and can be used for both node and the browser.

Based on [Adhan-js](https://github.com/batoulapps/adhan-js) at it's core. prayers-call aims to provide accurate and versatile calculations methods as well as a number of configurations useful for making needed adjustments for the final results.

prayers-call also focuses on ease of use. we wanted to make the Api straightforward to use and understand while still providing the user all the powerful features they need.

## Why this library?

When working with other solutions out there we couldn't find a solution that offers reactivity as a first citizen feature. because prayer times are time related and are events that happen across time it is very befitting to use reactivity as the paradigm to solve the issue of recalculating the prayer times each time.

This library provides reactivity for Qiyam times as well.

prayers-call also aims to be accurate where reactions are triggered only when they are needed.

## Features

- Tree shakable
- Past, current and future time calculations
- Qiyam prayers time related calculations
- Event based (reactive) Adhan, Iqama and Qiyam time calculations
- Accurate Prayer times calculation
- Multiple pre-defined calculation methods
- Granular controls over calculations
- Qibla calculation
- I18n and Date formatting supported
