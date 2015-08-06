// springs, all that
import rebound from 'rebound';

const noop = () => {}; // default onSpringUpdate

const setters = {
  friction(spring, props){
    spring.getSpringConfig().friction =
      rebound.OrigamiValueConverter.frictionFromOrigamiValue(props.friction);
  },
  tension(spring, props){
    spring.getSpringConfig().tension =
      rebound.OrigamiValueConverter.frictionFromOrigamiValue(props.tension);
  },
  // from(spring, props){
  //   spring.setCurrentValue(props.from, true).setEndValue(spring.getEndValue());
  // },
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
};

export default function components(React){
  class Spring extends React.Component{
    static defaultProps = {
      // we use a common 'global' springSystem for perf, but you can pass in your own
      springSystem: new rebound.SpringSystem(),

      // from and to are analogous to setCurrentValue() and setEndValue()
      from: 0,
      to: 0,

      // more rebound options
      tension: 50,
      friction: 3,
      overShootClamping: false,
      atRest: false,
      onSpringUpdate: noop,
      children: () => null

      // todo - velocity?
    }

    static propTypes = {
      from: React.PropTypes.number,
      friction: React.PropTypes.number,
      tension: React.PropTypes.number,
      to: React.PropTypes.number,
      atRest: React.PropTypes.bool,
      overShootClamping: React.PropTypes.bool,
      children: React.PropTypes.func,
      onSpringUpdate: React.PropTypes.func
    }

    accept(props, initial){
      Object.keys(props).forEach(k => {
        if(setters[k] && (initial || (props[k] !== this.props[k]))){
          setters[k](this.spring, props);
        }
      });
    }

    state = {
      value: this.props.from
    }

    shouldComponentUpdate(){
      return true;
      // components with 'render callbacks' can/should render 'through'.
    }

    componentWillMount() {
      // create the spring on mounting.
      this.spring = this.props.springSystem.createSpring(this.props.tension, this.props.friction);

      this.spring.addListener({
        onSpringUpdate: () => {
          this.setState({ value: this.spring.getCurrentValue() });
          this.props.onSpringUpdate(this.spring);
        }
      });

      this.spring.setCurrentValue(this.props.from, true);

      this.accept(this.props, true);
    }

    componentWillReceiveProps(nextProps) {
      this.accept(nextProps, false);
    }

    componentWillUnmount() {
      // ...and destroy on onmounting
      this.spring.destroy();
      delete this.spring;
    }

    render(){
      return this.props.children(this.state.value, this.spring);
    }
  }

  /////////////////////////////////////////

  class Springs extends React.Component{
    static defaultProps = {
      onSpringUpdate: noop,
      children: () => null
    }

    static propTypes: {
      onSpringUpdate: React.PropTypes.func,
      children: React.PropTypes.func
    }

    shouldComponentUpdate(){
      return true;
      // like above
    }
    onSpringUpdate(key, spring){
      this.setState({
        [key]: spring.getCurrentValue()
      });
      this.props.onSpringUpdate(key, spring);
    }

    to(pos, keys, index, value, springs){
      if(index === -1){
        return this.props.children(value, springs);
      }
      const key = keys[index];
      return <Spring {...this.props} key={key} to={pos[key]} onSpringUpdate={spring => this.onSpringUpdate(key, spring)}>
        {(val, spring) => this.to(pos, keys, index - 1, (value[key] = val, value), (springs[key] = spring, springs))}
      </Spring>;
    }

    // todo - sort keys alphabetically?
    render() {
      // what we do here, is break `to` into key value pairs, and then return a nest of <Spring>s
      // React takes care of the boring bits (caching, state, etc)
      const {to} = this.props, keys = Object.keys(to);
      return this.to(to, keys, keys.length - 1, {}, {});
    }
  }

  return {Spring, Springs};
}

