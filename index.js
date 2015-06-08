'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

// import React from 'react';

var _rebound = require('rebound');

var _rebound2 = _interopRequireDefault(_rebound);

var React;
try {
  React = require('react-native');
} catch (e) {
  React = require('react');
}

var noop = function noop() {};

var Spring = React.createClass({
  displayName: 'Spring',

  getDefaultProps: function getDefaultProps() {
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
  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
    if (nextState.value !== undefined) {
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

  update: function update(props, spring, springSystem) {
    var _this = this;

    var map = {
      friction: function friction() {
        spring.getSpringConfig().friction = _rebound2['default'].OrigamiValueConverter.frictionFromOrigamiValue(props.friction);
      },
      tension: function tension() {
        spring.getSpringConfig().tension = _rebound2['default'].OrigamiValueConverter.tensionFromOrigamiValue(props.tension);
      },
      from: function from(pos) {
        if (_this.props.from !== pos) {
          spring.setCurrentValue(pos);
        }
      },
      to: function to(pos) {
        if (props.atRest) {
          spring.setCurrentValue(pos).setAtRest();
        } else {
          spring.setEndValue(pos);
        }
      },
      overShootClamping: function overShootClamping(bool) {
        spring.setOvershootClampingEnabled(bool);
      }
    };

    Object.keys(props).forEach(function (k) {
      return (map[k] || noop)(props[k]);
    });
  },

  componentWillMount: function componentWillMount() {
    var _this2 = this;

    var springSystem = new _rebound2['default'].SpringSystem();
    var spring = springSystem.createSpring(this.props.tension, this.props.friction);

    spring.addListener({
      onSpringUpdate: function onSpringUpdate() {
        _this2.setState({ value: spring.getCurrentValue() });

        _this2.props.onSpringUpdate(spring);
      }
    });
    this.update(this.props, spring, springSystem);
    this.setState({ spring: spring, springSystem: springSystem });
  },
  componentWillUnmount: function componentWillUnmount() {
    this.state.spring.removeAllListeners();
    // this.state.springSystem.destroy();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.update(nextProps, this.state.spring, this.state.springSystem);
  },

  render: function render() {
    return this.props.children(this.state.spring.getCurrentValue());
  }
});

exports.Spring = Spring;
var Springs = React.createClass({
  displayName: 'Springs',

  to: function to(pos, keys, value, callback) {
    var _this3 = this;

    if (keys.length === 0) {
      return callback(value);
    }
    return React.createElement(
      Spring,
      _extends({}, this.props, { to: pos[keys[0]] }),
      function (val) {
        return _this3.to(pos, keys.slice(1), _extends({}, value, _defineProperty({}, keys[0], val)), callback);
      }
    );
  },
  // todo - sort keys alphabetically
  render: function render() {
    var tree = this.to(this.props.to, Object.keys(this.props.to), {}, this.props.children);
    return tree;
  }
});
exports.Springs = Springs;
