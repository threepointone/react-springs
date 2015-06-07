import React from 'react';
import {Spring, Springs} from './src';

let styles = {
  box: {
    width: 100, height: 100, position: 'absolute'
  },
  blue: {
    backgroundColor: 'blue'
  },
  red: {
    backgroundColor: 'red'
  }
};

export const App = React.createClass({
  getDefaultProps(){
    return {
      x: 0
    };
  },
  getInitialState() {
    return {
      x: this.props.x
    };
  },
  onMouseMove(e){
    this.setState({x: e.clientX, y: e.clientY});
  },

  render() {
    return <div onMouseMove={this.onMouseMove} style={{flex: 1}}>
      <Springs to={{x: this.state.x, y: this.state.y}} tension={10} friction={1}>
        {vals => <div style={{left: vals.x, top: vals.y, ...styles.box, ...styles.red}}></div>}
      </Springs>

      <Spring to={this.state.x} tension={15} friction={1.5}>
        {xval =>
          <Spring to={this.state.y} tension={34} friction={7}>
            {yval => <div style={{left: xval, top: yval, ...styles.box, ...styles.blue}}></div>}
          </Spring>}
      </Spring>
    </div>;
  }
});


