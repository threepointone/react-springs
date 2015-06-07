react-springs
---

(bring your family and friends)

`npm install react-springs react rebound --save`

Dynamic animations for react, powered by rebound.

```js
// output floats gradually from 0 to 10
<Spring to={10}>
  {val => <div>{val}</div>}       // yes, children is a function.
</Spring>

// you can compose multiple springs
<Springs to={{x: 20, y: 30}} tension={30} overShootClamping={true}>
  {val => <div style={{...styles.box, ...val}}></div>
</Springs>

// alternately, if you want control on each spring
<Spring to={20} tension={15} friction={1.5}>
  {xval =>
    <Spring to={30} tension={34} friction={7}>
      {yval =>
        <div style={{...styles.box, ...styles.blue, left: xval, top: yval}}/> }
    </Spring> }
</Spring>
```

props
---

- to (Spring): *number* : sets end value for the spring. if `atRest` is `true`, then the spring immediately snaps to `to`.
- to (Springs): *obj* : similar to `Spring`, but accepts a map of key-values.
- from: *number* : sets start value for a spring. setting it while a spring is in motion will set its current value to `from`, and continue to `to`
- atRest: *boolean*
- friction: *number*
- tension: *number*
- overShootClamping: *boolean*

dev
---

`npm install`

`npm start`