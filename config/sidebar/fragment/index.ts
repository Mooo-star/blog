import browser from '../../routes/fragment/browser';
import engineer from '../../routes/fragment/engineer';
import javascript from '../../routes/fragment/javascript';
import leetcode from '../../routes/fragment/leetcode';
import net from '../../routes/fragment/net';
import typescript from '../../routes/fragment/typescript';

export default [
  {
    title: 'JavaScript',
    children: javascript,
  },
  {
    title: '网络',
    children: net,
  },
  {
    title: '浏览器',
    children: browser,
  },
  {
    title: '工程化',
    children: engineer,
  },
  {
    title: '算法',
    children: leetcode,
  },
  {
    title: 'TypeScript',
    children: typescript,
  },
];
