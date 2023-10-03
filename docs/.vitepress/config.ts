import { defineConfig } from 'vitepress'
import { version } from '../../package.json'

// if version doesn't work we need to use this plugin https://github.com/semantic-release/git
export default defineConfig({
  title: 'prayers-call',
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
      pattern: 'https://github.com/whiterocktech/prayers-call/edit/master/docs/:path',
      text: 'Edit this page on GitHub',
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/whiterocktech/prayers-call' }],

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2022-${new Date().getFullYear()} Whiterock tech`,
    },
  },
})

function nav() {
  return [
    {
      text: 'Docs',
      activeMatch: `^/(guide|recipes)/`,
      items: [
        { text: 'Guide', link: '/guide/introduction' },
        { text: 'Recipes', link: '/recipes/formatters' },
        // {
        //   text: 'Migration from V1',
        //   link: 'https://v3-migration.vuejs.org/'
        // }
      ],
    },
    {
      text: 'Config',
      link: '/config/index',
      activeMatch: '/config/',
    },
    {
      text: 'API',
      link: '/api',
      activeMatch: '/api/',
    },
    { text: 'Playground', link: 'https://stackblitz.com/edit/prayer-ts?file=src%2FPrayerTimes.ts' },
    {
      text: version,
      items: [
        {
          text: 'Changelog',
          link: 'https://github.com/whiterocktech/prayers-call/blob/master/CHANGELOG.md',
        },
        {
          text: 'Contributing',
          link: 'https://github.com/whiterocktech/prayers-call/blob/master/CONTRIBUTING.md',
        },
      ],
    },
  ]
}

function sidebarGuide() {
  return [
    {
      text: 'Guide',
      collapsible: true,
      items: [
        { text: 'Introduction', link: '/guide/introduction' },
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Core Concepts', link: '/guide/concepts' },

        { text: 'Static Calculator', link: '/guide/one-time-calculator' },
        { text: 'Reactive Calculator', link: '/guide/reactive-calculator' },

        { text: 'Calculating The Qibla', link: '/guide/calculating-the-qibla' },
      ],
    },
    {
      text: 'Recipes',
      collapsible: true,
      items: [
        { text: 'Date/Time Formatting', link: '/recipes/formatters' },
        { text: 'Hijri Dates', link: '/recipes/hijri' },
        { text: 'Internalization (I18n)', link: '/recipes/i18n' },
        { text: 'Testing', link: '/recipes/testing' },
      ],
    },
    {
      text: 'Config',
      collapsible: true,
      items: [
        { text: 'Config Reference', link: '/config/index' },
        { text: 'Calculation Methods', link: '/config/methods' },
      ],
    },
    {
      text: 'API',
      collapsible: true,
      items: [{ text: 'API Reference', link: '/api' }],
    },
  ]
}
