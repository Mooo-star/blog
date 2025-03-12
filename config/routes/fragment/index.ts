import browser from './browser';
import engineer from './engineer';
import javascript from './javascript';
import leetcode from './leetcode';
import net from './net';
import typescript from './typescript';
import other from './other'

export default {
  title: '知识碎片',
  link: '/fragment',
  children: [
    ...javascript,
    ...net,
    ...browser,
    ...engineer,
    ...leetcode,
    ...typescript,
    ...other,
  ],
};
