// springs, all that
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports['default'] = components;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _rebound = require('rebound');

var _rebound2 = _interopRequireDefault(_rebound);

var noop = function noop() {}; // default onSpringUpdate

var setters = {
  friction: function friction(spring, props) {
    spring.getSpringConfig().friction = _rebound2['default'].OrigamiValueConverter.frictionFromOrigamiValue(props.friction);
  },
  tension: function tension(spring, props) {
    spring.getSpringConfig().tension = _rebound2['default'].OrigamiValueConverter.frictionFromOrigamiValue(props.tension);
  },
  // from(spring, props){
  //   spring.setCurrentValue(props.from, true).setEndValue(spring.getEndValue());
  // },
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
};

function components(React) {
  var Spring = (function (_React$Component) {
    function Spring() {
      _classCallCheck(this, Spring);

      if (_React$Component != null) {
        _React$Component.apply(this, arguments);
      }

      this.state = {
        value: this.props.from
      };
    }

    _inherits(Spring, _React$Component);

    _createClass(Spring, [{
      key: 'accept',
      value: function accept(props, initial) {
        var _this = this;

        Object.keys(props).forEach(function (k) {
          if (setters[k] && (initial || props[k] !== _this.props[k])) {
            setters[k](_this.spring, props);
          }
        });
      }
    }, {
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate() {
        return true;
        // components with 'render callbacks' can/should render 'through'.
      }
    }, {
      key: 'componentWillMount',
      value: function componentWillMount() {
        var _this2 = this;

        // create the spring on mounting.
        this.spring = this.props.springSystem.createSpring(this.props.tension, this.props.friction).addListener({
          onSpringUpdate: function onSpringUpdate() {
            _this2.setState({ value: _this2.spring.getCurrentValue() });
            _this2.props.onSpringUpdate(_this2.spring);
          }
        }).setCurrentValue(this.props.from, true);

        this.accept(this.props, true);
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        this.accept(nextProps, false);
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        // ...and destroy on onmounting
        this.spring.destroy();
        delete this.spring;
      }
    }, {
      key: 'render',
      value: function render() {
        return this.props.children(this.state.value, this.spring);
      }
    }], [{
      key: 'defaultProps',
      value: {
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
        children: function children() {
          return null

          // todo - velocity?
          ;
        } },
      enumerable: true
    }, {
      key: 'propTypes',
      value: {
        from: React.PropTypes.number,
        friction: React.PropTypes.number,
        tension: React.PropTypes.number,
        to: React.PropTypes.number,
        atRest: React.PropTypes.bool,
        overShootClamping: React.PropTypes.bool,
        children: React.PropTypes.func,
        onSpringUpdate: React.PropTypes.func
      },
      enumerable: true
    }]);

    return Spring;
  })(React.Component);

  var Springs = (function (_React$Component2) {
    function Springs() {
      _classCallCheck(this, Springs);

      if (_React$Component2 != null) {
        _React$Component2.apply(this, arguments);
      }
    }

    _inherits(Springs, _React$Component2);

    _createClass(Springs, [{
      key: 'shouldComponentUpdate',
      value: function shouldComponentUpdate() {
        return true;
        // like above
      }
    }, {
      key: 'onSpringUpdate',
      value: function onSpringUpdate(key, spring) {
        this.setState(_defineProperty({}, key, spring.getCurrentValue()));
        this.props.onSpringUpdate(key, spring);
      }
    }, {
      key: 'to',
      value: function to(pos, keys, index, value, springs) {
        var _this3 = this;

        if (index === -1) {
          return this.props.children(value, springs);
        }
        var key = keys[index];
        return React.createElement(
          Spring,
          _extends({}, this.props, { key: key, to: pos[key], onSpringUpdate: function (spring) {
              return _this3.onSpringUpdate(key, spring);
            } }),
          function (val, spring) {
            return _this3.to(pos, keys, index - 1, (value[key] = val, value), (springs[key] = spring, springs));
          }
        );
      }
    }, {
      key: 'render',

      // todo - sort keys alphabetically?
      value: function render() {
        // what we do here, is break `to` into key value pairs, and then return a nest of <Spring>s
        // React takes care of the boring bits (caching, state, etc)
        var to = this.props.to;var keys = Object.keys(to);
        return this.to(to, keys, keys.length - 1, {}, {});
      }
    }], [{
      key: 'defaultProps',
      value: {
        onSpringUpdate: noop,
        children: function children() {
          return null;
        }
      },
      enumerable: true
    }]);

    return Springs;
  })(React.Component);

  return { Spring: Spring, Springs: Springs };
}

module.exports = exports['default'];