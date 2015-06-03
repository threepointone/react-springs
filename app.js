import React from 'react';

let {Dis, act} = require('disto');

let dis = new Dis();
let {dispatch, register} = dis;

let $ = act(dispatch, {
  init: ''
  // actions
});

register({
  // initial value
}, (o, action, ...args) => {
  switch(action){
    case $.init:
      console.log('started', ...args);
      return o;
    default: return o;
  }
});

export const App = React.createClass({
  render() {
    return <div> something some </div>;
  }
});


