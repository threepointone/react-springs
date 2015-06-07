import React from 'react';
import rebound from 'rebound';

let noop = () => {};

export const Spring = React.createClass({
  getDefaultProps(){
    return {
      from: 0,
      to: 0,
      tension: 50,
      friction: 3,
      overShootClamping: false,
      atRest: false,
      onSpringUpdate: noop
    };
  },
  shouldComponentUpdate(nextProps, nextState){
    if(nextState.value !== undefined){
      return true;
    }
    return false;
  },
  propTypes: {
    from: React.PropTypes.number,
    friction: React.PropTypes.number,
    tension: React.PropTypes.number,
    to: React.PropTypes.number,
    atRest: React.PropTypes.bool,
    overShootClamping: React.PropTypes.bool,
    children: React.PropTypes.func
  },

  update(props, spring, springSystem){
    var map = {
      friction: () => {
        spring.getSpringConfig().friction =
          rebound.OrigamiValueConverter.frictionFromOrigamiValue(props.friction);
      },
      tension: () => {
        spring.getSpringConfig().tension =
          rebound.OrigamiValueConverter.tensionFromOrigamiValue(props.tension);
      },
      from: pos => {
        if(this.props.from !== pos){
          spring.setCurrentValue(pos);
        }
      },
      to: pos => {
        if(props.atRest){
          spring.setCurrentValue(pos).setAtRest();
        }
        else{
          spring.setEndValue(pos);
        }
      },
      overShootClamping: bool => {
        spring.setOvershootClampingEnabled(bool);
      }
    };

    Object.keys(props).forEach(k => (map[k] || noop)(props[k]));
  },

  componentWillMount() {
    let springSystem = new rebound.SpringSystem();
    let spring = springSystem.createSpring(this.props.tension, this.props.friction);

    spring.addListener({
      onSpringUpdate: () => {
        this.setState({value: spring.getCurrentValue() });

        this.props.onSpringUpdate(spring);
      }
    });
    this.update(this.props, spring, springSystem);
    this.setState({spring, springSystem});
  },
  componentWillUnmount() {
    this.state.spring.removeAllListeners();
    // this.state.springSystem.destroy();
  },
  componentWillReceiveProps(nextProps) {
    this.update(nextProps, this.state.spring, this.state.springSystem);
  },

  render(){
    return this.props.children(this.state.spring.getCurrentValue());
  }
});



export const Springs = React.createClass({
  to(pos, keys, value, callback){
    if(keys.length === 0){
      return callback(value);
    }
    return <Spring {...this.props} to={pos[keys[0]]}>
      {val => this.to(pos, keys.slice(1), {...value, [keys[0]]: val}, callback)}
    </Spring>;

  },
  // todo - sort keys alphabetically
  render() {
    var tree = this.to(this.props.to, Object.keys(this.props.to), {}, this.props.children);
    return tree;
  }
});

