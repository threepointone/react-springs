var React;
try{ React = require('react-native'); }
catch(e){ React = require('react'); }
// the above bit should get better after https://github.com/facebook/react/issues/3220

// springs, all that
import rebound from 'rebound';

let noop = () => {}; // default onSpringUpdate

export const Spring = React.createClass({
  getDefaultProps(){
    return {
      // we use a common 'global' springSystem for perf, but you can pass in your own
      springSystem: new rebound.SpringSystem(),

      // from and to and analogous to setCurrentValue() and setEndValue()
      from: 0,
      to: 0,

      // more rebound options
      tension: 50,
      friction: 3,
      overShootClamping: false,
      atRest: false,
      onSpringUpdate: noop

      // todo - velocity?
    };
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

  shouldComponentUpdate(){
    return true;
    // don't be surprised, this is fine,
    // since 'children' would have been rendered without Spring in the way
  },

  accept(props, initial){
    Object.keys(props).forEach(k => {
      if(Spring[k] && (initial || (props[k] !== this.props[k]))){
        Spring[k](this.spring, props);
      }
    });
  },

  getInitialState() {
    return {
      value: this.props.from
    };
  },

  componentWillReceiveProps(nextProps) {
    this.accept(nextProps, false);
  },

  componentWillMount() {
    // create a the sping on mounting.
    this.spring = this.props.springSystem.createSpring(this.props.tension, this.props.friction).addListener({
      onSpringUpdate: () => {
        this.setState({ value: this.spring.getCurrentValue() });
        this.props.onSpringUpdate(this.spring);
      }
    });
    this.accept(this.props, true);
  },

  componentWillUnmount() {
    // ...and destroy on onmounting
    this.spring.destroy();
    delete this.spring;
  },

  render(){
    return this.props.children(this.state.value);
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
    // like above
  },

  to(pos, keys, value){
    if(keys.length === 0){
      return this.props.children(value);
    }
    let key = keys[0];
    return <Spring key={key} {...this.props} to={pos[key]} onSpringUpdate={spring => this.props.onSpringUpdate(key, spring)}>
      {val => this.to(pos, keys.slice(1), (value[key] = val, value))}
    </Spring>;
  },

  // todo - sort keys alphabetically?
  render() {
    // what we do here, is break `to` into key value pairs, and then return a nest of <Spring>s
    // React takes care of the boring bits (caching, state, etc)
    return this.to(this.props.to, Object.keys(this.props.to), {});
  }
});

