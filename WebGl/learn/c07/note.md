## from frustum to canonical view volume
### normal perspective

> previous version
>> projection --- m4.projection: project a bastard space to a standard space (x, y, z in -1 to 1, respectively)
>> perspective --- scale (x, y) based on z, such as `x / (1.0 + z * fudgement)`
>
> current version
>> perspective --- use an unique matrix to convert all of these


```javascript
perspective: function(fieldOfViewInRadians, aspect, near, far) {
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);

  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
}
```

this function is widely used in perspective

### how to get this function ??

![deduce](./deduce.jpg)

