import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

// if version doesn't work we need to use this plugin https://github.com/semantic-release/git
export default defineConfig({
  title: 'Prayers.ts',
  description: 'A reactive prayer times calculation library for node and the browser built with Typescript',
  ignoreDeadLinks: true, // FIXME: remove this when the docs are mature
  lastUpdated: true,
  themeConfig: {
    nav: nav(),
    outline: [1, 4],
    sidebar: {
      '/': sidebarGuide(),
    },

    editLink: {
      pattern: 'https://github.com/gimyboya/prayers.ts/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/gimyboya/prayers.ts' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2022-${new Date().getFullYear()} Gimyboya`,
    },
  },
})

function nav() {
  return [
    { text: 'Guide', link: '/guide/introduction', activeMatch: '/guide/' },
    {
      text: 'Config',
      link: '/config',
      activeMatch: '/config/',
    },
    {
      text: 'API',
      link: '/api',
      activeMatch: '/api/',
    },
    {
      text: version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/gimyboya/prayers.ts/blob/master/CHANGELOG.md',
        },
        {
          text: 'Contributing',
          link: 'https://github.com/gimyboya/prayers.ts/blob/master/.github/CONTRIBUTING.md',
        },
      ],
    },
  ]
}

function sidebarGuide() {
  return [
    {
      text: 'Introduction',
      collapsible: true,
      items: [
        { text: 'Introduction', link: '/guide/introduction' },
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Core Concepts', link: '/guide/concepts' },
      ],
    },
    {
      text: 'Prayers Time Calculation',
      collapsible: true,
      items: [
        { text: 'One Time Calculator', link: '/guide/one-time-calculator' },
        { text: 'Reactive Calculator', link: '/guide/reactive-calculator' },
      ],
    },
    {
      text: 'Formatting Time',
      collapsible: true,
      items: [
        { text: 'Formatters', link: '/guide/formatters' },
        { text: 'Hijri Dates', link: '/guide/hijri' },
        { text: 'Internalization', link: '/guide/i18n' },
      ],
    },
    {
      text: 'Calculating Qibla',
      collapsible: true,
      items: [
        {
          text: 'Calculating The Qibla',
          link: '/guide/calculating-the-qibla',
        },
      ],
    },
    {
      text: 'Testing',
      collapsible: true,
      items: [
        {
          text: 'Testing',
          link: '/guide/testing',
        },
      ],
    },
  ]
}
