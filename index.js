'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
      springSystem: new _rebound2['default'].SpringSystem(),
      from: 0,
      to: 0,
      tension: 50,
      friction: 3,
      overShootClamping: false,
      atRest: false,
      onSpringUpdate: noop
    };
  },
  shouldComponentUpdate: function shouldComponentUpdate() {
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
  update: function update(props, initial) {
    var _this = this;

    Object.keys(props).forEach(function (k) {
      if (Spring[k] && (initial || props[k] !== _this.props[k])) {
        Spring[k](_this.spring, props);
      }
    });
  },
  getInitialState: function getInitialState() {
    return {
      value: this.props.from
    };
  },

  componentWillMount: function componentWillMount() {
    var _this2 = this;

    this.spring = this.props.springSystem.createSpring(this.props.tension, this.props.friction).addListener({
      onSpringUpdate: function onSpringUpdate() {
        _this2.setState({ value: _this2.spring.getCurrentValue() });
        _this2.props.onSpringUpdate(_this2.spring);
      }
    });
    this.update(this.props, true);
  },
  componentWillUnmount: function componentWillUnmount() {
    this.spring.destroy();
    delete this.spring;
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    this.update(nextProps, false);
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
      onSpringUpdate: noop
    };
  },
  propTypes: {
    onSpringUpdate: React.PropTypes.func
  },
  shouldComponentUpdate: function shouldComponentUpdate() {
    return true;
    // don't be surprised, this is fine, since 'children' would have been rendered without Springs in the way
  },
  to: function to(pos, keys, value, callback) {
    var _this3 = this;

    if (keys.length === 0) {
      return callback(value);
    }
    return React.createElement(
      Spring,
      _extends({}, this.props, { to: pos[keys[0]], onSpringUpdate: function (spring) {
          return _this3.props.onSpringUpdate(keys[0], spring);
        } }),
      function (val) {
        return _this3.to(pos, keys.slice(1), (value[keys[0]] = val, value), callback);
      }
    );
  },
  // todo - sort keys alphabetically?
  render: function render() {
    return this.to(this.props.to, Object.keys(this.props.to), {}, this.props.children);
  }
});
exports.Springs = Springs;
