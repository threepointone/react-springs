var React;
try{
  React = require('react-native');
}
catch(e){
  React = require('react');
}

import rebound from 'rebound';

let noop = () => {};

export const Spring = React.createClass({
  getDefaultProps(){
    return {
      springSystem: new rebound.SpringSystem(),
      from: 0,
      to: 0,
      tension: 50,
      friction: 3,
      overShootClamping: false,
      atRest: false,
      onSpringUpdate: noop
    };
  },
  shouldComponentUpdate(){
    return true;
    // don't be surprised, this is fine, since 'children' would have been rendered without Spring in the way
  },
  propTypes: {
    from: React.PropTypes.number,
    friction: React.PropTypes.number,
    tension: React.PropTypes.number,
    to: React.PropTypes.number,
    atRest: React.PropTypes.bool,
    overShootClamping: React.PropTypes.bool,
    children: React.PropTypes.func,
    onSpringUpdate: React.PropTypes.func
  },
  statics: {
    // high perf "setters",
    friction(spring, props){
      spring.getSpringConfig().friction =
        rebound.OrigamiValueConverter.frictionFromOrigamiValue(props.friction);
    },
    tension(spring, props){
      spring.getSpringConfig().tension =
        rebound.OrigamiValueConverter.frictionFromOrigamiValue(props.tension);
    },
    from(spring, props){
      spring.setCurrentValue(props.from, true).setEndValue(spring.getEndValue());
    },
    overShootClamping(spring, props){
      spring.setOvershootClampingEnabled(props.overShootClamping);
    },
    to(spring, props){
      if(props.atRest){
        spring.setCurrentValue(props.to).setAtRest();
      }
      else{
        spring.setEndValue(props.to);
      }
    }
  },
  update(props, initial){
    Object.keys(props).forEach(k => {
      if(Spring[k] && (initial || (props[k] !== this.props[k]))){
        Spring[k](this.state.spring, props);
      }
    });
  },
  getInitialState() {
    return {
      spring: this.props.springSystem.createSpring(this.props.tension, this.props.friction).addListener({
        onSpringUpdate: () => {
          this.setState({value: this.state.spring.getCurrentValue() });
          this.props.onSpringUpdate(this.state.spring);
        }
      })
    };
  },

  componentWillMount() {
    this.update(this.props, true);
  },
  componentWillUnmount() {
    this.state.spring.removeAllListeners();
    // this.state.springSystem.destroy();
  },
  componentWillReceiveProps(nextProps) {
    this.update(nextProps, false);
  },

  render(){
    return this.props.children(this.state.spring.getCurrentValue());
  }
});

export const Springs = React.createClass({
  getDefaultProps(){
    return {
      onSpringUpdate: noop
    };
  },
  propTypes: {
    onSpringUpdate: React.PropTypes.func
  },
  shouldComponentUpdate(){
    return true;
    // don't be surprised, this is fine, since 'children' would have been rendered without Springs in the way
  },
  to(pos, keys, value, callback){
    if(keys.length === 0){
      return callback(value);
    }
    return <Spring {...this.props} to={pos[keys[0]]} onSpringUpdate={spring => this.props.onSpringUpdate(keys[0], spring)}>
      {val => this.to(pos, keys.slice(1), (value[keys[0]] = val, value), callback)}
    </Spring>;

  },
  // todo - sort keys alphabetically
  render() {
    return this.to(this.props.to, Object.keys(this.props.to), {}, this.props.children);
  }
});

