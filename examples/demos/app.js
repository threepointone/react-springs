import React from 'react';
import {Spring, Springs} from '../../src';
import rebound from 'rebound';

function times (n, fn){
  var arr = [];
  for(var i = 0; i < n; i++){ arr.push(fn(i)); }
  return arr;
}

let styles = {};

styles.slideshow = {
  wrap: { width: 400, height: 400, outline: '1px solid #ccc' },
  bar: { flexDirection: 'row', height: 60, position: 'absolute' },
  slide: { flex: 1, fontSize: 200, alignItems: 'center', justifyContent: 'center' },
  thumb: { justifyContent: 'center', alignItems: 'center', flex: 1, cursor: 'pointer' }
};


// ICK
var win; let winset = () => (win = { width: document.body.offsetWidth }); window.addEventListener('resize', winset); window.addEventListener('load', winset); winset();
// END ICK

export const Slideshow = React.createClass({
  getInitialState() {
    return {
      x: 0, y: 0, hover: -1, active: 0, opacity: 0, selected: 1
    };
  },
  getDefaultProps(){
    return {n: 100};
  },
  convert(x, y){
    return Slideshow.convert(this.props.n * 60, 400, 60, 400, x, y);
  },

  render() {
    return (
      <div style={styles.slideshow.wrap}
        onMouseMove={e => this.setState({x: e.pageX - ((win.width - 400) / 2), y: e.pageY - ((this.props.pos * 420) + 20)})}
        onMouseEnter={() => this.setState({opacity: 1})}
        onMouseLeave={() => this.setState({opacity: 0})}>
          <Spring to={1} from={this.state.selected} tension={5} friction={1} overshootClamping={true}>{bg =>
            <div style={{backgroundColor: rebound.util.interpolateColor(bg, '#ddd', '#fff'), ...styles.slideshow.slide}}>
            {this.state.active}
          </div>}</Spring>

          <Springs to={{...this.convert(this.state.x, this.state.y), opacity: this.state.opacity}} tension={50} friction={8}>{val =>
            <div style={{...val, width: this.props.n * 60, ...styles.slideshow.bar}} onMouseLeave={() => this.setState({hover: -1})}>
              {times(this.props.n, i =>
                <Spring key={i} to={this.state.hover === i ? 1 : 0} overshootClamping={true}>{ bg =>
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
  wrap: { width: 400, height: 400, outline: '1px solid #ccc', marginTop: 20 },
  box: { width: 20, height: 20, position: 'absolute', borderRadius: 10 },
  blue: { backgroundColor: 'blue' },
  red: { backgroundColor: 'red' }
};

export const Followers = React.createClass({
  getInitialState() {
    return {
      x: 0, y: 0
    };
  },
  onMouseMove(e){
    this.setState({x: Math.min(400, Math.max(0, e.pageX - ((win.width - 400) / 2))), y: Math.min(400, Math.max(0, e.pageY - ((this.props.pos * 420) + 20)))});
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

styles.unlock = {
  wrap: { width: 400, height: 400, outline: '1px solid #ccc', marginTop: 20, justifyContent: 'center' },
  lockscreen: { width: 200, height: 50, backgroundColor: '#ccc', position: 'absolute', top: '50%', marginTop: -25, left: '50%',
    marginLeft: -100, justifyContent: 'center', alignItems: 'center', borderRadius: 30 },
  key: { width: 50, height: 50, position: 'absolute', top: 0, backgroundColor: '#fff', cursor: 'pointer', alignItems: 'center',
    justifyContent: 'center', borderRadius: 30, boxShadow: '2px 2px 10px #aaa' },
  main: { backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', color: 'white', flex: 1 },
  lock: { cursor: 'pointer' },
   noSelect: { 'WebkitTouchCallout': 'none', 'WebkitUserSelect': 'none', 'KhtmlUserSelect': 'none',
    'MozUserSelect': 'none', 'MsUserSelect': 'none', 'UserSelect': 'none' }
};

export const SlideToUnlock = React.createClass({
  getInitialState() {
    return {
      x: 0,
      unlocking: false,
      opacity: 0,
      delta: 0

    };
  },
  onMouseMove(e){
    this.setState({x: this.state.unlocking ? Math.min(200, Math.max(0, e.pageX - ((win.width - 200) / 2))) : this.state.x});
  },
  onKeyMouseDown(e){
    let x = Math.min(200, Math.max(0, e.pageX - ((win.width - 200) / 2))) - document.getElementById('keyElement').offsetLeft;
    this.setState({
      unlocking: true,
      x: x,
      delta: x
    });
  },
  onMouseUp(){
    this.setState({
      unlocking: false,
      opacity: this.state.x > 190 ? 1 : 0,
      ...(this.state.x > 190 ? {} : {x: 0, delta: 0})
    });
  },
  render() {
    return <Springs to={{x: this.state.x, opacity: this.state.opacity, delta: this.state.delta}} tension={70} friction={8} overshootClamping={true}>{ val =>
      <div style={{...styles.unlock.wrap, ...styles.unlock.noSelect}} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}>
        <div style={{...styles.unlock.lockscreen, opacity: 1 - val.opacity, zIndex: Math.round(1 - val.opacity)}}>
          slide
          <div id='keyElement' style={{...styles.unlock.key, left: val.x - val.delta}} onMouseDown={this.onKeyMouseDown}> > </div>
        </div>
        <div style={{...styles.unlock.main, opacity: val.opacity, zIndex: Math.round(val.opacity)}}>
          <div style={styles.unlock.lock} onClick={()=> this.setState({opacity: 0, x: 0, delta: 0})}>
            click
          </div>
        </div>
      </div>
    }</Springs>;

  }
});


styles.root = { alignItems: 'center', paddingTop: 20, paddingBottom: 20 };

export const App = React.createClass({
  render() {
    return <div style={styles.root}>
      <Slideshow n={50} pos={0}/>
      <Followers pos={1}/>
      <SlideToUnlock pos={2}/>
    </div>;
  }
});
