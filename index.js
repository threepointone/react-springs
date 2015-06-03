import 'babel/polyfill';
import React from 'react'; window.React = React;
import {$, App} from './app';

$.init();
React.render(<App/>, document.getElementById('container'));
