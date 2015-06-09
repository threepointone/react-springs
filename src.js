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

  update(props, spring, initial){
    Object.keys(props).forEach(k => {
      if(Spring[k] && (initial || (props[k] !== this.props[k]))){
        Spring[k](spring, props);
      }
    });
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
    this.update(this.props, spring, true);
    this.setState({spring, springSystem});
  },
  componentWillUnmount() {
    this.state.spring.removeAllListeners();
    // this.state.springSystem.destroy();
  },
  componentWillReceiveProps(nextProps) {
    this.update(nextProps, this.state.spring, false);
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
    return this.to(this.props.to, Object.keys(this.props.to), {}, this.props.children);
  }
});

