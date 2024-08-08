import browser from './browser';
import javascript from './javascript';
import leetcode from './leetcode';
import net from './net';
import typescript from './typescript';

export default {
  title: '知识碎片',
  link: '/fragment',
  children: [...javascript, ...net, ...browser, ...leetcode, ...typescript],
};
