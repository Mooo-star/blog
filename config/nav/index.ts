import { defineConfig } from 'dumi';
import engineer from './engineer';
import fragment from './fragment';
import node from './node';
import react from './react';

type Nav = ReturnType<typeof defineConfig>;

const nav: Nav = [fragment, engineer, react, node];

export default nav;
