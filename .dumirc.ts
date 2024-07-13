import { defineConfig } from 'dumi';

export default defineConfig({
  fastRefresh: true,
  base: '/blog/',
  publicPath: '/blog/',
  favicons: false,
  themeConfig: {
    name: "Moooo's blog",
    logo: false,
    footer: 'Copyright © 2024 | Powered by Moooo',
    nav: [
      {
        title: '碎片',
        link: '/fragment',
      },
      {
        title: '工程化',
        link: '/engineer',
        children: [
          {
            title: 'aaaa',
            link: '/engineer',
          },
          {
            title: 'NPM',
            link: '/engineer/npm',
          },
        ],
      },
      {
        title: 'React',
        link: '/react',
      },
    ],
  },
});
