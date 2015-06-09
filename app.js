import React from 'react';
import {Spring, Springs} from './src';
import rebound from 'rebound';


function times (n, fn){
  var arr = [];
  for(var i = 0; i < n; i++){
    arr.push(fn(i));
  }
  return arr;
}

let styles = {
  root: {
    alignItems: 'center',
    paddingTop: 20
  }
};

export const App = React.createClass({
  render() {
    return <div style={styles.root}>
      <Slideshow n={30}/>
      <Followers/>
    </div>;
  }
});


styles.slideshow = {
  wrap: {
    width: 400,
    height: 400,
    outline: '1px solid #ccc'
  },
  bar: {
    flexDirection: 'row',
    height: 60,
    position: 'absolute'
  },
  slide: {
    flex: 1,
    fontSize: 200
  },
  thumb: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    cursor: 'pointer'
  }
};


// ICK
var win;
function winset(){
  win = { width: document.body.offsetWidth };
}
window.addEventListener('resize', winset);
window.addEventListener('load', winset);
winset();

// END ICK


export const Slideshow = React.createClass({
  getInitialState() {
    return {
      x: 0, y: 0, hover: -1, active: 0, opacity: 0, selected: 0
    };
  },
  getDefaultProps(){
    return {n: 100};
  },
  convert(x, y){
    let res = Slideshow.convert(this.props.n * 60, 400, 60, 400, x, y);
    return {
      left: res.left,
      top: res.top
    };
  },

  render() {
    return (
      <div style={styles.slideshow.wrap}
        onMouseMove={e => this.setState({x: e.pageX - ((win.width - 400) / 2), y: e.pageY - 20})}
        onMouseEnter={() => this.setState({opacity: 1})}
        onMouseLeave={() => this.setState({opacity: 0})}>
          <Spring to={1} from={this.state.selected} tension={10} friction={1} overShootClamping={true}>{bg =>
            <div style={{backgroundColor: rebound.util.interpolateColor(bg, '#f5f357', '#fff'), ...styles.slideshow.slide}}>
            {this.state.hover > -1 ? this.state.hover : this.state.active}
          </div>}</Spring>

          <Springs to={{...this.convert(this.state.x, this.state.y), opacity: this.state.opacity}} tension={50} friction={8}>{val =>
            <div style={{...val, width: this.props.n * 60, ...styles.slideshow.bar}} onMouseLeave={() => this.setState({hover: -1})}>
              {times(this.props.n, i =>
                <Spring to={this.state.hover === i ? 1 : 0} overShootClamping={true}>{ bg =>
                  <div key={i} style={{...styles.slideshow.thumb, backgroundColor: rebound.util.interpolateColor(bg, '#ccc', '#fff')}}
                    onMouseEnter={() => this.setState({hover: i})}
                    onClick={()=> this.setState({active: i, selected: (Math.random() / 100)})}>
                      {i}
                  </div>
                }</Spring>
              )}
            </div>
          }</Springs>
      </div>
    );
  },
  statics: {
    convert(W, w, H, h, x, y){
     return {
        left: -1 * ((W - w) / w) * x,   // < - memoization target
        top: (h - H) + (((H - h) / h) * y)   // < - memoization target
      };
    }
  }
});

styles.followers = {
  wrap: {
    width: 400,
    height: 400,
    outline: '1px solid #ccc',
    marginTop: 20
  },
  box: {
    width: 20, height: 20, position: 'absolute'
  },
  blue: {
    backgroundColor: 'blue'
  },
  red: {
    backgroundColor: 'red'
  }
};

export const Followers = React.createClass({
  getInitialState() {
    return {
      x: 0, y: 0
    };
  },
  onMouseMove(e){
    this.setState({x: Math.min(400, Math.max(0, e.pageX - ((win.width - 400) / 2))), y: Math.min(400, Math.max(0, e.pageY - 440))});
  },
  render() {
    return <div onMouseMove={this.onMouseMove} style={styles.followers.wrap}>
      <Springs to={{x: this.state.x, y: this.state.y}} tension={10} friction={1}>
        {vals => <div style={{left: vals.x - 10, top: vals.y - 10, ...styles.followers.box, ...styles.followers.red}}></div>}
      </Springs>

      <Spring to={this.state.x} tension={15} friction={1.5}>{x =>
          <Spring to={this.state.y} tension={34} friction={7}>{y =>
            <div style={{left: x - 10, top: y - 10, ...styles.followers.box, ...styles.followers.blue}}></div>}
          </Spring>}
      </Spring>
    </div>;
  }
});


// export const SlideToUnlock = React.createClass({
//   getInitialState() {
//     return {
//       x: 0,
//       unlocked: false
//     };
//   },
//   onMouseMove(e){
//     this.setState({x: e.pageX, y: e.pageY});
//   },
//   render() {
//     return <div onMouseMove={this.onMouseMove} style={styles.followers.wrap}>
//       <Springs to={{x: this.state.x, y: this.state.y}} tension={10} friction={1}>
//         {vals => <div style={{left: vals.x - 10, top: vals.y - 10, ...styles.followers.box, ...styles.followers.red}}></div>}
//       </Springs>

//       <Spring to={this.state.x} tension={15} friction={1.5}>{x =>
//           <Spring to={this.state.y} tension={34} friction={7}>{y =>
//             <div style={{left: x - 10, top: y - 10, ...styles.followers.box, ...styles.followers.blue}}></div>}
//           </Spring>}
//       </Spring>
//     </div>;
//   }
// });

