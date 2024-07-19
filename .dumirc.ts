import { defineConfig } from 'dumi';
import nav from './config/nav';
import sidebar from './config/sidebar';

export default defineConfig({
  fastRefresh: true,
  base: '/blog/',
  publicPath: '/blog/',
  favicons: false,

  themeConfig: {
    name: "Moooo's blog",
    logo: false,
    footer: 'Copyright © 2024 | Powered by Mooo',
    nav,
    sidebar,
    socialLinks: {
      github: 'https://github.com/Mooo-star/blog',
    },
  },
});
