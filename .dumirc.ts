import { defineConfig } from 'dumi';
import nav from './config/nav';

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
  },
});
