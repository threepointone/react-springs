'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

// the above bit should get better after https://github.com/facebook/react/issues/3220

// springs, all that

var _rebound = require('rebound');

var _rebound2 = _interopRequireDefault(_rebound);

var React;
try {
  React = require('react-native');
} catch (e) {
  React = require('react');
}

var noop = function noop() {}; // default onSpringUpdate

var Spring = React.createClass({
  displayName: 'Spring',

  getDefaultProps: function getDefaultProps() {
    return {
      // we use a common 'global' springSystem for perf, but you can pass in your own
      springSystem: new _rebound2['default'].SpringSystem(),

      // from and to are analogous to setCurrentValue() and setEndValue()
      from: 0,
      to: 0,

      // more rebound options
      tension: 50,
      friction: 3,
      overShootClamping: false,
      atRest: false,
      onSpringUpdate: noop,
      onSpring: noop,
      children: function children() {
        return null

        // todo - velocity?
        ;
      } };
  },

  propTypes: {
    from: React.PropTypes.number,
    friction: React.PropTypes.number,
    tension: React.PropTypes.number,
    to: React.PropTypes.number,
    atRest: React.PropTypes.bool,
    overShootClamping: React.PropTypes.bool,
    children: React.PropTypes.func,
    onSpringUpdate: React.PropTypes.func,
    onSpring: React.PropTypes.func
  },

  statics: {
    // high perf "setters",
    friction: function friction(spring, props) {
      spring.getSpringConfig().friction = _rebound2['default'].OrigamiValueConverter.frictionFromOrigamiValue(props.friction);
    },
    tension: function tension(spring, props) {
      spring.getSpringConfig().tension = _rebound2['default'].OrigamiValueConverter.frictionFromOrigamiValue(props.tension);
    },
    from: function from(spring, props) {
      spring.setCurrentValue(props.from, true).setEndValue(spring.getEndValue());
    },
    overShootClamping: function overShootClamping(spring, props) {
      spring.setOvershootClampingEnabled(props.overShootClamping);
    },
    to: function to(spring, props) {
      if (props.atRest) {
        spring.setCurrentValue(props.to).setAtRest();
      } else {
        spring.setEndValue(props.to);
      }
    }
  },

  accept: function accept(props, initial) {
    var _this = this;

    Object.keys(props).forEach(function (k) {
      if (Spring[k] && (initial || props[k] !== _this.props[k])) {
        Spring[k](_this.spring, props);
      }
    });
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    return true;
    // components with 'render callbacks' can/should render 'through'.
  },

  getInitialState: function getInitialState() {
    return {
      value: this.props.from
    };
  },

  componentWillMount: function componentWillMount() {
    var _this2 = this;

    // create the spring on mounting.
    this.spring = this.props.springSystem.createSpring(this.props.tension, this.props.friction).addListener({
      onSpringUpdate: function onSpringUpdate() {
        _this2.setState({ value: _this2.spring.getCurrentValue() });
        _this2.props.onSpringUpdate(_this2.spring);
      }
    });
    this.props.onSpring(this.spring);
    this.accept(this.props, true);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.accept(nextProps, false);
  },

  componentWillUnmount: function componentWillUnmount() {
    // ...and destroy on onmounting
    this.spring.destroy();
    delete this.spring;
    this.props.onSpring(undefined);
  },

  render: function render() {
    return this.props.children(this.state.value);
  }
});

exports.Spring = Spring;
var Springs = React.createClass({
  displayName: 'Springs',

  getDefaultProps: function getDefaultProps() {
    return {
      onSpringUpdate: noop,
      onSpring: noop,
      children: function children() {
        return null;
      }
    };
  },

  propTypes: {
    onSpringUpdate: React.PropTypes.func,
    onSpring: React.PropTypes.func,
    children: React.PropTypes.func
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    return true;
    // like above
  },
  onSpringUpdate: function onSpringUpdate(key, spring) {
    this.setState(_defineProperty({}, key, spring.getCurrentValue()));
    this.props.onSpringUpdate(key, spring);
  },

  to: function to(pos, keys, index, value) {
    var _this3 = this;

    if (index === -1) {
      return this.props.children(value);
    }
    var key = keys[index];
    return React.createElement(
      Spring,
      _extends({}, this.props, { key: key, to: pos[key], onSpring: function (spring) {
          return _this3.props.onSpring(key, spring);
        }, onSpringUpdate: function (spring) {
          return _this3.onSpringUpdate(key, spring);
        } }),
      function (val) {
        return _this3.to(pos, keys, index - 1, (value[key] = val, value));
      }
    );
  },

  // todo - sort keys alphabetically?
  render: function render() {
    // what we do here, is break `to` into key value pairs, and then return a nest of <Spring>s
    // React takes care of the boring bits (caching, state, etc)
    var to = this.props.to;var keys = Object.keys(to);
    return this.to(to, keys, keys.length - 1, {});
  }
});
exports.Springs = Springs;
